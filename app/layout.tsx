import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "../lib/site";
import SmoothScroll from "../components/SmoothScroll";

export const metadata = {
  title: `${site.name} | ${site.tagline}`,
  description:
    "We build digital systems that turn demand into customers across SEO, paid ads, social and your website. Not more traffic. More business.",
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F7F3",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}.rise{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
