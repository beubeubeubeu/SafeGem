import { formatEther } from 'viem'
import { NextResponse } from "next/server";
import { publicClient } from '@/lib/client';
import { safeTicketsAbi } from '@/constants';
import { marketplaceAbi } from '@/constants';
import { safeTicketsAddress } from '@/constants';
import { marketplaceAddress } from '@/constants';

export async function GET(request) {
  try {
    const safeTicketsContractConfig = {
      address: safeTicketsAddress,
      abi: safeTicketsAbi
    };

    const marketPlaceContractConfig = {
      address: marketplaceAddress,
      abi: marketplaceAbi
    };

    const totalSupply = await publicClient.readContract({
      ...safeTicketsContractConfig,
      functionName: 'totalSupply',
    })

    let ticketsOnSale = [];
    console.log("totaleSupply", totalSupply)

    for (let i = 0; i < totalSupply; i++) {
      const ticketSellingInfo = await publicClient.readContract({
        ...marketPlaceContractConfig,
        functionName: 'ticketSelling',
        args: [i]
      })
      if (
        ticketSellingInfo[0] &&
        !ticketSellingInfo[1] &&
        parseFloat(formatEther(ticketSellingInfo[2])) > 0
      ) {
        ticketsOnSale.push({tokenId: i});
      }
    }

    const ticketsWithCIDs = await Promise.all(ticketsOnSale.map(async (ticket) => {
      const cidImage = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenImageCids',
        args: [ticket.tokenId]
      })
      const cidJSON = await publicClient.readContract({
        ...safeTicketsContractConfig,
        functionName: 'tokenJsonCids',
        args: [ticket.tokenId]
      })
      return { ...ticket, cidImage, cidJSON };
    }));
    return NextResponse.json(ticketsWithCIDs, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}