import { getServiceClient } from "@/lib/supabase/admin";

export async function saveLead(email: string, source: string): Promise<void> {
  const supabase = getServiceClient();
  // La unicidad es por email y origen (migración 20261030230000): la misma persona puede pedir prompts y avisos.
  const { error } = await supabase.from("leads").upsert(
    { email, source },
    { onConflict: "email,source", ignoreDuplicates: true },
  );
  if (error) throw error;
}
