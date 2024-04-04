'use client'

import { useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/client';
import { useSearchParams } from 'next/navigation';
import { React, useState, useEffect } from 'react';
import TicketCard from '../../components/ui/TicketCard';
import NewTicketDraftCard from '../../components/ui/NewTicketDraftCard';
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
  const [tickets, setTickets] = useState()
  const [collection, setCollection] = useState('');

  useEffect(() => {
    setCollection(params.address);
  }, [params.address]);

  const onSuccessCreateDraftTicket = () => {
    getTickets();
  }

  const getTickets = async () => {
    const tmpTickets = JSON.parse(localStorage.getItem('ticketDrafts'))[collection] || []
    // const userCollectionCreatedEvents = await publicClient.getLogs({
    //   address: userCollectionFactoryAddress,
    //   event: parseAbiItem('event UserCollectionCreated(address _userAddress, address _newCollectionAddress, string _collectionName, uint _timestamp)'),
    //   fromBlock: BigInt(process.env.NEXT_PUBLIC_EVENT_BLOCK_NUMBER),
    //   toBlock: 'latest'
    // })
    // userCollectionCreatedEvents
    //   .filter(event => event.args._userAddress === address)
    //   .map(async event => {
    //     tmpUserCollections.push({
    //       name: event.args._collectionName,
    //       address: event.args._newCollectionAddress,
    //       shortAddress: `${event.args._newCollectionAddress.substring(0, 12)}...${event.args._newCollectionAddress.substring(event.args._newCollectionAddress.length - 12)}`
    //     })
    //   })
    setTickets(tmpTickets);
  }

  useEffect(() => {
    const getAllTickets = async () => {
      if (address !== undefined && collection !== undefined) {
          await getTickets();
      }
    }
    getAllTickets();
  }, [address, collection])

  const handleDelete = async (index) => {
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
          spacing="20px"
        >
          <GridItem>
            <NewTicketDraftCard onSuccessCreateDraftTicket={onSuccessCreateDraftTicket} collection={params.address}></NewTicketDraftCard>
          </GridItem>

          {/* Loop over tickets to generate Ticket Cards, wrapped with GridItem */}
          {tickets && tickets.map((ticket, index) => (
            <GridItem key={index}>
              <TicketCard
                index={index}
                cidJSON={ticket.cidJSON}
                imageUrl={ticket.imageUrl}
                concertName={ticket.concertName}
                venue={ticket.venue}
                date={ticket.date}
                category={ticket.category}
                draft={true}
                tokenId={ticket.tokenId}
                onDeleteItem={handleDelete}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default Collection