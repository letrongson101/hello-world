import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lì Xì Tết Bank Team",
  description: "Zero-input lì xì app cho team ngân hàng"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
