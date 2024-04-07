'use client'

import { useAccount } from 'wagmi';
import { React, useEffect, useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import TicketCard from '../components/ui/TicketCard';
import EmptyStateBox from '../components/ui/EmptyStateBox';
import LoadingTicketCard from '../components/ui/LoadingTicketCard';
import {
  Box,
  Text,
  Flex,
  Link,
  Badge,
  Center,
  Heading,
  Divider,
  GridItem,
  Skeleton,
  SimpleGrid
} from '@chakra-ui/react';

const Marketplace = () => {

  const address = useAccount().address

  const [fetchingTicketsData, setFetchingTicketsData] = useState(true);
  const [tickets, setTickets] = useState([]);

  // Fetch selling ticket data (on sale)
  useEffect(() => {
    const getAllTickets = async () => {
      if (address !== undefined) {
        await fetchTicketsData();
      }
    }
    getAllTickets();
  }, [address])

  const fetchTicketsData = async () => {
    try {
      setFetchingTicketsData(true);
      const response = await fetch(`/api/tickets/selling`, {
        method: 'GET', // Explicitly state the method, even if GET is the default
        headers: {
          'Cache-Control': 'no-cache', // Advises the browser and intermediate caches to get a fresh version
        },
        cache: 'no-store', // Ensures the response isn’t stored in any caches
      });
      const onSaleTickets = await response.json();
      setTickets(onSaleTickets.data);
      setFetchingTicketsData(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setFetchingTicketsData(false);
    }
  };

  const onBoughtItem = async () => {
    setFetchingTicketsData(true);
    await fetchTicketsData();
  }

  return (
    <>
      <Heading mt={{sm: "32px", md: "0px"}} textAlign={'center'}>Marketplace</Heading>
      <Center>
        <Box mx={5} maxWidth={'500px'}>
          <Divider my={5} border={'none'}></Divider>
          <Text textAlign={'center'} fontSize='sm'>After buying a ticket it will appear in your <Link href="/buyings"><Badge colorScheme='teal'>Buyings<ExternalLinkIcon mb='3px' mx='2px' /></Badge></Link> page</Text>
        </Box>
      </Center>

      <Divider my={5} border={'none'}></Divider>

      { !fetchingTicketsData && tickets.length === 0 && (
        <EmptyStateBox
          title='No tickets for sale'
          line1='Create a collection then'
          line2='mint and sell your precious tickets.'
        />
      )}

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
          { fetchingTicketsData && [...Array(3)].map((_, index) => (
            <GridItem key={index}>
              <LoadingTicketCard/>
            </GridItem>
          ))}

          {/* Loop over tickets to generate Ticket Cards, wrapped with GridItem */}
          { !fetchingTicketsData && tickets.length > 0 && tickets.map((ticket, index) => (
            <GridItem key={index}>
              <TicketCard
                index={index}
                cidJSON={ticket.cidJSON}
                cidImage={ticket.cidImage}
                draft={false}
                tokenId={ticket.tokenId}
                collection={null}
                marketplace={true}
                buyings={false}
                onBoughtItem={onBoughtItem}
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

export default Marketplace