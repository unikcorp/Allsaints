import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dest = path.join(process.cwd(), "public", "images", "pta", "pta-executives-2026-27.jpg");
  const exists = fs.existsSync(dest);

  return NextResponse.json({
    status: exists ? "success" : "not_found",
    exists,
  });
}
