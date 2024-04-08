'use client'

import { React, useEffect, useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import MarketplaceEvents from '../components/ui/MarketplaceEvents';
import MarketplaceTickets from '../components/ui/MarketplaceTickets';
import MarketplaceBalanceWithdraw from '../components/ui/MarketplaceBalanceWithdraw';
import {
  useAccount,
  useWriteContract
} from 'wagmi';
import {
  marketplaceAbi,
  marketplaceAddress
} from '@/constants';
import {
  Box,
  Tab,
  Text,
  Link,
  Tabs,
  Badge,
  Center,
  Heading,
  TabList,
  Divider,
  TabPanel,
  TabPanels,
  TabIndicator,
} from '@chakra-ui/react';

const Marketplace = () => {

  const address = useAccount().address

  const [fetchingTicketsData, setFetchingTicketsData] = useState(true);
  const [fetchingUserBalance, setFetchingUserBalance] = useState(true);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [userBalance, setUserBalance] = useState('');
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

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
    setIsFetchingEvents(true);
    await fetchTicketsData();
    await getEvents();
  }

  const onWithdrawBalance = async () => {
    setIsFetchingEvents(true);
    setFetchingUserBalance(true);
    await getEvents();
    await fetchUserBalance();
  }

  const fetchUserBalance = async () => {
    try {
      setFetchingUserBalance(true);
      const response = await fetch(`/api/users/balance?address=${address}`, {
        method: 'GET', // Explicitly state the method, even if GET is the default
        headers: {
          'Cache-Control': 'no-cache', // Advises the browser and intermediate caches to get a fresh version
        },
        cache: 'no-store', // Ensures the response isn’t stored in any caches
      });
      const balance = await response.json();
      setUserBalance(balance.data);
      setFetchingUserBalance(false);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
      setFetchingUserBalance(false);
    }
  };

  useEffect(() => {
    const getUserBalance = async () => {
      if (address !== undefined) {
        await fetchUserBalance();
      }
    }
    getUserBalance();
  }, [address])

  // Withdraw eth
  const { data: withdrawingData, writeContract: withdrawBalance, isPending: isPendingWithdrawBalance, isLoading: isWithdrawingBalance } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Funds withdrawed. 💸",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onWithdrawBalance();
      },
      onError(error) {
        const pattern = /Error: ([A-Za-z0-9_]+)\(\)/;
        const match = error.message.match(pattern);
        toast({
          title: "Failed to withdraw funds.",
          description: match[1] || error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  });

  const handleWithdrawBalance = () => {
    withdrawBalance({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      functionName: "withdraw",
      account: address,
      args: [userBalance]
    });
  };

  // Get marketplace events
  const getEvents = async () => {
    setIsFetchingEvents(true);
    const response = await fetch(`/api/marketplace/events`);
    const eventsData = await response.json();
    setEvents(eventsData.data);
    setIsFetchingEvents(false);
  }

  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== undefined) {
          await getEvents();
      }
    }
    getAllEvents();
  }, [address])

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

      <Tabs defaultIndex={0} variant="unstyled" colorScheme='teal' size='sm' align='center'>
        <TabList>
          <Tab>Tickets</Tab>
          <Tab>Balance / Withdraw</Tab>
          <Tab>Activity</Tab>
        </TabList>
        <TabIndicator

          height="2px"
          bg="teal"
          borderRadius="1px"
        />
        <TabPanels mt="16px">
          <TabPanel>
            <MarketplaceTickets
              fetchingTicketsData={fetchingTicketsData}
              tickets={tickets}
              onBoughtItem={onBoughtItem}
            />
          </TabPanel>
          <TabPanel>
            <MarketplaceBalanceWithdraw
              fetchingUserBalance={fetchingUserBalance}
              userBalance={userBalance}
              isWithdrawingBalance={isWithdrawingBalance}
              handleWithdrawBalance={handleWithdrawBalance}
            />
          </TabPanel>
          <TabPanel>
            <MarketplaceEvents
              isFetchingEvents={isFetchingEvents}
              events={events}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default Marketplace