import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login - Ecom Site",
  description: "Login to access your premium dashboard.",
};

export default function LoginPage() {
  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      {/* Left Side: Brand / Image */}
      <div className="relative hidden lg:block bg-zinc-950">
        <Image
          src="/login_bg.png"
          alt="Premium abstract background"
          fill
          className="object-cover opacity-80 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Ecom Site</h1>
          <p className="text-lg text-zinc-300 max-w-md">
            Experience the next generation of digital commerce with our premium analytics dashboard.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center bg-background p-6 lg:p-12 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

        <LoginForm />
      </div>
    </div>
  );
}
