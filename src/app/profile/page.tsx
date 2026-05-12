"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User, Mail } from "lucide-react";
import Image from "next/image";
import { Role } from "@/types";

export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/login") },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500 overflow-hidden">
                {session?.user.image ? (
                  <Image src={session.user.image} width={64} height={64} alt="avatar" className="w-full h-full object-cover"  />
                ) : (
                  session?.user.name?.[0]?.toUpperCase() ?? "U"
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{session?.user.name}</p>
                <p className="text-sm text-gray-400">{session?.user.email}</p>
                <span className="inline-block mt-1 bg-orange-50 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {((session?.user as unknown as { role: Role })?.role) ?? "CUSTOMER"}
                </span>
              </div>
            </div>

            {/* Info fields (read-only for now, extend with update API) */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    defaultValue={session?.user.name ?? ""}
                    className="pl-9 rounded-xl border-gray-200 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-500 mb-1.5 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    defaultValue={session?.user.email ?? ""}
                    className="pl-9 rounded-xl border-gray-200 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <Button
            onClick={handleSignOut}
            disabled={loading}
            variant="outline"
            className="w-full h-11 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}