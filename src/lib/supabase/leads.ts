import { getServiceClient } from "@/lib/supabase/admin";

export async function saveLead(email: string, source: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase.from("leads").upsert(
    { email, source },
    { onConflict: "email" },
  );
  if (error) throw error;
}
