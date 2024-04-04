'use client'

import { useAccount } from 'wagmi';
import { AddIcon } from '@chakra-ui/icons';
import { getPinataImageUrl } from "@/lib/helpers";
import { React, useState, useRef } from 'react';
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

const NewTicketDraftCard = ({onSuccessCreateDraftTicket, collection}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { address } = useAccount();

  const toast = useToast();

  const [canCreateDraftTicket, setCanCreateDraftTicket] = useState(false);

  const [cidImage, setCidImage] = useState("");
  const [cidJSON, setCidJSON] = useState("");

  // Initialize the ticketMetadata state with default values
  const [ticketMetadata, setTicketMetadata] = useState({
    image: '',
    attributes: [
      { value: '' },
      {
        trait_type: 'Venue',
        value: ''
      },
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
      } else if (type === 'venue') {
        newAttributes[1].value = value;
      } else if (type === 'date') {
        // Ensure the date is stored in ISO format or as a timestamp
        const dateValue = new Date(value).getTime();
        newAttributes[2].value = dateValue;
      } else if (type === 'category') {
        newAttributes[3].value = value;
      }
      checkCanCreateDraftTicket();
      // Return the new state with updated attributes
      return { ...prevMetadata, attributes: newAttributes };
    });
  };

  // Pinata file and JSON upload
  const [file, setFile] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingJSON, setUploadingJSON] = useState(false);

  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload) => {
    try {
      setUploadingFile(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCidImage(resData.IpfsHash);
      updateTicketMetadata('image', `ipfs://${resData.IpfsHash}`);
      setUploadingFile(false);
      checkCanCreateDraftTicket();
    } catch (e) {
      console.log(e);
      setUploadingFile(false);
      checkCanCreateDraftTicket();
      alert("Trouble uploading file");
    }
  };

  const handleUploadFileInputChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
    checkCanCreateDraftTicket();
  };

  const uploadJSON = async () => {
    try {
      setUploadingJSON(true);
      const res = await fetch("/api/json", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketMetadata),
      });
      const resData = await res.json();
      setCidJSON(resData.res.IpfsHash);
      setUploadingJSON(false);
      handleCreateTicketDraft(resData.res.IpfsHash);
    } catch (e) {
      console.log(e);
      setUploadingJSON(false);
      alert("Trouble uploading json");
    }
  }

  // Create a new draft ticket
  const handleCreateTicketDraft = async (resCidJSON) => {

    let ticketDraftsStorage;
    try {
      // Attempt to parse the existing drafts from localStorage
      ticketDraftsStorage = JSON.parse(localStorage.getItem('ticketDrafts')) || {};
      if (Array.isArray(ticketDraftsStorage) && ticketDraftsStorage.length === 0) {
        ticketDraftsStorage = {}; // Convert to an empty object
      }
    } catch (e) {
      // If an error occurs, default to an empty object
      ticketDraftsStorage = {};
    }

    // Ensure 'collection' key exists and is an array, otherwise initialize it as an empty array
    ticketDraftsStorage[collection] = ticketDraftsStorage[collection] || [];

    const ticketDraft = {
      cidJSON: resCidJSON,
      cidImage: cidImage,
      concertName: ticketMetadata.attributes[0].value,
      venue: ticketMetadata.attributes[1].value,
      date: ticketMetadata.attributes[2].value,
      category: ticketMetadata.attributes[3].value,
      draft: true,
      tokenId: null
    };

    // Push the new draft into the 'collection' array
    ticketDraftsStorage[collection].push(ticketDraft);
    console.log("ticketDraftsStorage: ", ticketDraftsStorage)
    console.log("collection: ", ticketDraftsStorage[collection])
    console.log("ticketDraft: ", ticketDraft)

    // Save the updated object back to local storage
    localStorage.setItem('ticketDrafts', JSON.stringify(ticketDraftsStorage));

    toast({
      title: "Draft created. Go mint !",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onSuccessCreateDraftTicket();
    setTicketMetadata({
      image: '',
      attributes: [
        { value: '' },
        {
          trait_type: 'Venue',
          value: ''
        },
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
    setFile("");
    setCidImage("");
    setCidJSON("");
    setCanCreateDraftTicket(false);
    onClose();
  };

  const checkCanCreateDraftTicket = () => {
    setCanCreateDraftTicket(
      ticketMetadata.image !== '' &&
      ticketMetadata.attributes[0].value !== '' &&
      ticketMetadata.attributes[1].value !== '' &&
      ticketMetadata.attributes[2].value !== '' &&
      ticketMetadata.attributes[3].value !== ''
    );
  };

  return (
    <>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="472px" // Height of the card
        w="285px" // Width of the card
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
            <button disabled={uploadingFile} onClick={() => inputFile.current.click()}>
              {uploadingFile && "Uploading..."}
            </button>
            <FormHelperText>jpg, png, pdf</FormHelperText>
            {cidImage && (
              <img
                src={getPinataImageUrl(cidImage)}
                alt="Image from IPFS"
              />
            )}
            <FormLabel mt="4">Concert name</FormLabel>
            <Input
              borderRadius="0"
              value={ticketMetadata.attributes[0].value}
              onChange={(e) => updateTicketMetadata('name', e.target.value)}
            />
            <FormLabel mt="4">Venue</FormLabel>
            <Input
              borderRadius="0"
              value={ticketMetadata.attributes[1].value}
              onChange={(e) => updateTicketMetadata('venue', e.target.value)}
            />
            <FormLabel mt="4">Concert date</FormLabel>
            <Input
              type="date"
              borderRadius="0"
              value={new Date(ticketMetadata.attributes[2].value).toISOString().split('T')[0]}
              onChange={(e) => updateTicketMetadata('date', e.target.value)}
            />
            <FormLabel mt="4">Ticket category</FormLabel>
            <Select
              borderRadius="0"
              value={ticketMetadata.attributes[3].value}
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
            onClick={canCreateDraftTicket ? uploadJSON : undefined} // Only pass the onClick handler if canCreateDraftTicket is true
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
