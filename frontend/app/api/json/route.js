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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cidJSON = searchParams.get('cidJSON');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cidJSON}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const metadata = await res.json()
    return NextResponse.json({ metadata })
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
