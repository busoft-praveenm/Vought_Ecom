import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Login - Vought Ecom",
  description: "Login to access your premium dashboard.",
};

export default function LoginPage() {
  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block bg-zinc-950">
        <style dangerouslySetInnerHTML={{__html: `
          .animate-title {
            animation: tracking-in-expand 1.2s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
          }
          .animate-desc {
            animation: fade-in-bottom 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) 0.6s both;
          }
          @keyframes tracking-in-expand {
            0% { letter-spacing: -0.5em; opacity: 0; }
            40% { opacity: 0.6; }
            100% { letter-spacing: -0.025em; opacity: 1; }
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
          className="object-cover opacity-90"
          priority
        />
        {/* Replaced white lighting gradient with a dark bottom gradient for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute bottom-16 left-12 z-10 max-w-xl">
          <h1 className="animate-title text-5xl font-extrabold text-white drop-shadow-lg mb-6">
            Vought Ecom
          </h1>
          <p className="animate-desc text-lg text-zinc-300 drop-shadow-md leading-relaxed">
            Experience the next generation of online shopping with Vought Ecom. Discover premium products across a wide range of categories, enjoy exclusive deals, fast delivery, secure checkout, and a seamless shopping experience designed just for you.
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
