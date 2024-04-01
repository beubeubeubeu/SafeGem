import { createPublicClient, http } from 'viem'
import { hardhat, sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_NETWORK || sepolia,
  transport: http()
})