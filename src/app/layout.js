import "./globals.css";
import Providers from "./Provider";
import ClientLayout from "./ClientLayout"; // move client logic here
import "react-quill/dist/quill.snow.css";
import Script from "next/script";
import { getConfiguredDefaultCountryCode } from "../lib/countryPath";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const defaultCountryCode = getConfiguredDefaultCountryCode();
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GNT9Z6HJXS"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GNT9Z6HJXS');`}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <Providers defaultCountryCode={defaultCountryCode}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
