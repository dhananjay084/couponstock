"use client";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
// import withSkeleton from "@/components/skeletons/WithSkeleton";


export default function ClientLayout({ children }) {
  
  const pathname = usePathname();
  const hideLayout = pathname === "/login" || pathname === "/signup" || pathname==='/payment';


  //  const WrappedChildren = withSkeleton(() => <>{children}</>);


  return (
    <>
      {!hideLayout && <NavBar />}
       {children}
      {!hideLayout && <Footer />}
    </>
  );
}
