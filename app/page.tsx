import Hero from "@/components/hero";
import EcoGrid from "@/components/Landing";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <EcoGrid></EcoGrid>
    </>
  );
}
