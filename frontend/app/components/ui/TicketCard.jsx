import React from 'react';
import {
  Card,
  Text,
  Stack,
  Image,
  Button,
  Heading,
  Divider,
  CardBody,
  CardFooter,
  ButtonGroup
} from '@chakra-ui/react';

const TicketCard = ({ index, tokenId, cidJSON, imageUrl, concertName, category, date, venue, draft, onDeleteItem }) => {

  const borderColor = {
    "Floor": 'gray.200',
    "Category 1": 'teal.400',
    "Golden circle": 'yellow.400',
  };

  const handleDelete = (index) => {
    // Just call onDeleteItem callback function from parent component with cidJSON
    onDeleteItem(index);
  };

  return (
    <Card
      maxW='xs'
      borderWidth="2px"
      bg="whiteAlpha.900"
      borderColor={borderColor[category]}
    >
      <CardBody>
        <Image
          src={imageUrl}
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
      <CardFooter>
        <ButtonGroup spacing='2'>
          <Button variant='solid' colorScheme='teal'>
            MINT TICKET
          </Button>
          <Button variant='link' colorScheme='red' onClick={() => handleDelete(index)}>
            Delete
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
