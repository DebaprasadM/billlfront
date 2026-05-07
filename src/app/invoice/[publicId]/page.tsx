"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import axiosInstance from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type InvoiceItem = {
  id: string;

  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
};

type Invoice = {
  id: string;

  publicId: string;
  invoiceNo: string;

  subtotal: number;
  discount: number;
  total: number;

  paidAmount: number;
  dueAmount: number;

  createdAt: string;

  customer: {
    name: string;
    whatsappNo: string;
  };

  company: {
    name: string;
  };

  items: InvoiceItem[];
};

export default function PublicInvoicePage() {

  const params = useParams();

  const publicId = params.publicId as string;

  const [loading, setLoading] = useState(true);

  const [invoice, setInvoice] =
    useState<Invoice | null>(null);

  // =========================================
  // FETCH INVOICE
  // =========================================

  useEffect(() => {

    const fetchInvoice = async () => {

      try {

        const response = await axiosInstance.get(
          `/public/invoices/${publicId}`
        );

        setInvoice(response.data.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    if (publicId) {
      fetchInvoice();
    }

  }, [publicId]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading Invoice...
      </div>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-red-500">
        Bill Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:p-0">

      <div className="max-w-md mx-auto space-y-6 print:max-w-[80mm]">

        {/* ========================================= */}
        {/* ACTIONS */}
        {/* ========================================= */}

        <div className="flex justify-end print:hidden">

          <Button onClick={() => window.print()}>
            Print Bill
          </Button>

        </div>

        {/* ========================================= */}
        {/* BILL */}
        {/* ========================================= */}

        <Card className="shadow-xl border rounded-2xl print:shadow-none print:rounded-none">

          <CardHeader className="border-b pb-4 text-center">

            {/* ========================================= */}
            {/* COMPANY */}
            {/* ========================================= */}

            <div>

              <CardTitle className="text-2xl font-extrabold tracking-wide">
                {invoice.company.name}
              </CardTitle>

              <p className="text-gray-500 mt-1 text-xs uppercase tracking-wider">
                Invoice Bill
              </p>

            </div>

            {/* ========================================= */}
            {/* INVOICE DETAILS */}
            {/* ========================================= */}

            <div className="text-sm text-gray-600 mt-4 space-y-1">

              <div className="font-bold text-black">
                {invoice.invoiceNo}
              </div>

              <div>

                {new Date(
                  invoice.createdAt
                ).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  hour12: true,
                })}

              </div>

            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-5 text-sm">

            {/* ========================================= */}
            {/* CUSTOMER */}
            {/* ========================================= */}

            <div className="space-y-1 border-b pb-4">

              <div className="font-semibold text-base">
                Customer
              </div>

              <div>
                {invoice.customer.name}
              </div>

              <div className="text-gray-500">
                {invoice.customer.whatsappNo}
              </div>

            </div>

            {/* ========================================= */}
            {/* ITEMS */}
            {/* ========================================= */}

            <div>

              <div className="font-semibold text-base mb-3">
                Items
              </div>

              <div className="space-y-3">

                {invoice.items.map((item) => (

                  <div
                    key={item.id}
                    className="border-b py-3"
                  >

                    {/* PRODUCT */}
                    <div className="font-semibold">
                      {item.productName}
                    </div>

                    {/* DETAILS */}
                    <div className="flex items-center justify-between mt-1 text-gray-600 text-xs">

                      <div>
                        {item.quantity} {item.unit}
                        × ₹{item.unitPrice}
                      </div>

                      <div className="font-bold text-black text-sm">
                        ₹ {item.totalPrice}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= */}
            {/* SUMMARY */}
            {/* ========================================= */}

            <div className="pt-4 border-t border-dashed space-y-2 text-sm">

              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>₹ {invoice.subtotal}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span>₹ {invoice.discount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Paid</span>
                <span>₹ {invoice.paidAmount}</span>
              </div>

              <div className="flex items-center justify-between font-bold text-base border-t pt-3 mt-3">
                <span>Total</span>
                <span>₹ {invoice.total}</span>
              </div>

              <div className="flex items-center justify-between text-red-500 font-bold">
                <span>Due</span>
                <span>₹ {invoice.dueAmount}</span>
              </div>

            </div>

            {/* ========================================= */}
            {/* FOOTER */}
            {/* ========================================= */}

            <div className="text-center text-xs text-gray-500 pt-6 border-t border-dashed">

              <div>
                Thank You For Your Purchase
              </div>

              <div className="mt-1">
                Visit Again
              </div>

            </div>

          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @media print {

          body {
            background: white !important;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }

          html,
          body {
            width: 80mm;
          }

        }
      `}</style>

    </div>
  );
}