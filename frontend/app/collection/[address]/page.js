'use client'

import { useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/client';
import { useSearchParams } from 'next/navigation';
import { React, useState, useEffect } from 'react';
import TicketCard from '../../components/ui/TicketCard';
import NewTicketDraftCard from '../../components/ui/NewTicketDraftCard';
import {
  safeTicketsAddress
} from '@/constants';
import {
  Box,
  Text,
  Flex,
  Badge,
  Center,
  Heading,
  Divider,
  GridItem,
  SimpleGrid
} from '@chakra-ui/react';

const Collection = ({ params }) => {

  const searchParams = useSearchParams();
  const name = searchParams.get('name')

  const { address } = useAccount();
  const [tickets, setTickets] = useState([]);
  const [collection, setCollection] = useState('');

  useEffect(() => {
    setCollection(params.address);
  }, [params.address]);

  const onSuccessCreateDraftTicket = () => {
    getTickets();
  }

  const getTickets = async () => {
    // get drafts
    let draftTickets = [];
    try {
      draftTickets = JSON.parse(localStorage.getItem('ticketDrafts'))[collection] || []
    } catch (e) {
      console.error("Failed to fetch ticket drafts:", e);
      draftTickets = [];
    }
    // get minted tickets
    try {
      const response = await fetch(`/api/tickets/of_owner?address=${collection}`);
      const mintedTickets = await response.json();
      console.log("mintedTickets", mintedTickets)
      setTickets([...draftTickets, ...mintedTickets]);
    } catch (e) {
      console.error("Failed to fetch tickets:", e);
    }
  }

  useEffect(() => {
    const getAllTickets = async () => {
      if (address !== undefined && collection !== undefined) {
          await getTickets();
      }
    }
    getAllTickets();
  }, [address, collection])

  const handleDeleteItem = async (index) => {
    // Retrieve the current drafts array from local storage and parse it
    let drafts = JSON.parse(localStorage.getItem('ticketDrafts')) || {};
    // Remove the item at the specified index
    if (index >= 0 && index < drafts[collection].length) {
      drafts[collection].splice(index, 1);
      // Update local storage with the new array
      localStorage.setItem('ticketDrafts', JSON.stringify(drafts));
    }
    getTickets();
  }

  const handleMintedItem = async (index) => {
    handleDeleteItem(index);
    getTickets();
  }

  return (
    <>
      <Heading textAlign={'center'}>{name}</Heading>
      <Center>
        <Box mx={5} maxWidth={'500px'}>
          <Divider my={5} border={'none'}></Divider>
          <Text textAlign={'center'} fontSize='sm'>Ticket collection lives at <Badge colorScheme='teal'>{params.address}</Badge> • Contract type is <Badge colorScheme='teal'>ERC-721</Badge> • Blockchain is <Badge colorScheme='teal'>{process.env.NEXT_PUBLIC_NETWORK.charAt(0).toUpperCase() + process.env.NEXT_PUBLIC_NETWORK.slice(1)}</Badge></Text>
        </Box>
      </Center>

      <Divider my={5} border={'none'}></Divider>

      <Flex
        direction="column"
        align="center"
        justify="center" // This centers the content vertically in the Flex container
      >
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing="32px"
        >
          <GridItem>
            <NewTicketDraftCard onSuccessCreateDraftTicket={onSuccessCreateDraftTicket} collection={params.address}></NewTicketDraftCard>
          </GridItem>

          {/* Loop over tickets to generate Ticket Cards, wrapped with GridItem */}
          { collection && tickets.length > 0 && tickets.map((ticket, index) => (
            <GridItem key={index}>
              <TicketCard
                index={index}
                cidJSON={ticket.cidJSON}
                cidImage={ticket.cidImage}
                draft={ticket.draft}
                shop={false}
                tokenId={ticket.tokenId}
                collection={collection}
                onBoughtItem={() => null}
                onDeleteItem={handleDeleteItem}
                onMintedItem={handleMintedItem}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default Collection