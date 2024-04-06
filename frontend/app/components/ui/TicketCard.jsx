'use client'

import { FaEthereum } from "react-icons/fa";
import { DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState, React } from 'react';
import TicketPriceModal from '../modals/TicketPriceModal';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import {
  safeTicketsAbi,
  marketplaceAbi,
  safeTicketsAddress,
  marketplaceAddress
} from '@/constants';
import {
  weiToEth,
  formatTokenId,
  getPinataImageUrl,
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
  Center,
  Button,
  Spinner,
  Heading,
  Divider,
  useToast,
  CardBody,
  CardFooter,
  useDisclosure
} from '@chakra-ui/react';

const TicketCard = ({
  index,
  tokenId,
  cidJSON,
  cidImage,
  draft,
  shop,
  collection,
  onDeleteItem,
  onMintedItem
}) => {

  const [fetchingMetadata, setFetchingMetadata] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [concertName, setConcertName] = useState('');
  const [category, setCategory] = useState('Loading');
  const [selling, setSelling] = useState('');
  const [onSale, setOnSale] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const { address } = useAccount();

  const toast = useToast();

  const categoryBorderColor = {
    "Loading": 'gray.50',
    "Floor": 'gray.200',
    "Category 1": 'teal.400',
    "Golden circle": 'yellow.400',
  };

  const categoryBadgeColor = {
    "Loading": 'gray.50',
    "Floor": 'default',
    "Category 1": 'teal',
    "Golden circle": 'yellow',
  };

  // Get ticket selling info
  const {data: ticketSellingInfo, refetch: refetchTicketSellingInfo } = useReadContract({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'ticketSelling',
    args: [tokenId]
  });

  // Fetch ticket data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingMetadata(true);
        const response = await fetch(`/api/json?cidJSON=${cidJSON}`);
        const ticketMetadata = await response.json();
        if (!draft) {
          const sellingInfo = await ticketSellingInfo;
          setOnSale(sellingInfo[0]);
          setSelling(sellingInfo[1]);
          setPrice(sellingInfo[2]);
        }
        setConcertName(ticketMetadata.metadata.attributes[0].value);
        setVenue(ticketMetadata.metadata.attributes[1].value);
        setDate(ticketMetadata.metadata.attributes[2].value);
        setCategory(ticketMetadata.metadata.attributes[3].value);

        setFetchingMetadata(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [cidJSON, ticketSellingInfo]); // Depend on cidJSON to refetch if it changes

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
        const pattern = /Error: ([A-Za-z0-9_]+)\(\)/;
        const match = error.message.match(pattern);
        toast({
          title: "Failed to mint ticket.",
          description: match[1] || error.message,
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

  // Set a ticket on sale
  const { writeContract: setTicketOnsale, isPending: isPendingSetTicketOnsale, isLoading: isSettingTicketOnsale } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Ticket on sale. 💸",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        refetchTicketSellingInfo();
      },
      onError(error) {
        const pattern = /Error: ([A-Za-z0-9_]+)\(\)/;
        const match = error.message.match(pattern);
        toast({
          title: "Failed to set ticket on sale.",
          description: match[1] || error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  });

  const handleSetTicketOnsale = (toggle) => {
    setTicketOnsale({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      functionName: "setTicketOnSale",
      account: address,
      args: [tokenId, toggle]
    });
  };

  return (
    <>
      <TicketPriceModal isOpen={isOpen} onClose={onClose} tokenId={tokenId} onPriceSet={refetchTicketSellingInfo} />
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
              { !fetchingMetadata && (
              <Badge colorScheme={categoryBadgeColor[category]}>{category}</Badge>
              )}
              { !fetchingMetadata && (
                <Heading>{formatTokenId(tokenId)}</Heading>
              )}
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
            {fetchingMetadata ? <Center width="100%" height="100%"><Spinner color="gray.200"></Spinner></Center> : (
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
            )}
          </Box>
          <Stack mt='6' spacing='3'>
            <Heading size='md'>
              {fetchingMetadata ?  <Spinner color="gray.200"></Spinner> : concertName}
            </Heading>
            <Text>
              {fetchingMetadata ? <Spinner color="gray.200"></Spinner> : venue}
            </Text>
            <HStack justify="space-between">
              <Text>
                {fetchingMetadata ? <Spinner color="gray.200"></Spinner> : timestampToHumanDate(date)}
              </Text>
                {fetchingMetadata ? (
                  <Spinner color="gray.200" />
                ) : (
                  price && onSale && (
                    <HStack spacing={2}>
                      <Text fontWeight={'bold'} fontFamily={'mono'}>
                        {weiToEth(price)}
                      </Text>
                      <FaEthereum marginRight={0}/>
                    </HStack>
                  )
                )}
            </HStack>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter
          bgColor={categoryBorderColor[category]}
          justify="center"
        >
          { fetchingMetadata ? <Spinner color="gray.200"></Spinner> : draft ? (
            <Button
              isLoading={isMinting || isPendingMinting}
              variant='ghost'
              colorScheme='teal'
              onClick={handleMint}
            >
              MINT TICKET
            </Button>
          ) : shop ? (
            <Button
              isLoading={isPendingSetTicketOnsale || isSettingTicketOnsale}
              variant='ghost'
              colorScheme='yellow'
              onClick={() => handleSetTicketOnsale(true)}
            >
              BUY
            </Button>
          ) : onSale ? (
            <>
              <Button
                isLoading={false}
                variant='ghost'
                colorScheme='yellow'
                onClick={onOpen}
              >
                SET PRICE
              </Button>
              <Button
                isLoading={false}
                variant='ghost'
                colorScheme='red'
                onClick={() => handleSetTicketOnsale(false)}
              >
                UNSELL
              </Button>
            </>
          ) : (
            <Button
              isLoading={isPendingSetTicketOnsale || isSettingTicketOnsale}
              variant='ghost'
              colorScheme='teal'
              onClick={() => handleSetTicketOnsale(true)}
            >
              SET ON SALE
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default TicketCard;
