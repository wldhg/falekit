import fs from "fs";

import { faleGreen, faleRed, type SaveDataRequest } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getTempClienDataBigPath, getTempClienDataInfoPath } from "../vars";

const infoFileCache = new Map();

export async function POST(request: NextRequest) {
  if (request.body === null) return NextResponse.json(faleRed("No body"));
  try {
    const bodys: SaveDataRequest = await request.json();

    const errors: { [key: string]: string } = {};

    for (const body of bodys) {
      try {
        if (typeof body.name !== "string") throw new Error("No name");

        const infoFileName = getTempClienDataInfoPath(body.name);
        const bigFileName = getTempClienDataBigPath(body.name);

        let infoDataContent = {
          latestTime: 0,
          latestData: null,
          last200data: [],
        };

        const partialDataProc = (
          name: string,
          data: string | number | boolean
        ) => {
          const nowEpoch = Date.now();

          if (infoDataContent.latestTime < nowEpoch) {
            infoDataContent.latestTime = nowEpoch;
            // @ts-ignore-next-line
            infoDataContent.latestData = data;
            // @ts-ignore-next-line
            infoDataContent.last200data.push([nowEpoch, data]);
            if (infoDataContent.last200data.length > 200) {
              infoDataContent.last200data.shift();
            }
          }

          infoFileCache.set(name, infoDataContent);
          fs.writeFile(infoFileName, JSON.stringify(infoDataContent), () => {});
          fs.appendFile(bigFileName, `${nowEpoch},${data}\n`, () => {});
        };

        if (infoFileCache.has(body.name)) {
          infoDataContent = infoFileCache.get(body.name);
          partialDataProc(body.name, body.data);
        } else if (fs.existsSync(infoFileName)) {
          fs.readFile(infoFileName, "utf-8", (err, data) => {
            if (err) throw err;
            infoDataContent = JSON.parse(data);
            partialDataProc(body.name, body.data);
          });
        }
      } catch (error: any) {
        console.error(error);
        errors[body.name] = error?.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(faleRed(JSON.stringify(errors)));
    }

    return NextResponse.json(faleGreen("Saved"));
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
