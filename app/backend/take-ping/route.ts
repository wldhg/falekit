import fs from "fs";

import { faleGreen } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { tempPingPath } from "../vars";

export async function GET(request: NextRequest) {
  try {
    const pingFile = fs.readFileSync(tempPingPath, "utf-8");
    const ping: number = JSON.parse(pingFile);
    return NextResponse.json(faleGreen(ping.toString()));
  } catch (error: any) {
    return NextResponse.json(faleGreen("0"));
  }
}
