import { getContract } from 'viem'
import { NextResponse } from "next/server";
import { publicClient } from '@/lib/client';
import { safeTicketsAbi } from '@/constants';
import { marketplaceAbi } from '@/constants';
import { safeTicketsAddress } from '@/constants';
import { marketplaceAddress } from '@/constants';

export async function GET(request) {
  try {
    const safeTicketsContract = getContract({
      address: safeTicketsAddress,
      abi: safeTicketsAbi,
      client: publicClient,
    })

    const marketPlaceContract = getContract({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      client: publicClient,
    })

    const totalSupply = await safeTicketsContract.totalSupply();
    let ticketsOnSale = [];

    for (let i = 0; i < totalSupply; i++) {
      const ticketSellingInfo = await marketPlaceContract.ticketSelling(i);
      if (ticketSellingInfo.onSale && ticketSellingInfo.price.gt(0)) {
        ticketsOnSale.push({ id: i, price: ticketSellingInfo.price.toString() });
      }
    }

    const ticketsWithCIDs = await Promise.all(ticketsOnSale.map(async (ticket) => {
      const imageCid = await safeTicketsContract.tokenImageCids(ticket.id);
      const jsonCid = await safeTicketsContract.tokenJsonCids(ticket.id);
      return { ...ticket, imageCid, jsonCid };
    }));
    return NextResponse.json({ ticketsWithCIDs })
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}