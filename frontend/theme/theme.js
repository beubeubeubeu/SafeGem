import { extendTheme } from '@chakra-ui/react';
import { Oswald, Inter } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400']
})

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: true,
  fonts: {
    heading: oswald.style.fontFamily,
    body: inter.style.fontFamily
  },
});

export default theme;