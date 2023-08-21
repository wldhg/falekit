import fs from "fs";

import { faleGreen, faleRed, type SaveDataRequest } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { getTempClienDataBigPath, getTempClienDataInfoPath } from "../vars";

const infoFileCache = new Map();

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
        let fileContJson = {
          latestTime: 0,
          latestData: null,
          last200data: [],
        };
        if (infoFileCache.has(reqId)) {
          fileContJson = infoFileCache.get(reqId);
        } else {
          const fileCont = fs.readFileSync(filePath, "utf-8");
          fileContJson = JSON.parse(fileCont);
          infoFileCache.set(reqId, fileContJson);
        }
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
      } else {
        if (infoFileCache.has(reqId)) {
          infoFileCache.delete(reqId);
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
          console.log("[I]", nowEpoch, name, ":", data);

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

        if (fs.existsSync(infoFileName)) {
          if (infoFileCache.has(body.name)) {
            infoDataContent = infoFileCache.get(body.name);
            partialDataProc(body.name, body.data);
          } else {
            fs.readFile(infoFileName, "utf-8", (err, data) => {
              if (err) throw err;
              infoDataContent = JSON.parse(data);
              infoFileCache.set(body.name, infoDataContent);
              partialDataProc(body.name, body.data);
            });
          }
        } else {
          if (infoFileCache.has(body.name)) {
            infoFileCache.delete(body.name);
          }
          partialDataProc(body.name, body.data);
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
