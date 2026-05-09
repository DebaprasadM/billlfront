
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axiosInstance from "@/lib/axios";
import { setToken } from "@/lib/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        "/auth/login",
        formData
      );

      const token = response.data.token;

      if (!token) {
        throw new Error("Token not found");
      }

      // ✅ save token
      setToken(token);

      // ✅ redirect dashboard
      router.push("/dashboard/invoices");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium">
                Email/ইমেল
              </label>

              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Password/পাসওয়ার্ড
              </label>

              <Input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
            {/* REGISTER LINK */}

  <div className="mt-6 text-center text-sm text-gray-600">

    Don&apos;t have an account? অ্যাকাউন্ট নেই?{" "}

    <Link
      href="/register"
      className="
        text-red-500
        hover:text-red-600
        font-semibold
        hover:underline
        transition-all
      "
    >
      Register Here/রেজিস্টার করুন
    </Link>

  </div>
        </CardContent>
      </Card>
    </div>
  );
}
