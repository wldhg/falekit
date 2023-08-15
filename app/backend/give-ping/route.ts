import fs from "fs";

import { faleGreen, faleRed } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { tempPingPath } from "../vars";

export async function GET(request: NextRequest) {
  const isInc = request.nextUrl.searchParams.get("inc");
  let chval = 1;
  if (isInc !== "true") {
    chval = -1;
  }

  try {
    let ping: number = 0;
    try {
      const pingFile = fs.readFileSync(tempPingPath, "utf-8");
      ping = JSON.parse(pingFile);
    } catch (error) {}
    const newPing = Math.max(0, ping + chval);
    fs.writeFileSync(tempPingPath, JSON.stringify(newPing));
    return NextResponse.json(faleGreen(newPing.toString()));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
