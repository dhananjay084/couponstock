"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
} from "@/redux/category/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  image: Yup.string().url("Enter a valid image URL").required("Image URL is required"),
  showOnHomepage: Yup.boolean(),
  popularStore: Yup.boolean(),
});

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, searchResults, loading } = useSelector((state) => state.category);
  const [editCategory, setEditCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch or search categories
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchCategories(debouncedSearchTerm));
    } else {
      dispatch(getCategories());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted!");
      if (debouncedSearchTerm.length > 0) {
        dispatch(searchCategories(debouncedSearchTerm));
      } else {
        dispatch(getCategories());
      }
    } catch (err) {
      toast.error(`Failed to delete category: ${err.message || "Unknown error"}`);
    }
  };

  const handleEdit = (category) => setEditCategory(category);

  const handleUpdate = async (values, resetForm) => {
    try {
      await dispatch(updateCategory({ id: editCategory._id, data: values })).unwrap();
      toast.success("Category updated!");
      resetForm();
      setEditCategory(null);
      if (debouncedSearchTerm.length > 0) {
        dispatch(searchCategories(debouncedSearchTerm));
      } else {
        dispatch(getCategories());
      }
    } catch (err) {
      toast.error(`Update failed: ${err.message || "Unknown error"}`);
    }
  };

  const dataToDisplay = searchText.length > 0 ? searchResults : categories;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ✅ Normal HTML Table */}
      {loading ? (
        <div className="text-center py-8">Loading Categories...</div>
      ) : dataToDisplay?.length > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-10">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Image</th>
                <th className="py-3 px-4 border-b">Popular Store</th>
                <th className="py-3 px-4 border-b">Show on Homepage</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{category.name}</td>
                  <td className="py-3 px-4 border-b">
                    <img
                      src={category.image}
                      alt="category"
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {category.popularStore ? "✅" : "❌"}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {category.showOnHomepage ? "✅" : "❌"}
                  </td>
                  <td className="py-3 px-4 border-b flex space-x-2">
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchText.length > 0
            ? "No categories found for your search."
            : "No categories available."}
        </div>
      )}

      {/* ✅ Formik Form for Add / Edit */}
      <Formik
        enableReinitialize
        initialValues={
          editCategory || { name: "", image: "", showOnHomepage: false, popularStore: false, metaTitle: "",
            metaDescription: "",
            metaKeywords: "" }
        }
        validationSchema={categorySchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (editCategory) {
              await handleUpdate(values, resetForm);
            } else {
              await dispatch(addCategory(values)).unwrap();
              toast.success("Category added!");
              resetForm();
              if (debouncedSearchTerm.length > 0) {
                dispatch(searchCategories(debouncedSearchTerm));
              } else {
                dispatch(getCategories());
              }
            }
          } catch (err) {
            toast.error(`Failed to submit category: ${err.message || "Unknown error"}`);
          }
        }}
      >
        {() => (
          <Form className="bg-white p-6 shadow-md rounded-lg space-y-6 mt-10">
            <div>
              <label className="block mb-1 font-medium">Category Name</label>
              <Field name="name" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Image URL</label>
              <Field name="image" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
  <label className="block mb-1 font-medium">Meta Title</label>
  <Field name="metaTitle" className="w-full px-3 py-2 border rounded-md" />
</div>

<div>
  <label className="block mb-1 font-medium">Meta Description</label>
  <Field as="textarea" name="metaDescription" rows={3} className="w-full px-3 py-2 border rounded-md" />
</div>

<div>
  <label className="block mb-1 font-medium">Meta Keywords</label>
  <Field name="metaKeywords" className="w-full px-3 py-2 border rounded-md" />
</div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <Field type="checkbox" name="popularStore" className="mr-2" />
                Popular Store
              </label>

              <label className="flex items-center">
                <Field type="checkbox" name="showOnHomepage" className="mr-2" />
                Show on Homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer"
            >
              {loading ? "Submitting..." : editCategory ? "Update Category" : "Add Category"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
