import fs from "fs";

import { faleGreen, faleRed } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { tempClientCodePath, tempServerCodePath } from "../vars";

export async function GET(request: NextRequest) {
  const reqType = request.nextUrl.searchParams.get("type");
  if (reqType === null) return NextResponse.json(faleRed("No code type"));

  try {
    if (reqType === "server") {
      const code = fs.readFileSync(tempServerCodePath, "utf-8");
      const validity = fs.readFileSync(
        tempServerCodePath + ".validity",
        "utf-8"
      );
      return NextResponse.json(faleGreen(validity + "|" + code));
    } else if (reqType === "client") {
      const code = fs.readFileSync(tempClientCodePath, "utf-8");
      const validity = fs.readFileSync(
        tempClientCodePath + ".validity",
        "utf-8"
      );
      return NextResponse.json(faleGreen(validity + "|" + code));
    } else {
      throw new Error("Invalid code type");
    }
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
