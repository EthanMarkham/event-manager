import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/services/supabase-auth";

export default async function HomePage() {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
