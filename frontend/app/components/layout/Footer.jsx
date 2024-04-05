import React from 'react'
import {
  Box,
  Text,
  Spacer,
  VStack,
  Divider
} from '@chakra-ui/react';
const Footer = () => {
  return (
    <Box minH={"128px"}>
      <VStack>
        <Spacer />
        <Text position={"absolute"} bottom={5} fontSize={"xs"}>Alyra, a ticket to ride. 🎟️ 🎫 🧾</Text>
      </VStack>
    </Box>
  )
}

export default Footer