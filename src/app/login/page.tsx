"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const { error: err } = await authClient.signIn.email(
      { email: form.email, password: form.password, rememberMe: true },
      {
        onSuccess: () => router.push("/"),
        onError: (ctx) => setError(ctx.error.message || "Login failed."),
      }
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl mb-4">
            <span className="text-2xl">🍔</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="space-y-5">
            {/* Email */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9 rounded-xl border-gray-200 h-11"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10 rounded-xl border-gray-200 h-11"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-500 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}