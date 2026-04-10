import { AuthVisuals } from "@/features/auth/components/auth-visuals";
import { LoginForm } from "@/features/auth/components/login_form";
import { requireUnauth } from "@/lib/auth-utils";

export default async function Page() {
  await requireUnauth();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#060608] overflow-x-hidden">
      {/* Background visuals */}
      <AuthVisuals />

      {/* Login form */}
      <div className="relative z-30 w-full">
        <LoginForm />
      </div>
    </div>
  );
}
