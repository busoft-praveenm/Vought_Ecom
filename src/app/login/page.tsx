import Image from "next/image";
import { LoginForm } from "./login-form";
import { AnimatedLogo } from "@/components/ui/animated-logo";

export const metadata = {
  title: "Login - Vought Ecom",
  description: "Login to access your premium dashboard.",
};

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2 overflow-hidden">
      {/* Left Column (Desktop Only) */}
      <div className="relative hidden lg:block bg-zinc-950 overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          .animate-desc {
            animation: fade-in-bottom 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) 0.6s both;
          }
          @keyframes fade-in-bottom {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}} />
        <Image
          src="/login_bg.png"
          alt="Premium abstract background"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute bottom-16 left-12 z-10 max-w-xl">
          <AnimatedLogo />
          <p className="animate-desc text-lg text-zinc-300 drop-shadow-md leading-relaxed mt-12">
            Experience the next generation of online shopping with Vought Ecom. Discover premium products across a wide range of categories, enjoy exclusive deals, fast delivery, secure checkout, and a seamless shopping experience designed just for you.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-col items-center justify-center bg-background p-6 lg:p-12 relative overflow-hidden min-h-screen lg:min-h-0 pt-48 lg:pt-0">
        
        {/* Mobile Background and Logo (Hidden on Desktop) */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <Image
            src="/login_bg.png"
            alt="Mobile background"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute top-16 w-full flex justify-center [&_h1]:justify-center">
            <AnimatedLogo />
          </div>
        </div>

        {/* Decorative background blurs (Desktop) */}
        <div className="hidden lg:block absolute top-1/4 left-1/4 w-72 h-72 bg-primary/30 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
