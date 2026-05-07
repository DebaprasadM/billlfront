"use client";

import { useMemo, useState } from "react";

import axiosInstance from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type InvoiceItem = {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

export default function CreateInvoicePage() {

  const [loading, setLoading] = useState(false);

  // =========================================
  // CUSTOMER
  // =========================================

  const [customerName, setCustomerName] =
    useState("");

  const [customerWhatsappNo, setCustomerWhatsappNo] =
    useState("");

  // =========================================
  // PAYMENT
  // =========================================

  const [discount, setDiscount] = useState(0);

  const [paidAmount, setPaidAmount] =
    useState(0);

  // =========================================
  // ITEMS
  // =========================================

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      productName: "",
      quantity: 1,
      unit: "",
      unitPrice: 0,
    },
  ]);

  // =========================================
  // ACTIVE ITEM CARD
  // =========================================

  const [activeIndex, setActiveIndex] =
    useState(0);

  // =========================================
  // UPDATE ITEM
  // =========================================

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {

    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  // =========================================
  // ADD ROW
  // =========================================

  const addRow = () => {

    const updatedItems = [
      ...items,
      {
        productName: "",
        quantity: 1,
        unit: "",
        unitPrice: 0,
      },
    ];

    setItems(updatedItems);

    // ✅ only newly added item stays open
    setActiveIndex(updatedItems.length - 1);
  };

  // =========================================
  // REMOVE ROW
  // =========================================

  const removeRow = (index: number) => {

    if (items.length === 1) return;

    const filtered = items.filter(
      (_, i) => i !== index
    );

    setItems(filtered);

    if (activeIndex >= filtered.length) {
      setActiveIndex(filtered.length - 1);
    }
  };

  // =========================================
  // SUBTOTAL
  // =========================================

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.quantity * item.unitPrice,
      0
    );
  }, [items]);

  // =========================================
  // TOTAL
  // =========================================

  const total = subtotal - discount;

  // =========================================
  // DUE
  // =========================================

  const dueAmount = total - paidAmount;

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async () => {

    try {

      setLoading(true);

      const payload = {
        customerName,
        customerWhatsappNo,

        discount,
        paidAmount,

        items,
      };

      const response = await axiosInstance.post(
        "/invoices",
        payload
      );

      alert(response.data.message);

      // =========================================
      // RESET FORM
      // =========================================

      setCustomerName("");
      setCustomerWhatsappNo("");

      setDiscount(0);
      setPaidAmount(0);

      setItems([
        {
          productName: "",
          quantity: 1,
          unit: "",
          unitPrice: 0,
        },
      ]);

      setActiveIndex(0);

    } catch (error: any) {

      alert(
        error?.response?.data?.message ||
          "Failed to create invoice"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">

      {/* ========================================= */}
      {/* PAGE TITLE */}
      {/* ========================================= */}

      <div>
        <h1 className="text-3xl font-bold">
          Create Invoice
        </h1>
      </div>

      {/* ========================================= */}
      {/* CUSTOMER INFO */}
      {/* ========================================= */}

      <Card>
        <CardHeader>
          <CardTitle>
            Customer Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">
              Customer Name
            </label>

            <Input
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              WhatsApp Number
            </label>

            <Input
              placeholder="Enter whatsapp number"
              value={customerWhatsappNo}
              onChange={(e) =>
                setCustomerWhatsappNo(e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* ITEMS */}
      {/* ========================================= */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Invoice Items
          </CardTitle>

          <Button onClick={addRow}>
            Add Row
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">

          {items.map((item, index) => {

            const rowTotal =
              item.quantity * item.unitPrice;

            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border rounded-xl bg-white overflow-hidden"
              >

                {/* ========================================= */}
                {/* CARD HEADER */}
                {/* ========================================= */}

                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50"
                >
                  <div className="text-left">
                    <div className="font-semibold text-base">
                      {item.productName || `Item ${index + 1}`}
                    </div>

                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity} | Total: {rowTotal}
                    </div>
                  </div>

                  <div className="text-sm font-medium">
                    {isOpen ? "Open" : "Closed"}
                  </div>
                </button>

                {/* ========================================= */}
                {/* OPEN CARD CONTENT */}
                {/* ========================================= */}

                {isOpen && (
                  <div className="p-4 space-y-4">

                    <div>
                      <label className="text-sm font-medium">
                        Product Name
                      </label>

                      <Input
                        placeholder="Product"
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "productName",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <label className="text-sm font-medium">
                          Quantity
                        </label>

                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Unit
                        </label>

                        <Input
                          placeholder="kg"
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "unit",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Unit Price
                      </label>

                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        Total: {rowTotal}
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => removeRow(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* SUMMARY */}
      {/* ========================================= */}

      <Card>
        <CardHeader>
          <CardTitle>
            Invoice Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 max-w-md">

          <div>
            <label className="text-sm font-medium">
              Discount
            </label>

            <Input
              type="number"
              value={discount}
              onChange={(e) =>
                setDiscount(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Paid Amount
            </label>

            <Input
              type="number"
              value={paidAmount}
              onChange={(e) =>
                setPaidAmount(Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-2 text-lg font-semibold">
            <div>
              Subtotal: {subtotal}
            </div>

            <div>
              Total: {total}
            </div>

            <div>
              Due: {dueAmount}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Creating Invoice..."
              : "Create Invoice"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}