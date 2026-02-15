import OneSignalInit from "./OneSignalInit";

export const metadata = {
  title: "DateUp",
  description: "Privacy First Notice Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <OneSignalInit />
        {children}
      </body>
    </html>
  );
}
