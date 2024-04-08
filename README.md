# SafeTickets

![hardhat tests workflow](https://github.com/beubeubeubeu/SafeTickets/actions/workflows/hardhat-unit-tests.yml/badge.svg)

![Vercel Deploy](https://therealsujitk-vercel-badge.vercel.app/?app=safe-tickets)

Final project during [Alyra blockchain developer training](https://www.alyra.fr/formations/decouvrir-la-formation-developpeur-blockchain-alyra). 

This is a simple NFT marketplace. 

NFT's are images and information about physical tickets of passed concert tickets. 

The targetted users are concert tickets collectors like [Stevie Dixon](https://steviedixon.blogspot.com/p/concerts-venir-lyon-et-region.html).


## Table of Contents

- [Features](#features)
- [Demo](#demo)
  - [Video](#video)
  - [Dapp](#dapp)
  - [Contracts on OpenSea and Sepolia](#contracts-on-opensea-and-sepolia)
- [Contracts architecture](#contracts-architecture)
  - [Contracts](#contracts)
  - [Diagrams](#diagrams)
  - [Contracts deployment](#contracts-deployment)
- [Coverage & security](#coverage--security)
  - [Coverage](#coverage)
  - [Slither](#slither)
- [Stack](#stack)
  - [Smart Contracts](#smart-contracts)
  - [File upload](#file-upload)
  - [Front](#front)
  - [CI/CD](#cicd)
- [Dapp](#dapp-1)
- [Important issues](#important-issues)
- [Run the app locally](#run-the-app-locally)
  - [Run front](#run-front)
  - [Run blockchain](#run-blockchain)
  - [Deploy](#deploy)

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

### Video

<a href="https://www.youtube.com/watch?v=NIEDux43hDQ&autoplay=true" target="_blank" width="500">
  <img src="https://github.com/beubeubeubeu/SafeTickets/assets/4832337/2d825560-b1be-492f-981c-80f89d56a9e0" alt="YouTube video Safe Tickets demo" width="500">
</a>

[YouTube link](https://youtu.be/NIEDux43hDQ?si=ajSSNzS6kpyPnkSJ)

### Dapp

If application is deployed it should be here: https://safe-tickets.vercel.app

### Contracts on OpenSea and Sepolia 

- [SafeTickets.sol](https://testnets.opensea.io/collection/safeticket-1) on Opensea
- [SafeTickets.sol](https://sepolia.etherscan.io/address/0x8BB9c06cB022cffd6A71D29e6a319828bc685ebD) on Etherscan
- [Markeplace.sol](https://sepolia.etherscan.io/address/0x50f6b938c0f6d77fbaa5f8033933a75f88b5de03) on Etherscan
- [UserCollectionFactory.sol](https://sepolia.etherscan.io/address/0x7CBd2DD300eedf25001E9335F829911994280aD5) on Etherscan
- [UserCollection.sol](https://sepolia.etherscan.io/address/0xE1B3E1d5a0fd7A01C8a9b94c5825778F667d8CE3) on Etherscan

## Contracts architecture

### Contracts

#### Oppenzeppelin contracts dependency:

- ReentrancyGuard
- IERC721Receiver
- ERC721Enumerable
- ERC721URIStorage
- Clones

#### Description

- UserCollection: 
    - original and "to be cloned" user collection.
    - legacy function `withdraw` (at first I wanted the Collection wich is the owner of the minted tickets to receive the ETH then the user withdraw ETH per collection, it's an unnecessarily cumbersome and complex process.)
    - `initialize` function to initialize collection name
    - other functions from this contract to be called by Marketplace (`approveBuyer`, `transferTicket`)
- UserCollectionFactory:
    - simply clone UserCollection and initialize it
- Marketplace:
    - does the on sale and pricing operation
    - does the buying and transfering operations
    - allow user to withdraw funds on contract
- SafeTickets:
    - mainly the "real" NFT collection 

### Diagrams

#### Contract architecture

<img src="https://github.com/beubeubeubeu/SafeTickets/assets/4832337/f96456f7-9c79-4bfb-afd0-2cd24d15377c" width="500">

#### Mint process

<img src="https://github.com/beubeubeubeu/SafeTickets/assets/4832337/565112d2-f0dc-46f9-858d-483042858070" width="500">

### Contracts deployment

- UserCollection & SafeTickets dont take constructor args
- Marketplace needs:
    - SafeTickets address
- UserCollectionFactory needs:
    - UserCollection address
    - SafeTickets address
    - Marketplace address

## Coverage & security

### Coverage

A coverage screen 08-04-24 15:00.

<img width="500" alt="Screenshot 2024-04-08 at 16 11 52" src="https://github.com/beubeubeubeu/SafeTickets/assets/4832337/411f1b47-5804-4220-b0f9-69dc682be7cf">

### Slither

Slither does not pass, some warnings are from Openzeppelin contracts. Other need a timely refacto. Here is a screen of Slither report launched within a GitHub workflow action.

<img width="500" alt="slither" src="https://github.com/beubeubeubeu/SafeTickets/assets/4832337/3a06e2f3-925b-47c2-8fe5-c0ec2b66e845">

## Stack

### Smart Contracts

- Solidity
- Hardhat
- Slither
- Sepolia

### File upload

- IPFS, Pinata

### Front

- Wagmi, Viem, Rainbowkit, NextJS
- Chakra-UI
- localStorage

### CI/CD

- Hardhat tests (+ Mocha & Chai)
- GitHub actions
- Slither
- Vercel

## Dapp

- should be mostly responsive
- handle empty states
    - no buyings
    - no ticket on sale
- use serverless functions to get data from blockchain in `app/api/*` 

## Important issues

- [Better contract DocGen](https://github.com/beubeubeubeu/SafeTickets/issues/5)
- [Better transaction confirmation UX](https://github.com/beubeubeubeu/SafeTickets/issues/18)
- [Fix all Slither fixable warnings](https://github.com/beubeubeubeu/SafeTickets/issues/20)

## Run the app locally

### Run front

```sh
cd ./frontend
yarn install
touch .env.local
yarn run dev
```
.env.local:
```sh
NEXT_PUBLIC_NETWORK=hardhat
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_EVENT_BLOCK_NUMBER=0
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID={REPLACE}
NEXT_PUBLIC_PINATA_GATEWAY_URL={REPLACE}
PINATA_JWT={REPLACE}
// hardhat local invariable addresses:
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
NEXT_PUBLIC_SAFE_TICKETS_CONTRACT_ADDRESS="0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
NEXT_PUBLIC_USER_COLLECTION_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
NEXT_PUBLIC_USER_COLLECTION_FACTORY_CONTRACT_ADDRESS="0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
```

### Run blockchain

```sh 
cd ./blockchain
touch .env
yarn install
yarn hardhat run --network hardhat
```

.env

```sh
LOCAL=true
INFURA_PK={REPLACE}
ETHERSCAN_API_KEY={REPLACE}
INFURA_URL={REPLACE}
WALLET_PK={REPLACE}
ALCHEMY_URL={REPLACE}
```

### Deploy

```sh
yarn hardhat run scripts/deploy.js --network localhost
```

to Sepolia

```sh
yarn hardhat run scripts/deploy.js --network sepolia
```
