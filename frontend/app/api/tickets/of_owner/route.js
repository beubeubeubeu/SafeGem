'use server'

import { NextResponse } from "next/server";
import { publicClient } from '@/lib/client';
import { safeTicketsAbi } from '@/constants';
import { safeTicketsAddress } from '@/constants';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerAddress = searchParams.get('address');

    const safeTicketsContractConfig = {
      address: safeTicketsAddress,
      abi: safeTicketsAbi,
    };

    // Get the number of tokens owned by the address
    const balanceOfOwner = await publicClient.readContract({
      ...safeTicketsContractConfig,
      functionName: 'balanceOf',
      args: [ownerAddress],
      blockTag: 'safe'
    });

    const n = balanceOfOwner;

    // Form an array of owned token IDs
    let ownedTokenIds = [];
    for (let index = 0; index < n; index++) {
      const tokenId = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [ownerAddress, index],
        blockTag: 'safe'
      });
      ownedTokenIds.push(Number(tokenId));
    }

    // Map over ownedTokenIds to form ticketsWithCIDs
    const ticketsWithCIDs = await Promise.all(ownedTokenIds.map(async (tokenId) => {
      const cidImage = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenImageCids',
        args: [tokenId],
        blockTag: 'safe'
      });
      const cidJSON = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenJsonCids',
        args: [tokenId],
        blockTag: 'safe'
      });
      return { tokenId, cidImage, cidJSON };
    }));
    return NextResponse.json({ data: ticketsWithCIDs }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}