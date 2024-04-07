'use client'

import { useAccount } from 'wagmi';
import { React, useState, useEffect } from 'react';
import TicketCard from '../components/ui/TicketCard';
import EmptyTicketCard from '../components/ui/EmptyTicketCard';
import {
  Box,
  Text,
  Flex,
  Center,
  Heading,
  Divider,
  GridItem,
  SimpleGrid
} from '@chakra-ui/react';

const Buyings = ({ params }) => {

  const { address } = useAccount();
  const [tickets, setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);

  const getTickets = async () => {
    // get minted tickets
    try {
      setIsLoadingTickets(true);
      const response = await fetch(`/api/tickets/of_owner?address=${address}`);
      const mintedTickets = await response.json();
      setTickets(mintedTickets.data);
      setIsLoadingTickets(false);
    } catch (e) {
      setIsLoadingTickets(false);
      console.error("Failed to fetch tickets:", e);
    }
  }

  useEffect(() => {
    const getAllTickets = async () => {
      if (address !== undefined) {
        await getTickets();
      }
    }
    getAllTickets();
  }, [address])

  return (
    <>
      <Heading mt={{sm: "32px", md: "0px"}} textAlign={'center'}>Buyings</Heading>
      <Center>
        <Box mx={5} maxWidth={'500px'}>
          <Divider my={5} border={'none'}></Divider>
          <Text textAlign={'center'} fontSize='sm'>You've earned them.</Text>
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

          {/* Empty state */}
          { isLoadingTickets && [...Array(3)].map((_, index) => (
            <GridItem key={index}>
              <EmptyTicketCard/>
            </GridItem>
          ))}

          {/* Loop over tickets to generate Ticket Cards, wrapped with GridItem */}
          { address && tickets.length > 0 && tickets.map((ticket, index) => (
            <GridItem key={index}>
              <TicketCard
                index={index}
                cidJSON={ticket.cidJSON}
                cidImage={ticket.cidImage}
                draft={false}
                shop={false}
                buyings={true}
                tokenId={ticket.tokenId}
                collection={address}
                onBoughtItem={() => null}
                onDeleteItem={() => null}
                onMintedItem={() => null}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default Buyings