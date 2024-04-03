'use client';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Box,
  Flex,
  Text,
  Icon,
  Stack,
  Heading,
  Collapse,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons'

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()

  const { address, isConnecting } = useAccount();

  return (
    <Box>
      <Flex
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('teal.200', 'teal.900')}
        pb={'24px'}
        mb={8}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
          maxWidth={'20px'}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justifyContent={{ base: 'center', md: 'start' }}>
          <Link href='/'>
            <Heading

              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}>
              SafeTickets
            </Heading>
          </Link>
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
          <DesktopNav />
        </Flex>
        <ConnectButton
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}

          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}

          chainStatus={{
            smallScreen: "none",
            largeScreen: "full"
            }}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {

  const pathname = usePathname()

  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = 'teal.500'

  return (
    <Stack direction={'row'} spacing={6} mr={20}>
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          as="a"
          pt={2}
          alignContent={'center'}
          href={navItem.href ?? '#'}
          fontSize={'md'}
          fontWeight={pathname === navItem.href ? 600 : 400 }
          color={pathname === navItem.href ? 'teal.500' : linkColor}
          _hover={{
            fontWeight: 600,
            textDecoration: 'none',
            color: linkHoverColor,
          }}>
          {navItem.label}
        </Box>
      ))}
    </Stack>
  )
}

const MobileNav = () => {
  return (
    <Stack p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

const NAV_ITEMS = [
  {
    label: '$HOP',
    href: '/marketplace',
  },
  {
    label: 'My Collections',
    href: '/collections',
  }
]