'use client'

import { React, useState, useRef } from 'react';
import { ethInDollar, ethToWei } from '@/lib/helpers';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import {
  marketplaceAbi,
  marketplaceAddress
} from '@/constants';
import {
  Box,
  Text,
  Card,
  Modal,
  Input,
  Select,
  Spinner,
  useToast,
  FormLabel,
  FormControl,
  ModalOverlay,
  ModalContent,
  FormHelperText
} from '@chakra-ui/react';

const TicketPriceModal = ({isOpen, onClose, tokenId, onPriceSet}) => {

  const toast = useToast();

  const { address } = useAccount();

  const [price, setPrice] = useState('');
  const [priceInWei, setPriceInWei] = useState('');
  const [priceInDollar, setPriceInDollar] = useState('');

  const handleChange = (event) => {
    setPrice(event.target.value);
    setPriceInWei(ethToWei(event.target.value));
    setPriceInDollar(ethInDollar(event.target.value));
  };

  // Set a ticket price
  const { writeContract: setTicketPrice, isPending: isPendingSetTicketPrice, isLoading: isSettingTicketPrice } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Ticket price set. 💰",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onPriceSet();
        onClose();
        setPrice('');
        setPriceInDollar('');
        setPriceInWei('');
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

  const handleSetTicketPrice = () => {
    console.log("tokenId", tokenId);
    console.log(priceInWei);
    console.log(address);
    setTicketPrice({
      address: marketplaceAddress,
      abi: marketplaceAbi,
      functionName: "setTicketPrice",
      account: address,
      args: [tokenId, priceInWei]
    });
  };

  return (
    <>
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl p="12">
            <FormLabel mt="4">Ticket price in ETH</FormLabel>
            <Input
              type={"number"}
              onChange={handleChange}
              value={price}
              min={0}
            />
            {price && <FormHelperText>{`Approximately $${priceInDollar} USD`}</FormHelperText>}
          </FormControl>
          <Box
            minHeight="24px"
            bgColor="teal.200"
            color="grey.500"
            onClick={handleSetTicketPrice}
            p="5"
            fontWeight={200}
            fontFamily={"heading"}
            borderBottomRadius="md"
            display="flex" // Use flexbox for centering
            alignItems="center" // Center vertically
            justifyContent="center" // Center horizontally
            cursor="pointer" // Change cursor to pointer
            transition="background-color 0.2s, color 0.2s" // Smooth transition for hover effect
            _hover={{
              bgColor: "teal.300", // Darker green on hover
              color: "whiteAlpha.900" // Lighter white text on hover
            }}
          >
            { (isPendingSetTicketPrice || isSettingTicketPrice) ? <Spinner color="whiteAlpha.900" /> : <Text textAlign="center">SET PRICE</Text> }
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TicketPriceModal;