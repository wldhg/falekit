import fs from "fs";

import { faleGreen, faleRed, type SaveCodeRequest } from "@/_proto";
import { NextResponse, type NextRequest } from "next/server";
import { tempClientCodePath, tempServerCodePath } from "../vars";

export async function POST(request: NextRequest) {
  if (request.body === null) return NextResponse.json(faleRed("No body"));
  try {
    const body: SaveCodeRequest = await request.json();

    if (typeof body.code !== "string") throw new Error("No code");

    if (body.type === "server") {
      fs.writeFileSync(tempServerCodePath, body.code);
      fs.writeFileSync(
        tempServerCodePath + ".validity",
        body.validity ? "1" : "0"
      );
      return NextResponse.json(faleGreen("Saved server code"));
    } else if (body.type === "client") {
      fs.writeFileSync(tempClientCodePath, body.code);
      fs.writeFileSync(
        tempClientCodePath + ".validity",
        body.validity ? "1" : "0"
      );
      return NextResponse.json(faleGreen("Saved client code"));
    } else {
      throw new Error("Invalid code type");
    }
  } catch (error: any) {
    return NextResponse.json(faleRed(error?.message));
  }
}
