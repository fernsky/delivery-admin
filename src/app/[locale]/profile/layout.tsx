import { dir } from "i18next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "./_components/navbar";
import { languages } from "../../i18n/settings";
import { AppStoreProvider } from "./_components/app-store-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children, params }) => {
  const { lng } = await params;
  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AppStoreProvider>
          <Navbar lng={lng} />
          {children}
        </AppStoreProvider>
      </body>
    </html>
  );
};

export default RootLayout;
