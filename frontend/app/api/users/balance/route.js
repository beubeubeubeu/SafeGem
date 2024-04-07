import { NextResponse } from "next/server";
import { publicClient } from '@/lib/client';
import { marketplaceAbi } from '@/constants';
import { marketplaceAddress } from '@/constants';

export async function GET(request) {

  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get('address');

  try {
    const marketPlaceContractConfig = {
      address: marketplaceAddress,
      abi: marketplaceAbi
    };

    const userBalance = await publicClient.readContract({
      ...marketPlaceContractConfig,
      functionName: 'getBalanceOfUser',
      args: [userAddress],
      blockTag: 'finalized'
    })
    const formattedBalance = Number(userBalance)
    return NextResponse.json({ data: formattedBalance }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}