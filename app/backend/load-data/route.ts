import fs from "fs";

import { faleGreen, faleRed } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getTempClienDataBigPath, getTempClienDataInfoPath } from "../vars";

export async function GET(request: NextRequest) {
  const reqId = request.nextUrl.searchParams.get("id");
  const reqAmountStr = request.nextUrl.searchParams.get("cnt");
  if (reqId === null) return NextResponse.json(faleRed("No request id"));
  if (reqAmountStr === null)
    return NextResponse.json(faleRed("No request amount"));

  const reqAmount = Number.parseInt(reqAmountStr);
  if (reqAmount < 1)
    return NextResponse.json(faleRed("Invalid request amount"));

  let returnData: any[] = [];

  try {
    if (reqAmount <= 200) {
      const filePath = getTempClienDataInfoPath(reqId);
      if (fs.existsSync(filePath)) {
        const fileCont = fs.readFileSync(filePath, "utf-8");
        const fileContJson = JSON.parse(fileCont);
        if (reqAmount === 1) {
          returnData.push([
            fileContJson["latestTime"],
            fileContJson["latestData"],
          ]);
        } else {
          const dataFrom = fileContJson["last200data"];
          const dataTo = dataFrom.slice(-reqAmount);
          returnData = dataTo;
        }
      }
    } else {
      const filePath = getTempClienDataBigPath(reqId);
      if (fs.existsSync(filePath)) {
        const fileCont = fs.readFileSync(filePath, "utf-8");
        const fileContArr = fileCont
          .split("\n")
          .map((line) => {
            const lineArr = line.split(",");
            const timestamp = Number.parseInt(lineArr[0]);
            const dataPart = lineArr.slice(1).join(",");
            return [timestamp, dataPart];
          })
          // @ts-ignore-next-line
          .sort((a, b) => a[0] - b[0]);
        const dataFrom = fileContArr;
        const dataTo = dataFrom.slice(-reqAmount);
        returnData = dataTo;
      }
    }

    return NextResponse.json(faleGreen(JSON.stringify(returnData)));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
