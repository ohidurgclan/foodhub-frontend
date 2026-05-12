"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await authClient.signUp.email(
      { name: form.name, email: form.email, password: form.password },
      {
        onSuccess: () => router.push("/"),
        onError: (ctx) => { setError(ctx.error.message || "Registration failed."); setLoading(false); },
      }
    );
  };

  const field = (
    key: keyof typeof form,
    label: string,
    type: string,
    placeholder: string,
    Icon: React.ElementType
  ) => (
    <div>
      <Label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type={
            (key === "password" || key === "confirmPassword")
              ? (showPassword ? "text" : "password")
              : type
          }
          placeholder={placeholder}
          className="pl-9 rounded-xl border-gray-200 h-11"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
        {key === "confirmPassword" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-2xl mb-4">
            <span className="text-2xl">🍔</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Join us and start ordering</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="space-y-4">
            {field("name", "Full Name", "text", "John Doe", User)}
            {field("email", "Email", "email", "you@example.com", Mail)}
            {field("password", "Password", "password", "Min. 8 characters", Lock)}
            {field("confirmPassword", "Confirm Password", "password", "Re-enter password", Lock)}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}