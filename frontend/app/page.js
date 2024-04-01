  import Layout from './components/layout/Layout';
import { Heading, Box, Text } from '@chakra-ui/react';

const Home = () => {
  return (
    <>
      <Layout>
        <Box textAlign={'center'}>
          <Heading as='h1' size='4xl'>Safe Tickets</Heading>
          <Text mt={"12px"} fontSize={'xl'}>Your tickets in NFT collections</Text>
        </Box>
      </Layout>
    </>
  );
};

export default Home;
