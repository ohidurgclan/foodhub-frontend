"use client";

import { authClient } from "@/lib/auth-client";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
      return;
    }
    if (!isPending && session && allowedRoles) {
      const role = session.user.role as Role;
      if (!allowedRoles.includes(role)) router.replace("/");
    }
  }, [session, isPending, allowedRoles, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}