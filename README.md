# SafeTickets

![hardhat tests workflow](https://github.com/beubeubeubeu/SafeTickets/actions/workflows/hardhat-unit-tests.yml/badge.svg)
![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=safe-tickets)

Final project during [Alyra blockchain developer training](https://www.alyra.fr/formations/decouvrir-la-formation-developpeur-blockchain-alyra). 
This is a simple NFT marketplace.
NFT's are images and information about physical tickets of passed concert tickets. The target are concert tickets collectors like [Stevie Dixon](https://steviedixon.blogspot.com/p/concerts-venir-lyon-et-region.html).

## Features

As a user I can:

- Authenticate with Rainbowkit
- Create a collection of tickets (rock, rap, whatever)
- Create a ticket draft within a collection with info ([opensea standard](https://docs.opensea.io/docs/metadata-standards)) :
    -  uploaded image (IPFS)
    -  concert name
    -  venue
    -  date
    -  type (= "rareness"; gold|category1|floor)
- Mint a ticket draft within a collection
- Remove a ticket draft
- Set a minted ticket on sale
- Set and update a minted, on sale, ticket's price
- Set a minted ticket "off" sale
- Buy a minted, on sale, price > 0 ticket
- See tickets I bought
- Withdraw my balance on marketplace (after having sold at least one ticket)
- See events of marketplace

## Demo

### Demo video

### Deployment

If application is deployed it should be here: https://safe-tickets.vercel.app

### Contracts on OpenSea and Sepolia 

- [SafeTickets.sol on Opensea](https://testnets.opensea.io/collection/safeticket-1)
- [SafeTickets.sol on Etherscan](https://sepolia.etherscan.io/address/0x8BB9c06cB022cffd6A71D29e6a319828bc685ebD)
- [Markeplace.sol on Etherscan](https://sepolia.etherscan.io/address/0x50f6b938c0f6d77fbaa5f8033933a75f88b5de03)
- [UserCollection.sol on Etherscan](https://sepolia.etherscan.io/address/0xE1B3E1d5a0fd7A01C8a9b94c5825778F667d8CE3)
- [UserCollectionFactory.sol on Etherscan](https://sepolia.etherscan.io/address/0x7CBd2DD300eedf25001E9335F829911994280aD5)

## Contracts architecture

## Coverage & security

### Coverage

### Slither

## Stack



## Important issues

- [Better contract DocGen](https://github.com/beubeubeubeu/SafeTickets/issues/5)
- [Better transaction confirmation UX](https://github.com/beubeubeubeu/SafeTickets/issues/18)
- [Fix all Slither fixable warnings](https://github.com/beubeubeubeu/SafeTickets/issues/20)
