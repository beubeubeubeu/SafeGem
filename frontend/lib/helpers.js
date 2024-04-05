import { ethers } from 'ethers';
export function generateRandomId(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getPinataImageUrl(cidImage) {
  return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cidImage}`
}

export function formatTokenId(tokenId) {
  // Convert tokenId to a string if it's not already, then pad it to ensure it's at least 5 characters long, using '0' as the padding character
  const formattedTokenId = tokenId.toString().padStart(5, '0');
  // Prepend the '#' symbol to the formatted string
  return `#${formattedTokenId}`;
}

export function timestampToHumanDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based; add 1 to get the correct month
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function ethToWei(eth) {
  if (!eth) {
    return 0;
  }
  return ethers.parseEther(eth.toString());
}

export function weiToEth(wei) {
  // Use ethers.js utility function to convert wei to ether
  const eth = ethers.formatEther(wei);
  // Format the result to 2 decimal places
  return Number.parseFloat(eth).toFixed(2);
}

export function ethInDollar(eth) {
  const exchangeRate = 3300;
  return (parseFloat(eth) * exchangeRate).toFixed(2); // Fixed to 2 decimal places
}