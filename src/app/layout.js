import "./globals.css";
import Providers from "./Provider";
import ClientLayout from "./ClientLayout"; // move client logic here
import "react-quill/dist/quill.snow.css";
import Script from "next/script";

// export const metadata = {
//   title: "My Couponstock",
//   description: "Coupons & Deals",
// };

export default function RootLayout({ children }) {
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
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
