import { NextResponse } from "next/server";
import { findById, updateRow, deleteRow } from "@/lib/googleSheets";
import { getTimestamp, validateIncome } from "@/lib/utils";
import { SHEETS } from "@/lib/constants";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await findById(SHEETS.INCOME, id);
    if (!record) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch income", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errors = validateIncome(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    const record = await updateRow(SHEETS.INCOME, id, {
      amount: parseFloat(body.amount).toString(),
      source: body.source.trim(),
      date: body.date,
      note: body.note || "",
      updatedAt: getTimestamp(),
    });
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update income", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteRow(SHEETS.INCOME, id);
    return NextResponse.json({ id, deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete income", details: err.message },
      { status: 500 }
    );
  }
}
