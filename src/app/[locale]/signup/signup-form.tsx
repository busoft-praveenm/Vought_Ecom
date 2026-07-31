"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { auth } from "@/firebase/auth";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update Firebase profile with name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`.trim()
      });
      
      // 3. Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // 4. Send the token and extra profile details to the backend to create tbl_user and tbl_user_profile
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const lang = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))?.[2] || 'en';
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "Accept-Language": lang
        },
        body: JSON.stringify({
          firstName,
          lastName,
          mobileNumber
        }),
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Backend authentication failed");
      }
      
      const data = await res.json();
      toast.success(data.message || "Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      let errorMessage = err.message || "Failed to create account.";
      if (err?.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (err?.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (err?.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const idToken = await userCredential.user.getIdToken();

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const lang = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))?.[2] || 'en';
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "Accept-Language": lang
        },
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Backend authentication failed");
      }
      
      const data = await res.json();
      toast.success(data.message || "Signed in with Google successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-500 my-8">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignup} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="bg-background/50 h-11"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-background/50 h-11"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number (Optional)</Label>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="bg-background/50 h-11"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="bg-background/50 h-11"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-background/50 h-11"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all mt-4">
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Button 
            variant="outline" 
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 bg-background/50 hover:bg-background transition-colors"
          >
            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
