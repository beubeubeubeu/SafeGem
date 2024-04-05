import React from 'react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Text,
  Link,
  Spacer,
  VStack
} from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box minH={"128px"}>
      <VStack>
        <Spacer />
        <Text position={"absolute"} bottom={5} fontSize={"xs"}>
          Alyra,{' '}
          <Link color='teal.500' href='https://www.youtube.com/watch?v=SyNt5zm3U_M' isExternal>
            a ticket to ride.<ExternalLinkIcon mx='2px' />
          </Link>{' '}🎟️ 🎫 🧾</Text>
      </VStack>
    </Box>
  )
}

export default Footer