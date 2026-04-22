import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default Layout;
