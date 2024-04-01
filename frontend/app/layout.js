import Providers from "./providers";
import { Flex } from "@chakra-ui/react";

export const metadata = {
  title: "SafeTickets",
  description: "Your tickets as gold"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <Providers>
          <Flex
            direction="column"
            minH="100vh"
          >
            {children}
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
