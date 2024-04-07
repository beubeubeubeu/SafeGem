import React from 'react'
import { keyframes } from '@emotion/react';
import { Center, Heading, Text, Box } from '@chakra-ui/react'

// Define the gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const EmptyStateBox = ({title, line1, line2}) => {
  return (
    <Center>
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
        <Heading fontSize="md" textAlign={'center'}>{title}</Heading>
        <Text fontSize="xs" mt={4} textAlign={'center'}>{line1}</Text>
        <Text fontSize="xs" textAlign={'center'}>{line2}</Text>
      </Box>
    </Center>
  )
}

export default EmptyStateBox