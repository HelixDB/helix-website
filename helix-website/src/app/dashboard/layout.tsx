import { Metadata } from "next";
import { AuthWrapper } from "./auth-wrapper";

export const metadata: Metadata = {
  title: "HelixDB | Dashboard",
  description: "Deploy and manage your HelixDB instances",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <main className="">{children}</main>
    </AuthWrapper>
  );
}
