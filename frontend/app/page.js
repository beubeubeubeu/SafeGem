import Link from 'next/link';
import { Heading, Box, Text, Button, Flex, VStack, Image } from '@chakra-ui/react';

const Home = () => {
  return (
    <>
      <Box textAlign={'center'} mt={24}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="center" align="center">
          <VStack flex="2" spacing="24px">
            <Heading as='h1' size='4xl'>Your tickets into NFT collections</Heading>
            <Link href='/collections' style={{ textDecoration: 'none' }}>
              <Button colorScheme='teal' size={'lg'}>Start Collecting Now</Button>
            </Link>
            <Text>🎟️ 🎫 🧾</Text>
          </VStack>
          <Box flex="1" mt={{ base: '24px', md: '0' }} bgColor={"red"} minH={"314px"} minW={{ base: 'full', md: '314px' }}>
            <Image src="/images/mosaiq.webp" alt="Your NFT Collection"/>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Home;
