// "use client";

// import { useMemo, useState } from "react";

// import axiosInstance from "@/lib/axios";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// type InvoiceItem = {
//   productName: string;
//   quantity: number;
//   unit: string;
//   unitPrice: number;
// };

// export default function CreateInvoicePage() {

//   const [loading, setLoading] = useState(false);

//   // =========================================
//   // CUSTOMER
//   // =========================================

//   const [customerName, setCustomerName] =
//     useState("");

//   const [customerWhatsappNo, setCustomerWhatsappNo] =
//     useState("");

//   // =========================================
//   // PAYMENT
//   // =========================================

//   const [discount, setDiscount] = useState(0);

//   const [paidAmount, setPaidAmount] =
//     useState(0);

//   // =========================================
//   // ITEMS
//   // =========================================

//   const [items, setItems] = useState<InvoiceItem[]>([
//     {
//       productName: "",
//       quantity: 1,
//       unit: "",
//       unitPrice: 0,
//     },
//   ]);

//   // =========================================
//   // ACTIVE ITEM CARD
//   // =========================================

//   const [activeIndex, setActiveIndex] =
//     useState(0);

//   // =========================================
//   // UPDATE ITEM
//   // =========================================

//   const updateItem = (
//     index: number,
//     field: keyof InvoiceItem,
//     value: string | number
//   ) => {

//     const updatedItems = [...items];

//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: value,
//     };

//     setItems(updatedItems);
//   };

//   // =========================================
//   // ADD ROW
//   // =========================================

//   const addRow = () => {

//     const updatedItems = [
//       ...items,
//       {
//         productName: "",
//         quantity: 1,
//         unit: "",
//         unitPrice: 0,
//       },
//     ];

//     setItems(updatedItems);

//     // ✅ only newly added item stays open
//     setActiveIndex(updatedItems.length - 1);
//   };

//   // =========================================
//   // REMOVE ROW
//   // =========================================

//   const removeRow = (index: number) => {

//     if (items.length === 1) return;

//     const filtered = items.filter(
//       (_, i) => i !== index
//     );

//     setItems(filtered);

//     if (activeIndex >= filtered.length) {
//       setActiveIndex(filtered.length - 1);
//     }
//   };

//   // =========================================
//   // SUBTOTAL
//   // =========================================

//   const subtotal = useMemo(() => {
//     return items.reduce(
//       (sum, item) =>
//         sum + item.quantity * item.unitPrice,
//       0
//     );
//   }, [items]);

//   // =========================================
//   // TOTAL
//   // =========================================

//   const total = subtotal - discount;

//   // =========================================
//   // DUE
//   // =========================================

//   const dueAmount = total - paidAmount;

//   // =========================================
//   // SUBMIT
//   // =========================================

//   const handleSubmit = async () => {

//     try {

//       setLoading(true);

//       const payload = {
//         customerName,
//         customerWhatsappNo,

//         discount,
//         paidAmount,

//         items,
//       };

//       const response = await axiosInstance.post(
//         "/invoices",
//         payload
//       );

//       const invoice = response.data.data;

// const invoiceLink =
//   `${window.location.origin}/invoice/${invoice.publicId}`;

// const message = `
// Invoice Ready

// Invoice No: ${invoice.invoiceNo}

// View Invoice:
// ${invoiceLink}
// `;

// window.open(
//   `https://wa.me/91${customerWhatsappNo}?text=${encodeURIComponent(message)}`,
//   "_blank"
// );

// alert("Invoice created successfully");

//       alert(response.data.message);

//       // =========================================
//       // RESET FORM
//       // =========================================

//       setCustomerName("");
//       setCustomerWhatsappNo("");

//       setDiscount(0);
//       setPaidAmount(0);

//       setItems([
//         {
//           productName: "",
//           quantity: 1,
//           unit: "",
//           unitPrice: 0,
//         },
//       ]);

//       setActiveIndex(0);

//     } catch (error: any) {

//       alert(
//         error?.response?.data?.message ||
//           "Failed to create bill"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 pb-10">

//       {/* ========================================= */}
//       {/* PAGE TITLE */}
//       {/* ========================================= */}

//       <div>
//         <h1 className="text-xl font-bold">
//           Create Bill/বিল তৈরী করুন
//         </h1>
//       </div>

//       {/* ========================================= */}
//       {/* CUSTOMER INFO */}
//       {/* ========================================= */}

//       <Card>
//         {/* <CardHeader>
//           <CardTitle>
//             Customer Information
//           </CardTitle>
//         </CardHeader> */}

//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <div>
//             {/* <label className="text-sm font-medium">
//               Customer Name
//             </label> */}

//             <Input
//               placeholder="customer name/ক্রেতার নাম "
//               value={customerName}
//               onChange={(e) =>
//                 setCustomerName(e.target.value)
//               }
//             />
//           </div>

//           <div>
//             {/* <label className="text-sm font-medium">
//               WhatsApp Number
//             </label> */}

//             <Input
//               placeholder="whatsapp number/হোয়াটস্যাপ নম্বর"
//               value={customerWhatsappNo}
//               onChange={(e) =>
//                 setCustomerWhatsappNo(e.target.value)
//               }
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* ========================================= */}
//       {/* ITEMS */}
//       {/* ========================================= */}

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>
//             Bill Items/বিল বিবরণ
//           </CardTitle>

//           <Button onClick={addRow}>
//             Add Item/পণ্য যোগ করুন
//           </Button>
//         </CardHeader>

//         <CardContent className="space-y-4">

//           {items.map((item, index) => {

//             const rowTotal =
//               item.quantity * item.unitPrice;

//             const isOpen = activeIndex === index;

//             return (
//               <div
//                 key={index}
//                 className="border rounded-xl bg-white overflow-hidden"
//               >

//                 {/* ========================================= */}
//                 {/* CARD HEADER */}
//                 {/* ========================================= */}

//                 <button
//                   type="button"
//                   onClick={() => setActiveIndex(index)}
//                   className="w-full flex items-center justify-between p-4 bg-gray-50"
//                 >
//                   <div className="text-left">
//                     <div className="font-semibold text-base">
//                       {item.productName || `Item ${index + 1}`}
//                     </div>

//                     <div className="text-sm text-gray-500">
//                       Qty: {item.quantity} | Total: {rowTotal}
//                     </div>
//                   </div>

//                   <div className="text-sm font-medium">
//                     {isOpen ? "Open" : "Closed"}
//                   </div>
//                 </button>

//                 {/* ========================================= */}
//                 {/* OPEN CARD CONTENT */}
//                 {/* ========================================= */}

//                 {isOpen && (
//                   <div className="p-4 space-y-4">

//                     <div>
//                       <label className="text-sm font-medium">
//                         Product Name/পণ্য
//                       </label>

//                       <Input
//                         placeholder="Product"
//                         value={item.productName}
//                         onChange={(e) =>
//                           updateItem(
//                             index,
//                             "productName",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">

//                       <div>
//                         <label className="text-sm font-medium">
//                           Quantity/পরিমাণ
//                         </label>

//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) =>
//                             updateItem(
//                               index,
//                               "quantity",
//                               Number(e.target.value)
//                             )
//                           }
//                         />
//                       </div>

//                       <div>
//                         <label className="text-sm font-medium">
//                           Unit/একক
//                         </label>

//                         <Input
//                           placeholder="kg/gm/litre/"
//                           value={item.unit}
//                           onChange={(e) =>
//                             updateItem(
//                               index,
//                               "unit",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">
//                         Unit Price/একক মূল্য
//                       </label>

//                       <Input
//                         type="number"
//                         value={item.unitPrice}
//                         onChange={(e) =>
//                           updateItem(
//                             index,
//                             "unitPrice",
//                             Number(e.target.value)
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="text-lg font-semibold">
//                         Total: {rowTotal}
//                       </div>

//                       <Button
//                         variant="destructive"
//                         onClick={() => removeRow(index)}
//                       >
//                         Remove/সরান
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* ========================================= */}
//       {/* SUMMARY */}
//       {/* ========================================= */}

//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Bill Summary/বিল সারাংশ
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4 max-w-md">

//           <div>
//             <label className="text-sm font-medium">
//               Discount/ছাড়
//             </label>

//             <Input
//               type="number"
//               value={discount}
//               onChange={(e) =>
//                 setDiscount(Number(e.target.value))
//               }
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">
//               Paid Amount/গৃহীত মূল্য
//             </label>

//             <Input
//               type="number"
//               value={paidAmount}
//               onChange={(e) =>
//                 setPaidAmount(Number(e.target.value))
//               }
//             />
//           </div>

//           <div className="space-y-2 text-lg font-semibold">
//             <div>
//               Subtotal: {subtotal}
//             </div>

//             <div>
//               Total: {total}
//             </div>

//             <div>
//               Due/বাকি: {dueAmount}
//             </div>
//           </div>

//           <Button
//             className="w-full"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading
//               ? "Creating Invoice../রশিদ তৈরি হচ্ছে.."
//               : "Create Invoice/রশিদ তৈরি করুন"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// ======================================================
"use client";

import { useMemo, useState } from "react";

import axiosInstance from "@/lib/axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

// =========================================
// TYPES
// =========================================

type InvoiceItem = {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type Product = {
  id: string;

  name: string;

  stockQty?: number;

  defaultUnit?: string;

  defaultPrice?: number;
};

export default function CreateInvoicePage() {
  const [loading, setLoading] = useState(false);

  // =========================================
  // CUSTOMER
  // =========================================

  const [customerName, setCustomerName] = useState("");

  const [customerWhatsappNo, setCustomerWhatsappNo] = useState("");

  // =========================================
  // PAYMENT
  // =========================================

  const [discount, setDiscount] = useState(0);

  const [paidAmount, setPaidAmount] = useState(0);

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
  // ACTIVE CARD
  // =========================================

  const [activeIndex, setActiveIndex] = useState(0);

  // =========================================
  // INVENTORY SEARCH
  // =========================================

  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Product[]>([]);

  // =========================================
  // UPDATE ITEM
  // =========================================

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
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

    setActiveIndex(updatedItems.length - 1);
  };

  // =========================================
  // REMOVE ROW
  // =========================================

  const removeRow = (index: number) => {
    if (items.length === 1) return;

    const filtered = items.filter((_, i) => i !== index);

    setItems(filtered);

    if (activeIndex >= filtered.length) {
      setActiveIndex(filtered.length - 1);
    }
  };

  // =========================================
  // SEARCH PRODUCTS
  // =========================================

  const searchProducts = async (value: string) => {
    setSearch(value);

    try {
      const response = await axiosInstance.get(
        `/products/search?search=${value}`,
      );

      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================================
  // ADD INVENTORY ITEM
  // =========================================

  const addInventoryItem = (product: Product) => {
    const updatedItems = [
      ...items,
      {
        productName: product.name,

        quantity: 1,

        unit: product.defaultUnit || "",

        unitPrice: product.defaultPrice || 0,
      },
    ];

    setItems(updatedItems);

    setActiveIndex(updatedItems.length - 1);

    setSearch("");

    setProducts([]);
  };

  // =========================================
  // SUBTOTAL
  // =========================================

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
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

      const response = await axiosInstance.post("/invoices", payload);

      const invoice = response.data.data;

      const invoiceLink = `${window.location.origin}/invoice/${invoice.publicId}`;
      const message = `
প্রিয় ${invoice.customer?.name || "customer"},
আপনার বিল ডাউনলোড করুন
Dear ${invoice.customer?.name || "customer"},
Download your bill.
Bill No: ${invoice.invoiceNo}
${invoiceLink}
`;

      if (customerWhatsappNo) {
        window.open(
          `https://wa.me/91${customerWhatsappNo}?text=${encodeURIComponent(message)}`,
          "_blank",
        );
      }

      alert("Invoice created successfully");

      // RESET

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
      alert(error?.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ========================================= */}
      {/* TITLE */}
      {/* ========================================= */}

      <div>
        <h1 className="text-xl font-bold">Create Bill/বিল তৈরী করুন</h1>
      </div>

      {/* ========================================= */}
      {/* CUSTOMER */}
      {/* ========================================= */}

      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            placeholder="customer name/ক্রেতার নাম"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Input
            placeholder="whatsapp number/হোয়াটস্যাপ নম্বর"
            value={customerWhatsappNo}
            onChange={(e) => setCustomerWhatsappNo(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* INVENTORY SEARCH */}
      {/* ========================================= */}

      <Card>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => searchProducts(e.target.value)}
          />

          {products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addInventoryItem(product)}
                  className="
                      border
                      rounded-xl
                      p-2
                      text-left
                      bg-white
                      hover:border-red-400
                      hover:shadow-md
                      transition-all
                    "
                >
                  <div className="font-semibold text-base">{product.name}</div>

                  <div className="text-sm text-gray-500 mt-1">
                    Stock: {product.stockQty ?? "-"}
                  </div>

                  <div className="text-sm text-gray-500">
                    ₹{product.defaultPrice ?? 0}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* ITEMS */}
      {/* ========================================= */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bill Items/বিল বিবরণ</CardTitle>

          <Button onClick={addRow}>Add Item/পণ্য যোগ করুন</Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {items.map((item, index) => {
            const rowTotal = item.quantity * item.unitPrice;

            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border rounded-xl bg-white overflow-hidden"
              >
                {/* HEADER */}

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

                {/* BODY */}

                {isOpen && (
                  <div className="p-4 space-y-4">
                    <Input
                      placeholder="Product"
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(index, "productName", e.target.value)
                      }
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />

                      <Input
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(index, "unit", e.target.value)
                        }
                      />
                    </div>

                    <Input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", Number(e.target.value))
                      }
                    />

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
          <CardTitle>Bill Summary/বিল সারাংশ</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium">Discount/ছাড়</label>
            <Input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Paid Amount/গৃহীত মূল্য
            </label>
            <Input
              type="number"
              placeholder="Paid Amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2 text-lg font-semibold">
            <div>Subtotal: {subtotal}</div>

            <div>Total: {total}</div>

            <div>Due: {dueAmount}</div>
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Creating Invoice../রশিদ তৈরি হচ্ছে.."
              : "Create Invoice/রশিদ তৈরি করুন"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
