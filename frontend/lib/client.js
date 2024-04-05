import { createPublicClient, http } from 'viem'
import { hardhat, sepolia } from 'viem/chains'

const chainsMap = {
  'hardhat': hardhat,
  'sepolia': sepolia
};

export const publicClient = createPublicClient({
  chain: chainsMap[process.env.NEXT_PUBLIC_NETWORK],
  transport: http()
})