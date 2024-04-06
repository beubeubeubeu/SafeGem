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
    });

    // Convert balance to an integer for iteration
    const n = parseInt(balanceOfOwner, 10);

    // Form an array of owned token IDs
    let ownedTokenIds = [];
    for (let index = 0; index < n; index++) {
      const tokenId = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenOfOwnerByIndex',
        args: [ownerAddress, index],
      });
      ownedTokenIds.push(tokenId);
    }

    // Map over ownedTokenIds to form ticketsWithCIDs
    const ticketsWithCIDs = await Promise.all(ownedTokenIds.map(async (tokenId) => {
      const cidImage = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenImageCids',
        args: [tokenId],
      });
      const cidJSON = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenJsonCids',
        args: [tokenId],
      });
      return { tokenId, cidImage, cidJSON };
    }));

    return NextResponse.json(ticketsWithCIDs);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}