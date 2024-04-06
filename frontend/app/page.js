import Link from 'next/link';

import { Heading, Box, Button, Flex, VStack, Image, Center } from '@chakra-ui/react';
const Home = () => {
  return (
    <>
      <Box textAlign={'center'} mt={12}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="center" align="center">
          <VStack flex="2" spacing="24px" mr={{ base: '0', md: '24px' }}>
            <Heading as='h1' size='4xl'>Your tickets into NFT collections</Heading>
            <Link href='/collections' style={{ textDecoration: 'none' }}>
              <Button colorScheme='yellow' size={'lg'}>Start Collecting Now</Button>
            </Link>
          </VStack>
            <Box mx={{ base: '12px', md: '0' }} flex="1" mt={{ base: '24px', md: '0' }} >
          <Center>
              <Image src="/images/safeTicket.png" alt="Your NFT Collection"/>
          </Center>
            </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
