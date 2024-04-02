'use client';

import { Flex } from '@chakra-ui/react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <Flex
      backgroundColor="blue.100"
      direction="column"
      minH="100vh"
      p="2rem"
      grow="1"
    >
      <Navbar />
      {children}
    </Flex>
  )
}

export default Layout