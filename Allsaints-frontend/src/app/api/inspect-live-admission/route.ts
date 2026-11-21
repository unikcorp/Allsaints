import { NextResponse } from "next/server";
import fs from "fs";

export async function GET() {
  try {
    const fd = new URLSearchParams();
    fd.append("class_id", "1");

    const res = await fetch("https://allsaintspublicschool.com/welcome/getSections", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: fd.toString(),
      cache: "no-store",
    });

    const data = await res.json();
    fs.writeFileSync("c:/AllSaintswebsite/sections.json", JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ sections: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    fs.writeFileSync("c:/AllSaintswebsite/sections-error.txt", message, "utf8");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
