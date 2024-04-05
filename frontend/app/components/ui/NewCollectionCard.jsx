'use client'

import { React, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { useWriteContract, useAccount } from 'wagmi';
import {
  userCollectionFactoryAbi,
  userCollectionFactoryAddress
} from '@/constants';
import {
  Box,
  Text,
  Modal,
  Input,
  Spinner,
  useToast,
  FormLabel,
  FormControl,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  FormHelperText,
} from '@chakra-ui/react';

const NewCollectionCard = ({onSuccessCreateCollection}) => {

  const [collectionName, setCollectionName] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { address } = useAccount();

  const toast = useToast();

  // Create (clone) a new collection
  const {
    writeContract: createCollection,
    isPending: isPendingCreatingCollection,
    isLoading: isCreatingCollection
  } = useWriteContract({
    mutation: {
      onSuccess() {
        toast({
          title: "Collection created.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setCollectionName('');
        onClose();
        onSuccessCreateCollection();
      },
      onError(error) {
        const pattern = /Error: ([A-Za-z0-9_]+)\(\)/;
        const match = error.message.match(pattern);
        toast({
          title: "Failed to create collection.",
          description: match[1] || error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    }
  });

  const handleCreateCollection = () => {
    createCollection({
      address: userCollectionFactoryAddress,
      abi: userCollectionFactoryAbi,
      functionName: "createNFTCollection",
      account: address,
      args: [collectionName]
    });
  };

  return (
    <>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="161px" // Minimum height of the card
        h="100px" // Height of the card
        w="400px" // Width of the card
        bg="whiteAlpha.900" // Background color
        color="gray.600" // Text color
        borderWidth="2px"
        borderColor="teal.200"
        borderRadius="md"
        boxShadow="md"
        transition="background-color 0.2s, color 0.2s"
        _hover={{
          boxShadow: "lg",
          bg: "gray.100", // Change bg color on hover
          color: "gray.700", // Change text color on hover
        }}
        onClick={onOpen}
      >
        <AddIcon mr={2} />
        <Text fontSize="lg">Create a new collection</Text>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl p="12">
            <FormLabel>Collection name</FormLabel>
            <Input
              borderRadius="0"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              mb="2px"
            />
            <FormHelperText>No worries you can change this later.</FormHelperText>
            <FormLabel mt="4">Contract type</FormLabel>
            <Input
              disabled
              borderRadius="0"
              value="ERC-721"
            />
            <FormLabel mt="4">Blockchain</FormLabel>
            <Input
              disabled
              borderRadius="0"
              value={process.env.NEXT_PUBLIC_NETWORK.charAt(0).toUpperCase() + process.env.NEXT_PUBLIC_NETWORK.slice(1)}
            />
          </FormControl>
          <Box
            minHeight="24px"
            bgColor="teal.200"
            color="grey.500"
            onClick={handleCreateCollection}
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
            {
              (isCreatingCollection || isPendingCreatingCollection) ?
                (<Spinner color="whiteAlpha.900" />)
                  :
                (<Text textAlign="center">CREATE COLLECTION</Text>)
            }
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewCollectionCard;
