import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catalog Bridge",
  description:
    "Doğrulanmış sosyal medya içeriklerinden taşınabilir ürün taslakları oluşturun.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
