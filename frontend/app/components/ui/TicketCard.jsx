import React from 'react';
import { DeleteIcon } from '@chakra-ui/icons'
import { useWriteContract, useAccount } from 'wagmi';
import {
  safeTicketsAbi,
  safeTicketsAddress
} from '@/constants';
import {
  Box,
  Card,
  Text,
  Stack,
  Image,
  HStack,
  Button,
  Heading,
  Divider,
  CardBody,
  CardFooter
} from '@chakra-ui/react';

const TicketCard = ({ index, tokenId, cidJSON, cidImage, concertName, category, date, venue, draft, collection, onDeleteItem, onMintedItem }) => {

  const { address } = useAccount();

  const borderColor = {
    "Floor": 'gray.200',
    "Category 1": 'teal.400',
    "Golden circle": 'yellow.400',
  };

  const handleDelete = () => {
    onDeleteItem(index);
  };

  // Mint a ticket
  const { writeContract: mintTicket, isLoading: isMinting } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Ticket minted.⚒️",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onMintedItem();
      },
      onError(error) {
        toast({
          title: "Failed to mint ticket.",
          description: error.shortMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  });

  const handleMint = () => {
    mintTicket({
      address: safeTicketsAddress,
      abi: safeTicketsAbi,
      functionName: "mintTicket",
      account: address,
      args: [collection, cidJSON, cidImage]
    });
  };

  return (
    <Card
      maxW='xs'
      borderWidth="2px"
      bg="whiteAlpha.900"
      borderColor={borderColor[category]}
      size={'sm'}
    >
      <CardBody>
        { draft &&
          <HStack justify="space-between" mb={2}>
            <Text fontSize="xs">Draft</Text>
            <Box>
              <Button size="xs" variant='link' colorScheme='red' onClick={handleDelete}>
                <DeleteIcon></DeleteIcon>
              </Button>
            </Box>
          </HStack>
        }
        <Image
          src={pinataImageUrl(cidImage)}
          alt={`SafeTicket ${tokenId}`}
          borderRadius='sm'
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{concertName}</Heading>
          <Text>
            {category} • {date} • {venue}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justify="center">
        <Button variant='solid' colorScheme='teal' onClick={handleMint}>
          MINT TICKET
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
