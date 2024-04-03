'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Badge, Text, Heading, Center, Divider } from '@chakra-ui/react';

const Collection = ({ params }) => {

  const searchParams = useSearchParams();
  const name = searchParams.get('name')

  return (
    <>
      <Heading textAlign={'center'}>{name}</Heading>
      <Center>
        <Box mx={5} maxWidth={'500px'}>
          <Divider my={5}></Divider>
          <Text textAlign={'center'} fontSize='sm'>Ticket collection lives at <Badge colorScheme='teal'>{params.address}</Badge> • Contract type is <Badge colorScheme='teal'>ERC-721</Badge> • Blockchain is <Badge colorScheme='teal'>{process.env.NEXT_PUBLIC_NETWORK.charAt(0).toUpperCase() + process.env.NEXT_PUBLIC_NETWORK.slice(1)}</Badge></Text>
        </Box>
      </Center>
    </>
  )
}

export default Collection