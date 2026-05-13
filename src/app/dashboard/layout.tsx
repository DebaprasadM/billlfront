"use client";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { getToken, removeToken } from "@/lib/auth";

import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  // =========================================
  // AUTH CHECK
  // =========================================

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");

      return;
    }

    setLoading(false);
  }, [router]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // =========================================
  // ACTIVE TAB
  // =========================================

  const isActive = (path: string) => pathname === path;

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    removeToken();

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* ========================================= */}
          {/* LEFT */}
          {/* ========================================= */}

         <div className="flex items-center gap-4">

  {/* TOGGLE SIDEBAR */}

  <button
    onClick={() =>
      setSidebarOpen(
        !sidebarOpen
      )
    }
    className="
      bg-gray-100
      hover:bg-gray-200
      px-4
      py-2
      rounded-xl
      font-semibold
      transition-all
      shadow-sm
    "
  >
    ☰
  </button>
            {/* ========================================= */}
            {/* LOGO */}
            {/* ========================================= */}

            <div>
              <h1 className="text-2xl font-black tracking-tight">DebBill</h1>

              {/* <p className="text-xs text-gray-500 -mt-1">Billing System</p> */}
            </div>

            {/* ========================================= */}
            {/* NAVIGATION */}
            {/* ========================================= */}

            <div className="inline-flex items-center gap-3 bg-gray-100 p-2 rounded-2xl shadow-sm">
              {/* ========================================= */}
              {/* BILLS */}
              {/* ========================================= */}

              <Link href="/dashboard/invoices">
                <div
                  style={{
                    background: isActive("/dashboard/invoices")
                      ? "#ff3b57"
                      : "transparent",

                    color: isActive("/dashboard/invoices")
                      ? "white"
                      : "#6b7280",
                  }}
                  className="
                    px-10
                    py-3
                    rounded-xl
                    font-semibold
                    cursor-pointer
                    transition-all
                    shadow-sm
                  "
                >
                  Bills
                </div>
              </Link>

              {/* ========================================= */}
              {/* CREATE BILL */}
              {/* ========================================= */}

              <Link href="/dashboard/invoices/create">
                <div
                  style={{
                    background: isActive("/dashboard/invoices/create")
                      ? "#ff3b57"
                      : "transparent",

                    color: isActive("/dashboard/invoices/create")
                      ? "white"
                      : "#6b7280",
                  }}
                  className="
                    px-10
                    py-3
                    rounded-xl
                    font-semibold
                    cursor-pointer
                    transition-all
                    shadow-sm
                  "
                >
                  New Bill
                </div>
              </Link>
            </div>
          </div>

          {/* ========================================= */}
          {/* LOGOUT */}
          {/* ========================================= */}

          {/* <button
            onClick={handleLogout}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition-all
            "
          >
            Logout
          </button> */}
        </div>
      </header>

      {/* ========================================= */}
      {/* PAGE CONTENT */}
      {/* ========================================= */}

      {/* <main className="p-6">
        {children}
      </main> */}

      {/* ========================================= */}
      {/* BODY */}
      {/* ========================================= */}

      {/* ========================================= */}
      {/* BODY */}
      {/* ========================================= */}

      <div className="flex">
        {/* ========================================= */}
        {/* SIDEBAR */}
        {/* ========================================= */}

        {sidebarOpen && (
          <aside
            className="
        w-64
        min-h-[calc(100vh-88px)]
        bg-white
        border-r
        p-4
      "
          >
            <div className="space-y-2">
              {/* PRODUCTS */}

              <Link href="/dashboard/products">
                <div
                  style={{
                    background: isActive("/dashboard/products")
                      ? "#ff3b57"
                      : "transparent",

                    color: isActive("/dashboard/products")
                      ? "white"
                      : "#6b7280",
                  }}
                  className="
              px-5
              py-3
              rounded-xl
              font-semibold
              cursor-pointer
              transition-all
            "
                >
                  Products
                </div>
              </Link>
            </div>
          </aside>
        )}

        {/* ========================================= */}
        {/* PAGE CONTENT */}
        {/* ========================================= */}

        <main className="flex-1 p-2">{children}</main>
      </div>
    </div>
  );
}
