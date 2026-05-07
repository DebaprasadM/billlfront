
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getToken, removeToken } from "@/lib/auth";

import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    // ✅ redirect if not logged in
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // ✅ loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // ✅ logout
  const handleLogout = () => {
    removeToken();

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          DebBill
        </h1>

        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </header>

      {/* ========================= */}
      {/* PAGE CONTENT */}
      {/* ========================= */}

      <main className="p-6">
        {children}
      </main>
    </div>
  );
}

