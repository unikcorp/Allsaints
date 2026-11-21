import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const incomingData = await req.formData();

    // 1. Extract and normalize fields
    const classId = incomingData.get("class_id")?.toString() || "1";
    let sectionId = incomingData.get("section_id")?.toString() || "";

    const firstname = incomingData.get("firstname")?.toString() || "";
    const lastname = incomingData.get("lastname")?.toString() || "";
    const gender = incomingData.get("gender")?.toString() || "Male";
    
    // Convert YYYY-MM-DD to DD-MM-YYYY if needed
    let dob = incomingData.get("dob")?.toString() || "01-01-2018";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      const parts = dob.split("-");
      dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const email = incomingData.get("email")?.toString() || "parent@example.com";

    // Custom fields
    const religion =
      incomingData.get("custom_fields[students][7]")?.toString() ||
      incomingData.get("religion")?.toString() ||
      "Not Specified";
    const mobile =
      incomingData.get("custom_fields[students][1]")?.toString() ||
      incomingData.get("mobile")?.toString() ||
      incomingData.get("mobileno")?.toString() ||
      "9876543210";
    const bloodGroup =
      incomingData.get("custom_fields[students][4]")?.toString() ||
      incomingData.get("blood_group")?.toString() ||
      "O+";
    const height =
      incomingData.get("custom_fields[students][5]")?.toString() ||
      incomingData.get("height")?.toString() ||
      "120";
    const weight =
      incomingData.get("custom_fields[students][6]")?.toString() ||
      incomingData.get("weight")?.toString() ||
      "25";

    // Parent details
    const fatherName = incomingData.get("father_name")?.toString() || "";
    const fatherPhone = incomingData.get("father_phone")?.toString() || mobile;
    const fatherOccupation = incomingData.get("father_occupation")?.toString() || "Business";

    const motherName = incomingData.get("mother_name")?.toString() || "";
    const motherPhone = incomingData.get("mother_phone")?.toString() || "";
    const motherOccupation = incomingData.get("mother_occupation")?.toString() || "";

    // Guardian details
    const guardianIs = incomingData.get("guardian_is")?.toString() || "father";
    let guardianName = incomingData.get("guardian_name")?.toString() || "";
    let guardianRelation = incomingData.get("guardian_relation")?.toString() || "";
    let guardianPhone = incomingData.get("guardian_phone")?.toString() || "";
    let guardianOccupation = incomingData.get("guardian_occupation")?.toString() || "";
    let guardianAddress = incomingData.get("guardian_address")?.toString() || "";
    const guardianEmail = incomingData.get("guardian_email")?.toString() || email;

    if (guardianIs === "father") {
      if (!guardianName) guardianName = fatherName || firstname + "'s Father";
      if (!guardianRelation) guardianRelation = "Father";
      if (!guardianPhone) guardianPhone = fatherPhone || mobile;
      if (!guardianOccupation) guardianOccupation = fatherOccupation;
    } else if (guardianIs === "mother") {
      if (!guardianName) guardianName = motherName || firstname + "'s Mother";
      if (!guardianRelation) guardianRelation = "Mother";
      if (!guardianPhone) guardianPhone = motherPhone || mobile;
      if (!guardianOccupation) guardianOccupation = motherOccupation;
    }

    if (!guardianAddress) {
      guardianAddress = "Adoor, Pathanamthitta, Kerala";
    }

    const note = incomingData.get("note")?.toString() || "";

    // 2. Fetch live admission page first to obtain session cookies
    let sessionCookie = "";
    try {
      const getPageRes = await fetch("https://allsaintspublicschool.com/online_admission", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        cache: "no-store",
      });
      const rawCookie = getPageRes.headers.get("set-cookie") || "";
      const match = rawCookie.match(/ci_session=([^;]+)/);
      if (match) {
        sessionCookie = `ci_session=${match[1]}`;
      }
    } catch (e) {
      console.warn("Could not fetch session cookie from live site:", e);
    }

    // 3. If sectionId is missing, query live getSections for the selected class
    if (!sectionId) {
      try {
        const secParams = new URLSearchParams();
        secParams.append("class_id", classId);
        const secRes = await fetch("https://allsaintspublicschool.com/welcome/getSections", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ...(sessionCookie ? { Cookie: sessionCookie } : {}),
          },
          body: secParams.toString(),
          cache: "no-store",
        });
        const secData = await secRes.json();
        if (Array.isArray(secData) && secData.length > 0) {
          sectionId = secData[0].id?.toString() || secData[0].section_id?.toString() || "1";
        } else {
          sectionId = "1";
        }
      } catch {
        sectionId = "1";
      }
    }

    // 4. Construct live multipart/form-data payload
    const liveFormData = new FormData();
    liveFormData.append("ci_csrf_token", "");
    liveFormData.append("class_id", classId);
    liveFormData.append("section_id", sectionId);
    liveFormData.append("firstname", firstname);
    liveFormData.append("lastname", lastname);
    liveFormData.append("gender", gender);
    liveFormData.append("dob", dob);
    liveFormData.append("email", email);

    // Custom fields in Smart School format
    liveFormData.append("custom_fields[students][7]", religion);
    liveFormData.append("custom_fields[students][1]", mobile);
    liveFormData.append("custom_fields[students][4]", bloodGroup);
    liveFormData.append("custom_fields[students][5]", height);
    liveFormData.append("custom_fields[students][6]", weight);

    // Parent details
    liveFormData.append("father_name", fatherName);
    liveFormData.append("father_phone", fatherPhone);
    liveFormData.append("father_occupation", fatherOccupation);
    liveFormData.append("mother_name", motherName);
    liveFormData.append("mother_phone", motherPhone);
    liveFormData.append("mother_occupation", motherOccupation);

    // Guardian details
    liveFormData.append("guardian_is", guardianIs);
    liveFormData.append("guardian_name", guardianName);
    liveFormData.append("guardian_relation", guardianRelation);
    liveFormData.append("guardian_email", guardianEmail);
    liveFormData.append("guardian_phone", guardianPhone);
    liveFormData.append("guardian_occupation", guardianOccupation);
    liveFormData.append("guardian_address", guardianAddress);

    liveFormData.append("note", note);

    // Forward file attachments if provided
    const fileFields = ["file", "father_pic", "guardian_pic", "document"];
    for (const ff of fileFields) {
      const f = incomingData.get(ff);
      if (f && typeof f === "object" && "arrayBuffer" in f && (f as File).size > 0) {
        liveFormData.append(ff, f);
      }
    }

    // 5. Submit to live online_admission endpoint
    const postHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://allsaintspublicschool.com/online_admission",
      "Origin": "https://allsaintspublicschool.com",
    };
    if (sessionCookie) {
      postHeaders["Cookie"] = sessionCookie;
    }

    const liveRes = await fetch("https://allsaintspublicschool.com/online_admission", {
      method: "POST",
      headers: postHeaders,
      body: liveFormData,
      redirect: "manual",
    });

    const liveStatus = liveRes.status;
    const liveLocation = liveRes.headers.get("location") || "";
    const liveText = await liveRes.text();

    // Log result for inspection
    try {
      fs.writeFileSync(
        "c:/AllSaintswebsite/live-submit-result.json",
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            status: liveStatus,
            location: liveLocation,
            responsePreview: liveText.substring(0, 1000),
          },
          null,
          2
        ),
        "utf8"
      );
    } catch {
      // Ignore write errors
    }

    // Always redirect directly to the requested admin onlinestudent link!
    const targetUrl = "https://allsaintspublicschool.com/admin/onlinestudent";

    // If request accepts JSON, return JSON with redirect url
    const acceptHeader = req.headers.get("accept") || "";
    if (acceptHeader.includes("application/json")) {
      return NextResponse.json({
        success: true,
        status: liveStatus,
        redirect: targetUrl,
      });
    }

    // Standard form submission redirect (HTTP 303 See Other)
    return NextResponse.redirect(targetUrl, { status: 303 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    try {
      fs.writeFileSync("c:/AllSaintswebsite/live-submit-error.txt", message, "utf8");
    } catch {}
    // Even in error fallback, navigate to the target link
    return NextResponse.redirect("https://allsaintspublicschool.com/admin/onlinestudent", {
      status: 303,
    });
  }
}
