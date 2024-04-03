'use client'

import React from 'react';
import { Badge } from '@chakra-ui/react';

const Collection = ({ params }) => {

  return (
    <Badge colorScheme='teal'>{params.address}</Badge>
  )
}

export default Collection