import { DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState, React } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import {
  safeTicketsAbi,
  safeTicketsAddress
} from '@/constants';
import {
  getPinataImageUrl,
  formatTokenId,
  timestampToHumanDate
} from '@/lib/helpers';
import {
  Box,
  Card,
  Text,
  Stack,
  Image,
  Badge,
  HStack,
  Button,
  Heading,
  Divider,
  useToast,
  CardBody,
  CardFooter
} from '@chakra-ui/react';

const TicketCard = ({ index, tokenId, cidJSON, cidImage, draft, collection, onDeleteItem, onMintedItem }) => {

  const [fetchingMetadata, setFetchingMetadata] = useState(true);
  const [concertName, setConcertName] = useState('');
  const [category, setCategory] = useState('Floor');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');

  const { address } = useAccount();

  const toast = useToast();

  const categoryBorderColor = {
    "Floor": 'gray.200',
    "Category 1": 'teal.400',
    "Golden circle": 'yellow.400',
  };

  const categoryBadgeColor = {
    "Floor": 'default',
    "Category 1": 'teal',
    "Golden circle": 'yellow',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/json?cidJSON=${cidJSON}`);
        const ticketMetadata = await response.json();
        setConcertName(ticketMetadata.metadata.attributes[0].value);
        setVenue(ticketMetadata.metadata.attributes[1].value);
        setDate(ticketMetadata.metadata.attributes[2].value);
        setCategory(ticketMetadata.metadata.attributes[3].value);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [cidJSON]); // Depend on cidJSON to refetch if it changes

  const handleDelete = () => {
    onDeleteItem(index);
  };

  // Mint a ticket
  const { writeContract: mintSafeTicket, isPending: isPendingMinting, isLoading: isMinting } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Ticket minted.⚒️",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onMintedItem(index);
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
    mintSafeTicket({
      address: safeTicketsAddress,
      abi: safeTicketsAbi,
      functionName: "mintTicket",
      account: address,
      args: [collection, cidImage, cidJSON]
    });
  };

  return (
    <Card
      borderWidth="2px"
      bg="whiteAlpha.900"
      borderColor={categoryBorderColor[category]}
      size={'sm'}
      minH="443px"
      minW="258px"
    >
      <CardBody>
        { draft ? (
          <HStack minH="43px" justify="space-between" mb={2}>
            <Text fontSize="xs">Draft</Text>
            <Box>
              <Button size="xs" variant='link' colorScheme='red' onClick={handleDelete}>
                <DeleteIcon></DeleteIcon>
              </Button>
            </Box>
          </HStack>
        ) : (
          <HStack justify="space-between" mb={2}>
            <Badge colorScheme={categoryBadgeColor[category]}>{category}</Badge>
            <Heading>{formatTokenId(tokenId)}</Heading>
          </HStack>
        )}
        <Box
          height="180px" // Fixed height for the container
          width="100%" // Make sure the width matches the container width
          overflow="hidden" // Hide overflow to handle images larger than the container
          position="relative" // Position relative to allow absolute positioning of the image
          borderColor={categoryBorderColor[category]}
          borderWidth="2px"
          borderRadius='sm'
        >
          <Image
            src={getPinataImageUrl(cidImage)}
            alt={`SafeTicket ${tokenId}`}
            objectFit="cover" // Cover the container without stretching the image
            position="absolute" // Position absolute to be bound by the Box
            width="100%"
            height="100%"
            top="0"
            left="0"
          />
        </Box>
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{concertName}</Heading>
          <Text>
            {venue}
          </Text>
          <Text>{timestampToHumanDate(date)}</Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter justify="center">
        { draft ? (
          <Button isLoading={isMinting || isPendingMinting} variant='solid' colorScheme='teal' onClick={handleMint}>
            MINT TICKET
          </Button>
        )
        : (
          <Button variant='solid' colorScheme='yellow'>SET ON SALE</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
