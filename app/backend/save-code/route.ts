import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { code } = await request.body.json();

  const codeFile = new File([code], "code.txt", { type: "text/plain" });

  return NextResponse.redirect(codeFile);
}
