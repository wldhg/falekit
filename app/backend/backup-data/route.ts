import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

import { faleGreen, faleRed } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getAllTempClientDataBigPaths } from "../vars";

export async function GET(request: NextRequest) {
  const filesToGather = getAllTempClientDataBigPaths();

  const zip = new AdmZip();
  filesToGather.forEach((fp) => {
    if (fs.existsSync(fp)) {
      zip.addLocalFile(fp, "", path.basename(fp).replace("FALETEMP_data_", ""));
    }
  });
  const zipBuffer = zip.toBuffer();
  const zipBase64 = zipBuffer.toString("base64");

  try {
    return NextResponse.json(faleGreen(zipBase64));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
