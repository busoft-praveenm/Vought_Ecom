import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Profile - Vought Ecom",
  description: "View your profile details.",
};

async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return null;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const res = await fetch(`${backendUrl}/auth/me`, {
    headers: {
      "Cookie": `access_token=${token}`,
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data?.user;
}

export default async function ProfilePage() {
  const user = await getProfile();

  if (!user) {
    redirect("/login");
  }

  const profile = user.profile || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      </div>

      <Card className="max-w-2xl bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Manage your personal profile details. (Billing and delivery address coming soon!)
          </CardDescription>
        </CardHeader>
        <ProfileForm user={user} profile={profile} />
      </Card>
    </div>
  );
}
