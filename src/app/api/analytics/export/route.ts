import { NextResponse } from "next/server";

export async function GET() {
  const csv = [
    ["date", "gross_revenue", "platform_fee", "gateway_fee", "net_creator_earnings", "currency"],
    ["2026-06-28", "420800", "42080", "12403", "366317", "USD"]
  ]
    .map((row) => row.join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=chatboost-analytics.csv"
    }
  });
}
