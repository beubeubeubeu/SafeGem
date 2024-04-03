'use client'

import { useAccount } from 'wagmi';
import { React, useState, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Modal,
  Input,
  Select,
  useToast,
  FormLabel,
  FormControl,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  FormHelperText,
} from '@chakra-ui/react';

const NewTicketDraftCard = ({onSuccessCreateDraftTicket}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { address } = useAccount();

  const toast = useToast();

  const [canCreateDraftTicket, setCanCreateDraftTicket] = useState(false);

  const [cid, setCid] = useState("");

  // Initialize the ticketMetadata state with default values
  const [ticketMetadata, setTicketMetadata] = useState({
    image: '',
    attributes: [
      { value: '' },
      {
        trait_type: 'Concert date',
        display_type: 'date',
        value: Date.now()
      },
      {
        trait_type: 'Ticket category',
        value: 'Floor',
      },
    ],
  });

  // Update a specific part of the ticketMetadata state
  const updateTicketMetadata = (type, value) => {
    setTicketMetadata((prevMetadata) => {
      // Deep clone the attributes to avoid direct state mutation
      const newAttributes = [...prevMetadata.attributes];

      // Update the specific part of the metadata
      if (type === 'image') {
        // If it's the image, update it directly
        return { ...prevMetadata, image: value };
      } else if (type === 'name') {
        newAttributes[0].value = value;
      } else if (type === 'date') {
        // Ensure the date is stored in ISO format or as a timestamp
        const dateValue = new Date(value).getTime();
        newAttributes[1].value = dateValue;
      } else if (type === 'category') {
        newAttributes[2].value = value;
      }
      checkCanCreateDraftTicket();
      // Return the new state with updated attributes
      return { ...prevMetadata, attributes: newAttributes };
    });
  };

  // Pinata file upload
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      updateTicketMetadata('image', `ipfs://${resData.IpfsHash}`);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleUploadFileInputChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  // Créer un nouveau ticket URI avec Pinata
  const handleCreateTicketDraft = async () => {
    console.log("TicketMetadata: ", ticketMetadata)
  }

  const checkCanCreateDraftTicket = () => {
    setCanCreateDraftTicket(
      ticketMetadata.image !== '' &&
      ticketMetadata.attributes[0].value !== '' &&
      ticketMetadata.attributes[1].value !== '' &&
      ticketMetadata.attributes[2].value !== ''
    );
  }

  return (
    <>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // minHeight="161px" // Minimum height of the card
        h="324px" // Height of the card
        w="250px" // Width of the card
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
        <Text fontSize="lg">Add a ticket</Text>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <FormControl p="12">
            <FormLabel>Ticket image</FormLabel>
            <input type="file" id="file" ref={inputFile} onChange={handleUploadFileInputChange} />
            <button disabled={uploading} onClick={() => inputFile.current.click()}>
              {uploading && "Uploading..."}
            </button>
            <FormHelperText>jpg, png, pdf</FormHelperText>
            {cid && (
              <img
                src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cid}`}
                alt="Image from IPFS"
              />
            )}
            <FormLabel mt="4">Concert name</FormLabel>
            <Input
              borderRadius="0"
              value={ticketMetadata.attributes[0].value}
              onChange={(e) => updateTicketMetadata('name', e.target.value)}
            />
            <FormLabel mt="4">Concert date</FormLabel>
            <Input
              type="date"
              borderRadius="0"
              value={new Date(ticketMetadata.attributes[1].value).toISOString().split('T')[0]}
              onChange={(e) => updateTicketMetadata('date', e.target.value)}
            />
            <FormLabel mt="4">Ticket category</FormLabel>
            <Select
              borderRadius="0"
              value={ticketMetadata.attributes[2].value}
              onChange={(e) => updateTicketMetadata('category', e.target.value)}
            >
              <option value="Floor">Floor</option>
              <option value="Category 1">Category 1</option>
              <option value="Golden circle">Golden circle</option>
            </Select>
          </FormControl>
          <Box
            minHeight="24px"
            bgColor={canCreateDraftTicket ? "teal.200" : "gray.200"} // Change background color if not clickable
            color={canCreateDraftTicket ? "grey.500" : "gray.500"} // Change text color if not clickable
            onClick={canCreateDraftTicket ? handleCreateTicketDraft : undefined} // Only pass the onClick handler if canCreateDraftTicket is true
            p="5"
            fontWeight={200}
            fontFamily={"heading"}
            borderBottomRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor={canCreateDraftTicket ? "pointer" : "default"} // Change cursor if clickable
            transition="background-color 0.2s, color 0.2s"
            _hover={{
              bgColor: canCreateDraftTicket ? "teal.300" : undefined, // Only apply hover effects if clickable
              color: canCreateDraftTicket ? "whiteAlpha.900" : undefined,
            }}
            pointerEvents={canCreateDraftTicket ? "auto" : "none"} // Disable pointer events if not clickable
          >
            <Text textAlign="center">CREATE TICKET DRAFT</Text>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewTicketDraftCard;
