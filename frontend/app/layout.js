import Providers from "./providers";
import Layout from './components/layout/Layout';

export const metadata = {
  title: "SafeTickets",
  description: "Your tickets are gold"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
