'use client'

import { useAccount } from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/lib/client';
import { React, useEffect, useState } from 'react';
import { userCollectionFactoryAddress} from '@/constants';
import CollectionCard from '../components/ui/CollectionCard';
import NewCollectionCard from '../components/ui/NewCollectionCard';
import EmptyCollectionCard from '../components/ui/EmptyCollectionCard';
import {
  Box,
  Flex,
  Text,
  Center,
  Heading,
  Divider,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';

const Collections = () => {

  const { address } = useAccount();
  const [userCollections, setUserCollections] = useState();
  const [fetchingUserCollections, setFetchingUserCollections] = useState(true);

  const getUserCollections = async () => {
    setFetchingUserCollections(true);
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
          address: event.args._newCollectionAddress,
          shortAddress: `${event.args._newCollectionAddress.substring(0, 12)}...${event.args._newCollectionAddress.substring(event.args._newCollectionAddress.length - 12)}`
        })
      })
    setUserCollections(tmpUserCollections);
    setFetchingUserCollections(false);
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
      <Heading mt={{sm: "32px", md: "0px"}} textAlign={'center'}>My collections</Heading>
      <Center>
        <Box mx={5} maxWidth={'500px'}>
          <Divider my={5} border={'none'}></Divider>
          <Text textAlign={'center'} fontSize='sm'>Go mint go sell.</Text>
        </Box>
      </Center>
      <Flex
        mt={"32px"}
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

          {/* Empty state */}
          { fetchingUserCollections && [...Array(4)].map((_, index) => (
            <GridItem key={index}>
              <EmptyCollectionCard/>
            </GridItem>
          ))}

          {/* Loop over userCollections to generate Collection Cards, wrapped with GridItem */}
          {userCollections && userCollections.map((collection, index) => (
            <GridItem key={index}>
              <CollectionCard
                name={collection.name}
                shortAddress={collection.shortAddress}
                address={collection.address}
              />
            </GridItem>
          ))}
        </SimpleGrid>
      </Flex>
    </>
  )
}

export default Collections