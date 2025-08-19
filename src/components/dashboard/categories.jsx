"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
} from "@/redux/category/categorySlice"; // adjust path
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const categorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  image: Yup.string().url("Enter a valid image URL").required("Image URL is required"),
  showOnHomepage: Yup.boolean(),
  popularStore: Yup.boolean(),
});

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, searchResults, loading, error } = useSelector((state) => state.category);
  const [editCategory, setEditCategory] = useState(null);

  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch categories or search results
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
      if (debouncedSearchTerm.length > 0) {
        dispatch(searchCategories(debouncedSearchTerm));
      } else {
        dispatch(getCategories());
      }
      resetForm();
      setEditCategory(null);
    } catch (err) {
      toast.error(`Update failed: ${err.message || "Unknown error"}`);
    }
  };

  const columnDefs = [
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Image",
      field: "image",
      cellRenderer: (params) => (
        <img src={params.value} alt="category" className="h-12 w-12 object-fill rounded-md" />
      ),
      width: 100,
      resizable: false,
    },
    {
      headerName: "Popular Store",
      field: "popularStore",
      cellRenderer: (params) => (params.value ? "✅" : "❌"),
      width: 150,
      filter: true,
    },
    {
      headerName: "Show on Homepage",
      field: "showOnHomepage",
      cellRenderer: (params) => (params.value ? "✅" : "❌"),
      width: 150,
      filter: true,
    },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <div className="flex space-x-2 items-center h-full">
          <button
            onClick={() => handleDelete(params.value)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => handleEdit(params.data)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs cursor-pointer"
          >
            Edit
          </button>
        </div>
      ),
      width: 150,
      resizable: false,
    },
  ];

  const defaultColDef = useCallback(() => ({ flex: 1, minWidth: 100, resizable: true }), []);

  const onGridReady = useCallback((params) => params.api.sizeColumnsToFit(), []);

  const dataToDisplay = searchText.length > 0 ? searchResults : categories;

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <input
        type="text"
        placeholder="Search categories..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="text-center py-8">Loading Categories...</div>
      ) : dataToDisplay?.length > 0 ? (
        <div className="ag-theme-alpine flex-grow" style={{ width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={dataToDisplay}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            pagination
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchText.length > 0 ? "No categories found for your search." : "No categories available."}
        </div>
      )}

      <Formik
        enableReinitialize
        initialValues={
          editCategory || { name: "", image: "", showOnHomepage: false, popularStore: false }
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
