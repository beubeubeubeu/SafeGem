'use client'

import { useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/client';
import { React, useEffect, useState } from 'react';
import { userCollectionFactoryAddress} from '@/constants';
import CollectionCard from '../components/ui/CollectionCard';
import { Flex, SimpleGrid, GridItem } from '@chakra-ui/react';
import NewCollectionCard from '../components/ui/NewCollectionCard';

const Marketplace = () => {

  const { address } = useAccount();
  const [fetchingTicketsData, setFetchingTicketsData] = useState(true);

  // Fetch selling ticket data (on sale)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingTicketsData(true);
        const response = await fetch(`/api/tickets/selling`);
        const onSaleTickets = await response.json();
        console.log("onSaleTickets: ", onSaleTickets);
        setFetchingMetadata(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [address]);

  return (
    <div>Marketplace</div>
  )
}

export default Marketplace