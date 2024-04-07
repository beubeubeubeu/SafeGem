/** LoadingTicketCard.js */
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

const LoadingTicketCard = () => (
  <Box
    height="443px" // Match the TicketCard height
    width="258px" // Match the TicketCard width
    bgGradient="linear(to-r, gray.50, gray.100, gray.50)"
    backgroundSize="200% 200%" // Required for the gradient animation
    backgroundColor={'WhiteAlpha.50'}
    animation={`${animatedGradient} 2s ease infinite`}
    borderRadius="md"
    borderColor={"gray.50"}
    borderWidth={"2px"}
  />
);

export default LoadingTicketCard;
