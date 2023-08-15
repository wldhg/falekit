import fs from "fs";

import { faleGreen, faleRed } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import {
  getAllTempClientDataBigPaths,
  getAllTempClientDataInfoPaths,
  tempPingPath,
} from "../vars";

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("target") || "none";

  try {
    let deletionTargets: string[] = [];
    if (target === "all") {
      deletionTargets = [
        ...getAllTempClientDataBigPaths(),
        ...getAllTempClientDataInfoPaths(),
        tempPingPath,
      ];
    } else if (target === "data") {
      deletionTargets = [
        ...getAllTempClientDataBigPaths(),
        ...getAllTempClientDataInfoPaths(),
      ];
    } else if (target === "ping") {
      deletionTargets = [tempPingPath];
    }
    deletionTargets.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    return NextResponse.json(faleGreen("Deleted"));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
