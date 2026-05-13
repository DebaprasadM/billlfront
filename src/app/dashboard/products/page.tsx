"use client";

import { useEffect, useState } from "react";

import axiosInstance from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

type Product = {
  id: string;

  name: string;

  stockQty?: number;

  defaultUnit?: string;

  defaultPrice?: number;
};

export default function ProductsPage() {

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] =
    useState(false);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [formData, setFormData] =
    useState({
      name: "",

      stockQty: "",

      defaultUnit: "",

      defaultPrice: "",
    });

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {

    try {

      const response =
        await axiosInstance.get(
          "/products"
        );

      setProducts(
        response.data.data
      );

    } catch (error) {

      console.log(error);
    }
  };

  // =========================================
  // LOAD
  // =========================================

  useEffect(() => {

    fetchProducts();

  }, []);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {

    setEditingId(null);

    setFormData({
      name: "",

      stockQty: "",

      defaultUnit: "",

      defaultPrice: "",
    });
  };

  // =========================================
  // CREATE
  // =========================================

  const handleCreate = async () => {

    try {

      setLoading(true);

      await axiosInstance.post(
        "/products",
        {
          name:
            formData.name,

          stockQty:
            formData.stockQty
              ? Number(
                  formData.stockQty
                )
              : null,

          defaultUnit:
            formData.defaultUnit ||
            null,

          defaultPrice:
            formData.defaultPrice
              ? Number(
                  formData.defaultPrice
                )
              : null,
        }
      );

      resetForm();

      fetchProducts();

    } catch (error: any) {

      alert(
        error?.response?.data
          ?.message ||
          "Failed to create product"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // UPDATE
  // =========================================

  const handleUpdate = async (
    id: string
  ) => {

    try {

      setLoading(true);

      await axiosInstance.patch(
        `/products/${id}`,
        {
          name:
            formData.name,

          stockQty:
            formData.stockQty
              ? Number(
                  formData.stockQty
                )
              : null,

          defaultUnit:
            formData.defaultUnit ||
            null,

          defaultPrice:
            formData.defaultPrice
              ? Number(
                  formData.defaultPrice
                )
              : null,
        }
      );

      resetForm();

      fetchProducts();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Delete this product?"
      );

    if (!confirmDelete) return;

    try {

      await axiosInstance.delete(
        `/products/${id}`
      );

      fetchProducts();

    } catch (error) {

      console.log(error);
    }
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (editingId) {

      handleUpdate(
        editingId
      );

    } else {

      handleCreate();
    }
  };

  return (
    <div className="space-y-2 pb-4">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div>

        <h1 className="text-2xl font-bold">
          Inventory
        </h1>

        {/* <p className="text-gray-500 mt-1">
          Manage products and stock
        </p> */}

      </div>

      {/* ========================================= */}
      {/* FORM */}
      {/* ========================================= */}

      <Card>

        <CardHeader>

          <CardTitle>

            {editingId
              ? "Edit Product"
              : "Add Product"}

          </CardTitle>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* PRODUCT NAME */}

            <div>

              <label className="text-sm font-medium">
                Product Name
              </label>

              <Input
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* GRID */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* STOCK */}

              <div>

                <label className="text-sm font-medium">
                  Stock Qty
                </label>

                <Input
                  type="number"
                  name="stockQty"
                  placeholder="Optional"
                  value={
                    formData.stockQty
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* UNIT */}

              <div>

                <label className="text-sm font-medium">
                  Unit
                </label>

                <Input
                  name="defaultUnit"
                  placeholder="kg / pcs"
                  value={
                    formData.defaultUnit
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* PRICE */}

              <div>

                <label className="text-sm font-medium">
                  Default Price
                </label>

                <Input
                  type="number"
                  name="defaultPrice"
                  placeholder="Optional"
                  value={
                    formData.defaultPrice
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex items-center gap-3">

              <Button
                type="submit"
                disabled={loading}
              >

                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}

              </Button>

              {editingId && (

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>

              )}

            </div>

          </form>

        </CardContent>
      </Card>

      {/* ========================================= */}
      {/* PRODUCT LIST */}
      {/* ========================================= */}

      <Card>

        <CardHeader>

          <CardTitle>
            Product List
          </CardTitle>

        </CardHeader>

        <CardContent>

          {products.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No products found
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left p-3">
                      Name
                    </th>

                    <th className="text-left p-3">
                      Stock
                    </th>

                    {/* <th className="text-left p-3">
                      Unit
                    </th> */}

                    <th className="text-left p-3">
                      Price
                    </th>

                    <th className="text-left p-3">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr
                        key={product.id}
                        className="border-b"
                      >

                        {/* NAME */}

                        <td className="p-3 font-medium">
                          {
                            product.name
                          }
                        </td>

                        {/* STOCK */}

                        <td className="p-3">

                          {product.stockQty ??
                            "-"}{product.defaultUnit ??
                            "-"}

                        </td>

                        {/* UNIT */}

                        {/* <td className="p-3">

                          {product.defaultUnit ??
                            "-"}

                        </td> */}

                        {/* PRICE */}

                        <td className="p-3">

                          {product.defaultPrice
                            ? `₹ ${product.defaultPrice}`
                            : "-"}

                        </td>

                        {/* ACTIONS */}

                        <td className="p-3">

                          <div className="flex items-center gap-2">

                            {/* EDIT */}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {

                                setEditingId(
                                  product.id
                                );

                                setFormData({
                                  name:
                                    product.name,

                                  stockQty:
                                    product.stockQty?.toString() ||
                                    "",

                                  defaultUnit:
                                    product.defaultUnit ||
                                    "",

                                  defaultPrice:
                                    product.defaultPrice?.toString() ||
                                    "",
                                });
                              }}
                            >
                              ✏️
                            </Button>

                            {/* DELETE */}

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >
                              🗑️
                            </Button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}