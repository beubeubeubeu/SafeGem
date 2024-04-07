import React from 'react'
import TicketCard from './TicketCard';
import EmptyStateBox from './EmptyStateBox';
import LoadingTicketCard from './LoadingTicketCard';
import {
  Flex,
  GridItem,
  SimpleGrid
} from '@chakra-ui/react';

const MarketplaceTickets = ({fetchingTicketsData, tickets, onBoughtItem}) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center" // This centers the content vertically in the Flex container
      width={"100%"}
    >
      {/* Empty state box */}
      { !fetchingTicketsData && tickets.length === 0 && (
        <EmptyStateBox
          mt={12}
          title='No tickets for sale'
          line1='Create a collection then'
          line2='mint and sell your precious tickets.'
        />
      )}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing="32px"
      >
        {/* Empty state */}
        { fetchingTicketsData && [...Array(3)].map((_, index) => (
          <GridItem key={index}>
            <LoadingTicketCard/>
          </GridItem>
        ))}
        {/* Loop over tickets to generate Ticket Cards, wrapped with GridItem */}
        { !fetchingTicketsData && tickets.length > 0 && tickets.map((ticket, index) => (
          <GridItem key={index}>
            <TicketCard
              index={index}
              cidJSON={ticket.cidJSON}
              cidImage={ticket.cidImage}
              draft={false}
              tokenId={ticket.tokenId}
              collection={null}
              marketplace={true}
              buyings={false}
              onBoughtItem={onBoughtItem}
              onDeleteItem={() => null}
              onMintedItem={() => null}
            />
          </GridItem>
        ))}
      </SimpleGrid>
    </Flex>
  )
}

export default MarketplaceTickets