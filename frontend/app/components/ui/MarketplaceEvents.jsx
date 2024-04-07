import React from 'react';
import {
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Badge,
  Spinner
} from '@chakra-ui/react';

const MarketplaceEvents = ({ isFetchingEvents, events }) => {

  const eventsBadge = {
    "TicketTransferred":  {
      color: "blue",
      text: "Transferred"
    },
    "FundsWithdrawed":  {
      color: "teal",
      text: "Withdrawed"
    },
    "TicketBought": {
      color: "yellow",
      text: "Bought"
    }
  }
  if (isFetchingEvents) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        width={"100%"}
      >
        <Spinner color="teal.500"/>
      </Flex>
    );
  }

  const formatTimestamp = (timestamp) => {
    // You can format the timestamp however you prefer
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date object
    return date.toLocaleString(); // Convert to local date string
  };

  return (
    <Flex direction="column" align="center" justify="center" width={"80%"}>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Event</Th>
              <Th>Withdrawer</Th>
              <Th>Buyer</Th>
              <Th>Seller</Th>
              <Th isNumeric>Amount/Price</Th>
              <Th>Time</Th>
              <Th>Token ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((event, index) => (
              <Tr key={index}>
                <Td><Badge colorScheme={eventsBadge[event.type].color}>{eventsBadge[event.type].text}</Badge></Td>
                <Td>{event.withdrawer || '-'}</Td>
                <Td>{event.buyer || '-'}</Td>
                <Td>{event.seller || '-'}</Td>
                <Td isNumeric>{event.amount ? `${event.amount} ETH` : event.price ? `${event.price} ETH` : '-'}</Td>
                <Td>{formatTimestamp(event.timestamp)}</Td>
                <Td>{event.tokenId !== undefined ? event.tokenId : '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default MarketplaceEvents;
