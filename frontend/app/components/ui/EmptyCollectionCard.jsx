/** EmptyTicketCard.js */
import { keyframes } from '@emotion/react';
import { Box } from '@chakra-ui/react';

// Define the animation
const animatedGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const EmptyCollectionCard = () => (
  <Box
    width="400px" // Maintain the width to match the "CollectionCard"
    height="161px" // Fixed height as specified
    backgroundSize="200% 200%" // Required for the gradient animation effect
    animation={`${animatedGradient} 3s ease infinite`} // Adjusted for a slower, more subtle animation
    backgroundColor={'WhiteAlpha.50'}
    bgGradient="linear(to-r, gray.50, gray.100, gray.50)"
    borderRadius="md"
    borderWidth="2px"
    borderColor="gray.50"
    boxShadow="md"
  />
);

export default EmptyCollectionCard;
