'use client';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import PleaseConnectBox from './PleaseConnectBox';
import { Flex, Spinner, Center } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';

const Layout = ({ children }) => {

  const pathname = usePathname();
  const firstElementRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnecting, isDisconnected, isReconnecting } = useAccount();

  useEffect(() => {
    if (firstElementRef.current) {
      setIsLoading(false);
    }
  }, [firstElementRef]);

  return (
    <Flex
      px={{ base: 0, md: '12px', lg: '64px', xl: '128px' }}
      backgroundColor="gray.100"
      direction="column"
      minH="100vh"
      py="2rem"
      grow="1"
    >
      <Navbar ref={firstElementRef}/>
      {
        ((!address || isDisconnected) && pathname !== '/' && !isReconnecting && !isConnecting && !isLoading) ?
        (<PleaseConnectBox />) : ((isConnecting || isReconnecting) && !isLoading && isDisconnected) ?
        (<Center><Spinner color='gray.500'></Spinner></Center>) : children
      }
      <Footer />
    </Flex>
  )
}

export default Layout