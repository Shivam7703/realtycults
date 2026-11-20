// Path: app/admin/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

// /admin/dashboard ke andar ke saare pages yahin se protect hote hain
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  if (!verifySessionToken(store.get(COOKIE_NAME)?.value)) {
    redirect("/admin");
  }
  return <>{children}</>;
}