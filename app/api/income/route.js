import { NextResponse } from "next/server";
import { appendRow, readAll } from "@/lib/googleSheets";
import { generateId, getTimestamp, validateIncome } from "@/lib/utils";
import { SHEETS } from "@/lib/constants";

export async function GET() {
  try {
    const records = await readAll(SHEETS.INCOME);
    return NextResponse.json(records);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch income", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateIncome(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    const record = {
      id: generateId(),
      userId: "default",
      amount: parseFloat(body.amount).toString(),
      source: body.source.trim(),
      date: body.date,
      note: body.note || "",
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };
    await appendRow(SHEETS.INCOME, record);
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create income", details: err.message },
      { status: 500 }
    );
  }
}
