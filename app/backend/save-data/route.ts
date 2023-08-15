import fs from "fs";

import { faleGreen, faleRed, type SaveDataRequest } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getTempClienDataBigPath, getTempClienDataInfoPath } from "../vars";

const infoFileCache = new Map();

export async function POST(request: NextRequest) {
  if (request.body === null) return NextResponse.json(faleRed("No body"));
  try {
    const body: SaveDataRequest = await request.json();

    if (typeof body.name !== "string") throw new Error("No name");

    const nowEpoch = Date.now();
    const infoFileName = getTempClienDataInfoPath(body.name);
    const bigFileName = getTempClienDataBigPath(body.name);

    let infoDataContent = {
      latestTime: 0,
      latestData: null,
      last100data: [],
    };

    if (infoFileCache.has(body.name)) {
      infoDataContent = infoFileCache.get(body.name);
    }

    if (infoDataContent.latestTime < nowEpoch) {
      infoDataContent.latestTime = nowEpoch;
      // @ts-ignore-next-line
      infoDataContent.latestData = body.data;
      // @ts-ignore-next-line
      infoDataContent.last100data.push([nowEpoch, body.data]);
      if (infoDataContent.last100data.length > 100) {
        infoDataContent.last100data.shift();
      }
    }

    infoFileCache.set(body.name, infoDataContent);
    fs.writeFile(infoFileName, JSON.stringify(infoDataContent), () => {});
    fs.appendFile(bigFileName, `${nowEpoch},${body.data}\n`, () => {});

    return NextResponse.json(faleGreen("Saved"));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
