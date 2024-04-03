import React from 'react'
import { Box, Flex, Text, VStack, Divider, Badge } from '@chakra-ui/react';

const CollectionCard = ({ name, address }) => {
  return (
    <Box
      as="button"
      width="400px" // Same width as the "create collection" card
      borderWidth="2px"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="md"
      _hover={{
        boxShadow: "lg",
        bg: "gray.100", // Change bg color on hover
        color: "gray.700", // Change text color on hover
      }}
      cursor="pointer"
      overflow="hidden"
      transition="all 0.2s"
    >
      <Flex>
        {/* Left side - Tickets info */}
        <Flex
          width="25%"
          backgroundColor="gray.200"
          p="5"
          direction="column"
          justifyContent="space-between" // Spreads the ticket info and the address badge
          position="relative" // To position the address badge absolutely
        >
          <Text fontSize="lg" transform="rotate(-90deg)" position="absolute" left="17%" bottom="0" transformOrigin="left bottom" whiteSpace="nowrap" width="max-content">
            <Badge colorScheme='teal'>{address}</Badge>
          </Text>
        </Flex>

        {/* Right side - Collection info */}
        <VStack
          width="75%"
          p="5"
          spacing="4"
          align="start"
          justifyContent="space-between"
          backgroundColor="whiteAlpha.900"
        >
          {/* Collection Name */}
          <Text fontSize="2xl" fontWeight="bold">
            {name}
          </Text>

          <Divider />

          {/* Collection details */}
          <Flex width="full" justifyContent="space-between">
            <VStack align="start" spacing="0">
              <Text fontSize="sm" color="gray.500">TYPE</Text>
              <Text fontSize="lg" fontWeight="bold">ERC-721</Text>
            </VStack>
            <VStack align="start" spacing="0">
              <Text fontSize="sm" color="gray.500">BLOCKCHAIN</Text>
              <Text fontSize="lg" fontWeight="bold">{process.env.NEXT_PUBLIC_NETWORK.charAt(0).toUpperCase() + process.env.NEXT_PUBLIC_NETWORK.slice(1)}</Text>
            </VStack>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CollectionCard;
