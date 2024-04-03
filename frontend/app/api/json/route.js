const pinataSDK = require('@pinata/sdk');
import { NextResponse } from "next/server";
import { generateRandomId } from "@/lib/helpers";

export async function POST(request) {
  try {
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT});
    const json = await request.json();
    const randomId = generateRandomId(5);
    const options = { pinataMetadata: { name: `SafeTicket json ${randomId}` } };
    const res = await pinata.pinJSONToIPFS(json, options);
    return NextResponse.json({ res }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
