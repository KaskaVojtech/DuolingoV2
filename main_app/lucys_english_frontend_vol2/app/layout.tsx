import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: "Lucy's English",
  description: 'Interaktivní kurzy angličtiny',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
