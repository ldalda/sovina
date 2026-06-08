import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Julgamento } from "./Julgamento";

export default async function JulgamentoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarded_at) redirect("/app");

  return <Julgamento />;
}
