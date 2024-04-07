import React from 'react'
import {
  Box,
  Text,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { FaEthereum } from "react-icons/fa";
import { weiToEth, ethInDollar } from '../../../lib/helpers';

const MarketplaceBalanceWithdraw = ({
  userBalance,
  fetchingUserBalance,
  isWithdrawingBalance,
  handleWithdrawBalance
}) => {
  return (
    <Flex
      direction={"column"}
      w={{md: "60%", base: "80%"}}
    >
      {/* Balance of user */}
      <Box
        bgColor="gray.200"
        borderRadius="md"
        borderColor="teal.200"
        borderWidth="1px"
        p={4}
      >
        <Flex
          direction="column"
          justify="center"
          h="100%"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontWeight="bold" fontFamily="mono">Your balance on contract</Text>
            {fetchingUserBalance ? (
              <Spinner color="teal.500" />
            ) : (
              <Flex direction="column" alignItems="flex-end">
                <Flex alignItems="center">
                  <Text fontWeight="bold" fontFamily="mono">
                    {weiToEth(userBalance)}
                  </Text>
                  <FaEthereum marginLeft={2}/>
                </Flex>
                {userBalance > 0 && (
                  <Text fontSize="sm">
                    {`(~${ethInDollar(weiToEth(userBalance))} USD)`}
                  </Text>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
      {/* Withdraw button */}
      <Box
        mt={5}
        minHeight="16px"
        bgColor="teal.200"
        color="grey.500"
        onClick={handleWithdrawBalance}
        p="2"
        borderRadius="md"
        disabled={userBalance === 0}
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
        { (fetchingUserBalance || isWithdrawingBalance)  ? <Spinner color="whiteAlpha.900" /> : <Text fontWeight={'bold'} fontFamily={'mono'} textAlign={'center'} >WITHDRAW</Text> }
      </Box>
    </Flex>
  )
}

export default MarketplaceBalanceWithdraw