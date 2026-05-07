
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
        Invoice Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* ========================================= */}
        {/* ACTIONS */}
        {/* ========================================= */}

        <div className="flex justify-end">
          <Button
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>
        </div>

        {/* ========================================= */}
        {/* INVOICE */}
        {/* ========================================= */}

        <Card className="shadow-lg">

          <CardHeader className="border-b">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <CardTitle className="text-3xl font-bold">
                  {invoice.company.name}
                </CardTitle>

                <p className="text-gray-500 mt-1">
                  Invoice Billing
                </p>
              </div>

              <div className="text-left md:text-right space-y-1">
                <div className="text-lg font-semibold">
                  {invoice.invoiceNo}
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(
                    invoice.createdAt
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">

            {/* ========================================= */}
            {/* CUSTOMER */}
            {/* ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Customer Information
                </h2>

                <div className="space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium">
                      Name:
                    </span>{" "}
                    {invoice.customer.name}
                  </p>

                  <p>
                    <span className="font-medium">
                      WhatsApp:
                    </span>{" "}
                    {invoice.customer.whatsappNo}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================= */}
            {/* ITEMS */}
            {/* ========================================= */}

            <div>
              <h2 className="text-lg font-semibold mb-4">
                Invoice Items
              </h2>

              <div className="space-y-4">

                {invoice.items.map((item) => (

                  <div
                    key={item.id}
                    className="border rounded-xl p-4 bg-white"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-lg font-semibold">
                          {item.productName}
                        </div>

                        <div className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity} {item.unit}
                        </div>
                      </div>

                      <div className="text-right">
                        <div>
                          ₹ {item.unitPrice}
                        </div>

                        <div className="font-bold text-lg mt-1">
                          ₹ {item.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================= */}
            {/* SUMMARY */}
            {/* ========================================= */}

            <div className="max-w-sm ml-auto border rounded-xl p-4 space-y-3 bg-gray-50">

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

              <div className="flex items-center justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span>₹ {invoice.total}</span>
              </div>

              <div className="flex items-center justify-between text-red-500 font-semibold">
                <span>Due</span>
                <span>₹ {invoice.dueAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

