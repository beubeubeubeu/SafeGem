import React from 'react'
import { keyframes } from '@emotion/react';
import { Center, Heading, Text, Box } from '@chakra-ui/react'

// Define the gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const PleaseConnectBox = () => {
  return (
    <Center w="100%">
      <Box
        color={"whiteAlpha.800"}
        w="100%" // Make the Box take the full width of its parent
        bgGradient="linear(to-r, teal.300, teal.500, teal.300)" // Define the gradient colors
        backgroundSize="200% 200%" // Increase the background size for the animation effect
        animation={`${gradientAnimation} 30s ease infinite`} // Apply the animation
        borderRadius="sm"
        p={10}

        textAlign="center" // Center align the text directly in the Box
      >
        <Heading fontSize="md">Please connect wallet</Heading>
        <Text fontSize="xs" mt={4}>You have to connect your wallet</Text>
        <Text fontSize="xs">to start collecting tickets. 🎫</Text>
      </Box>
    </Center>
  );
};

export default PleaseConnectBox;
