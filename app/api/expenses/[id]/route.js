import { NextResponse } from "next/server";
import { findById, updateRow, deleteRow } from "@/lib/googleSheets";
import { getTimestamp, validateExpense } from "@/lib/utils";
import { SHEETS } from "@/lib/constants";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await findById(SHEETS.EXPENSES, id);
    if (!record) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch expense", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errors = validateExpense(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    const record = await updateRow(SHEETS.EXPENSES, id, {
      amount: parseFloat(body.amount).toString(),
      category: body.category,
      date: body.date,
      note: body.note || "",
      updatedAt: getTimestamp(),
    });
    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update expense", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await deleteRow(SHEETS.EXPENSES, id);
    return NextResponse.json({ id, deleted: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete expense", details: err.message },
      { status: 500 }
    );
  }
}
