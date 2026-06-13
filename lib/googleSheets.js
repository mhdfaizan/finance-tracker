const { google } = require("googleapis");
const { SHEETS, SHEET_HEADERS } = require("./constants");

function getAuthClient() {
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyRaw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set");
  }
  let key;
  try {
    key = JSON.parse(
      keyRaw.startsWith("{") ? keyRaw : Buffer.from(keyRaw, "base64").toString()
    );
  } catch {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY format");
  }
  return new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getSheetsClient() {
  const auth = getAuthClient();
  return google.sheets({ version: "v4", auth });
}

const sheetIdCache = {};

function getSheetId() {
  if (!sheetIdCache.id) {
    sheetIdCache.id = process.env.SHEET_ID;
  }
  if (!sheetIdCache.id) {
    throw new Error("SHEET_ID environment variable not set");
  }
  return sheetIdCache.id;
}

async function ensureSheet(sheetName) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: getSheetId(),
    });
    const exists = spreadsheet.data.sheets.some(
      (s) => s.properties.title === sheetName
    );
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: getSheetId(),
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: sheetName },
              },
            },
          ],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: getSheetId(),
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [SHEET_HEADERS[sheetName]],
        },
      });
    }
    return sheets;
  } catch (err) {
    const sheets = await getSheetsClient();
    return sheets;
  }
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = row[i] ?? "";
  });
  return obj;
}

async function appendRow(sheetName, data) {
  const sheets = await ensureSheet(sheetName);
  const headers = SHEET_HEADERS[sheetName];
  const values = headers.map((h) => data[h] ?? "");
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
  return data;
}

async function readAll(sheetName) {
  const sheets = await ensureSheet(sheetName);
  const headers = SHEET_HEADERS[sheetName];
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A1:Z`,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  return rows.slice(1).map((row) => rowToObject(headers, row));
}

async function findById(sheetName, id) {
  const records = await readAll(sheetName);
  return records.find((r) => r.id === id) || null;
}

async function updateRow(sheetName, id, updates) {
  const sheets = await ensureSheet(sheetName);
  const headers = SHEET_HEADERS[sheetName];
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A:Z`,
  });
  const rows = res.data.values || [];
  const headerRow = rows[0] || [];
  const idColIndex = headerRow.indexOf("id");
  if (idColIndex === -1) throw new Error("id column not found");
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idColIndex] === id) {
      rowIndex = i + 1;
      break;
    }
  }
  if (rowIndex === -1) throw new Error(`Record with id ${id} not found`);
  const existing = rowToObject(headers, rows[rowIndex - 1] || []);
  const merged = { ...existing, ...updates };
  const values = headers.map((h) => merged[h] ?? "");
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: { values: [values] },
  });
  return merged;
}

async function deleteRow(sheetName, id) {
  const sheets = await ensureSheet(sheetName);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `${sheetName}!A:Z`,
  });
  const rows = res.data.values || [];
  const headerRow = rows[0] || [];
  const idColIndex = headerRow.indexOf("id");
  if (idColIndex === -1) throw new Error("id column not found");
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idColIndex] === id) {
      rowIndex = i;
      break;
    }
  }
  if (rowIndex === -1) throw new Error(`Record with id ${id} not found`);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: getSheetId(),
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });
  return { id, deleted: true };
}

module.exports = {
  appendRow,
  readAll,
  findById,
  updateRow,
  deleteRow,
  ensureSheet,
};
