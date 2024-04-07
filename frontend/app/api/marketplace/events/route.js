'use server'

import { parseAbiItem } from 'viem';
import { weiToEth } from '@/lib/helpers';
import { NextResponse } from "next/server";
import { publicClient } from '@/lib/client';
import { marketplaceAddress } from '@/constants';

export async function GET() {
  try {
    const fundsWithdrawedEvents = await publicClient.getLogs({
      address: marketplaceAddress,
      event: parseAbiItem('event FundsWithdrawed(address indexed _withdrawer, uint256 _amount, uint256 _timestamp)'),
      fromBlock: BigInt(process.env.NEXT_PUBLIC_EVENT_BLOCK_NUMBER),
      toBlock: 'latest'
    })
    const ticketBoughtEvents = await publicClient.getLogs({
      address: marketplaceAddress,
      event: parseAbiItem('event TicketBought(uint256 indexed _ticketId, address _buyer, uint256 _price, uint256 _timestamp)'),
      fromBlock: BigInt(process.env.NEXT_PUBLIC_EVENT_BLOCK_NUMBER),
      toBlock: 'latest'
    })
    const ticketTransferredEvents = await publicClient.getLogs({
      address: marketplaceAddress,
      event: parseAbiItem('event TicketTransferred(uint256 indexed _ticketId, address _seller, address _buyer, uint256 _timestamp)'),
      fromBlock: BigInt(process.env.NEXT_PUBLIC_EVENT_BLOCK_NUMBER),
      toBlock: 'latest'
    })

    let formattedFundsWithdrawedEvents = []
    fundsWithdrawedEvents.map(async event => {
      formattedFundsWithdrawedEvents.push({
        type: 'FundsWithdrawed',
        withdrawer: `${event.args._withdrawer.substring(0, 5)}...${event.args._withdrawer.substring(event.args._withdrawer.length - 5)}`,
        amount: weiToEth(event.args._amount),
        timestamp: Number(event.args._timestamp)
      })
    })

    let formattedTicketBoughtEvents = []
    ticketBoughtEvents.map(async event => {
      formattedTicketBoughtEvents.push({
        type: 'TicketBought',
        tokenId: Number(event.args._ticketId),
        buyer: `${event.args._buyer.substring(0, 5)}...${event.args._buyer.substring(event.args._buyer.length - 5)}`,
        price: weiToEth(event.args._price),
        timestamp: Number(event.args._timestamp)
      })
    })

    let formattedTicketTransferredEvents = []
    ticketTransferredEvents.map(async event => {
      formattedTicketTransferredEvents.push({
        type: 'TicketTransferred',
        tokenId: Number(event.args._ticketId),
        seller: `${event.args._seller.substring(0, 5)}...${event.args._seller.substring(event.args._seller.length - 5)}`,
        buyer: `${event.args._buyer.substring(0, 5)}...${event.args._buyer.substring(event.args._buyer.length - 5)}`,
        timestamp: Number(event.args._timestamp)
      })
    })
    return NextResponse.json({
      data:
        [
          ...formattedFundsWithdrawedEvents,
          ...formattedTicketBoughtEvents,
          ...formattedTicketTransferredEvents
        ].sort((a, b) => b.timestamp - a.timestamp)
      }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}