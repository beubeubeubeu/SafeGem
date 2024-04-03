'use client'

import { useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/client';
import { React, useEffect, useState } from 'react';
import { userCollectionFactoryAddress} from '@/constants';
import CollectionCard from '../components/ui/CollectionCard';
import { Flex, SimpleGrid, GridItem } from '@chakra-ui/react';
import NewCollectionCard from '../components/ui/NewCollectionCard';

const Collections = () => {

  const { address } = useAccount();
  const [userCollections, setUserCollections] = useState([{}])

  const getUserCollections = async () => {
    const tmpUserCollections = []
    const userCollectionCreatedEvents = await publicClient.getLogs({
      address: userCollectionFactoryAddress,
      event: parseAbiItem('event UserCollectionCreated(address _userAddress, address _newCollectionAddress, string _collectionName, uint _timestamp)'),
      fromBlock: BigInt(process.env.NEXT_PUBLIC_EVENT_BLOCK_NUMBER),
      toBlock: 'latest'
    })
    userCollectionCreatedEvents
      .filter(event => event.args._userAddress === address)
      .map(async event => {
        tmpUserCollections.push({
          name: event.args._collectionName,
          address: `${event.args._newCollectionAddress.substring(0, 12)}...${event.args._newCollectionAddress.substring(event.args._newCollectionAddress.length - 12)}`
        })
      })
    setUserCollections(tmpUserCollections);
  }

  useEffect(() => {
    const getAllUserCollections = async () => {
      if (address !== undefined) {
          await getUserCollections();
      }
    }
    getAllUserCollections();
  }, [address])

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center" // This centers the content vertically in the Flex container
      >
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing="20px"
        >
          <GridItem>
            <NewCollectionCard onSuccessCreateCollection={getUserCollections} />
          </GridItem>

          {/* Loop over userCollections to generate Collection Cards, wrapped with GridItem */}
          {userCollections.map((collection, index) => (
            <GridItem key={index}>
              <CollectionCard
                name={collection.name} // Replace with actual property name
                address={collection.address} // Replace with actual property address
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default Collections