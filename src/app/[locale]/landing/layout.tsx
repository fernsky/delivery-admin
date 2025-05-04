import { Inter } from "next/font/google";
import Navbar from "./_components/navbar";
import { AppStoreProvider } from "./_components/app-store-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children, params }) => {
  const { lng } = await params;
  return (
    <AppStoreProvider>
      <Navbar lng={lng} />
      {children}
    </AppStoreProvider>
  );
};

export default RootLayout;
