'use client';

import Navbar from './Navbar';
import Footer from './Footer';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import { Flex, Spinner, Center } from '@chakra-ui/react';
import PleaseConnectBox from './PleaseConnectBox';

const Layout = ({ children }) => {

  const { address, isConnecting, isDisconnected, isReconnecting } = useAccount();
  const pathname = usePathname();

  return (
    <Flex
      px={{ base: 0, md: '12px', lg: '64px', xl: '128px' }}
      backgroundColor="gray.100"
      direction="column"
      minH="100vh"
      py="2rem"
      grow="1"
    >
      <Navbar />
      {
        ((!address || isDisconnected) && pathname !== '/') ?
        (<PleaseConnectBox />) : (isConnecting || isReconnecting) ?
        (<Center><Spinner color='gray.500'></Spinner></Center>) : children
      }
      <Footer />
    </Flex>
  )
}

export default Layout