"use client";

import { useEffect, useMemo, useState } from "react";

import axiosInstance from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

} from "@/components/ui/table";

type Invoice = {

  id: string;

  publicId: string;

  invoiceNo: string;

  total: number;

  dueAmount: number;

  paymentStatus: string;

  createdAt: string;

  customer: {
    name: string;
    whatsappNo: string;
  };
};

export default function InvoiceListPage() {

  // =========================================
  // TODAY DEFAULT DATE
  // =========================================

  const today =
    new Date().toISOString().split("T")[0];

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] =
    useState(false);

  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(today);

  // =========================================
  // FETCH INVOICES
  // =========================================

  const fetchInvoices = async () => {

    try {

      setLoading(true);

      const response =
        await axiosInstance.get(
          `/invoices?startDate=${startDate}&endDate=${endDate}`
        );

      setInvoices(response.data.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // =========================================
  // FETCH ON LOAD / DATE CHANGE
  // =========================================

  useEffect(() => {

    fetchInvoices();

  }, [startDate, endDate]);

  // =========================================
  // TOTALS
  // =========================================

  const totalSales = useMemo(() => {

    return invoices.reduce(
      (sum, invoice) => sum + invoice.total,
      0
    );

  }, [invoices]);

  return (
    <div className="space-y-6 pb-20">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div>

        <h1 className="text-3xl font-bold">
          Bills
        </h1>

        <p className="text-gray-500 mt-1">
          Date wise bill list
        </p>

      </div>

      {/* ========================================= */}
      {/* FILTER */}
      {/* ========================================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Filter By Date
          </CardTitle>

        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* START */}

          <div>

            <label className="text-sm font-medium">
              Start Date
            </label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />

          </div>

          {/* END */}

          <div>

            <label className="text-sm font-medium">
              End Date
            </label>

            <Input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            />

          </div>

          {/* BUTTON */}

          <div className="flex items-end">

            <Button
              className="w-full"
              onClick={fetchInvoices}
            >
              Refresh
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* SUMMARY */}
      {/* ========================================= */}

      <Card>

        <CardContent className="pt-6">

          <div className="flex items-center justify-between">

            <div>

              <div className="text-sm text-gray-500">
                Total Bills
              </div>

              <div className="text-2xl font-bold mt-1">
                {invoices.length}
              </div>

            </div>

            <div className="text-right">

              <div className="text-sm text-gray-500">
                Total Sales
              </div>

              <div className="text-2xl font-bold mt-1">
                ₹ {totalSales}
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Invoice List
          </CardTitle>

        </CardHeader>

        <CardContent>

          {loading ? (

            <div className="text-center py-10 font-semibold">
              Loading Bills...
            </div>

          ) : invoices.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No bills found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Bill No
                    </TableHead>

                    <TableHead>
                      Customer
                    </TableHead>

                    <TableHead>
                      Total
                    </TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {invoices.map((invoice) => {

                    const isOpen =
                      expandedId === invoice.id;

                    return (
                      <>
                        {/* ========================================= */}
                        {/* MAIN ROW */}
                        {/* ========================================= */}

                        <TableRow
                          key={invoice.id}
                          className="cursor-pointer"
                          onClick={() =>
                            setExpandedId(
                              isOpen
                                ? null
                                : invoice.id
                            )
                          }
                        >

                          <TableCell className="font-semibold">
                            {invoice.invoiceNo}
                          </TableCell>

                          <TableCell>
                            {invoice.customer.name}
                          </TableCell>

                          <TableCell className="font-bold">
                            ₹ {invoice.total}
                          </TableCell>

                        </TableRow>

                        {/* ========================================= */}
                        {/* DETAILS */}
                        {/* ========================================= */}

                        {isOpen && (

                          <TableRow>

                            <TableCell
                              colSpan={3}
                              className="bg-gray-50"
                            >

                              <div className="space-y-3 p-3">

                                <div>

                                  <span className="font-semibold">
                                    WhatsApp:
                                  </span>{" "}

                                  {
                                    invoice.customer
                                      .whatsappNo
                                  }

                                </div>

                                <div>

                                  <span className="font-semibold">
                                    Due:
                                  </span>{" "}

                                  ₹ {invoice.dueAmount}

                                </div>

                                <div>

                                  <span className="font-semibold">
                                    Status:
                                  </span>{" "}

                                  {invoice.paymentStatus}

                                </div>

                                <div>

                                  <span className="font-semibold">
                                    Created:
                                  </span>{" "}

                                  {new Date(
                                    invoice.createdAt
                                  ).toLocaleString(
                                    "en-IN",
                                    {
                                      dateStyle:
                                        "medium",

                                      timeStyle:
                                        "short",

                                      hour12: true,
                                    }
                                  )}

                                </div>

                                <div className="pt-2">

                                  <a
                                    href={`/invoice/${invoice.publicId}`}
                                    target="_blank"
                                  >

                                    <Button>
                                      Open Bill
                                    </Button>

                                  </a>

                                </div>

                              </div>

                            </TableCell>

                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}