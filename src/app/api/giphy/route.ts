import { NextResponse } from "next/server";
import guardRequest from "@/app/lib/helpers/guardRequest";
import { MAX_GIF_QUERY_LENGTH, RATE_LIMIT_GIPHY } from "@/app/lib/constants";

export async function POST(req: Request) {
  try {
    const blocked = guardRequest(req, "giphy", RATE_LIMIT_GIPHY);
    if (blocked) return blocked;

    const reqBody = await req.json();

    if (
      typeof reqBody?.query !== "string" ||
      reqBody.query.length >= MAX_GIF_QUERY_LENGTH
    ) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const response = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
        reqBody.query
      )}&key=${process.env.TENOR_KEY}&limit=35`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from IPFS:", errorText);
      throw new Error("Failed to upload to IPFS");
    }

    const data = await response.json();

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
