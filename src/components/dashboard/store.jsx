"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getStores,
  addStore,
  deleteStore,
  updateStore,
  searchStores,
} from "@/redux/store/storeSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const storeSchema = Yup.object().shape({
  storeName: Yup.string().required("Store Name is required"),
  storeDescription: Yup.string().required("Store Description is required"),
  storeImage: Yup.string().url("Enter a valid image URL").required("Store image is required"),
  homePageTitle: Yup.string().required("Home Page Title is required"),
  showOnHomepage: Yup.boolean(),
  popularStore: Yup.boolean(),
  storeType: Yup.string().required("Store Type is required"),
  discountPercentage: Yup.number()
    .typeError("Must be a number")
    .required("Discount Percentage is required"),
  storeHtmlContent: Yup.string().required("HTML Content is required"),
});

const StoresPage = () => {
  const dispatch = useDispatch();
  const { stores, searchResults, loading } = useSelector((state) => state.store);
  const [editStore, setEditStore] = useState(null);

  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchStores(debouncedSearchTerm));
    } else {
      dispatch(getStores());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteStore(id)).unwrap();
      toast.success("Store deleted!");
      if (debouncedSearchTerm.length > 0) dispatch(searchStores(debouncedSearchTerm));
      else dispatch(getStores());
    } catch (error) {
      toast.error(`Failed to delete store: ${error.message || "Unknown error"}`);
    }
  };

  const handleEdit = (store) => setEditStore(store);

  const handleUpdate = async (values, resetForm) => {
    try {
      await dispatch(updateStore({ id: editStore._id, data: values })).unwrap();
      toast.success("Store updated!");
      if (debouncedSearchTerm.length > 0) dispatch(searchStores(debouncedSearchTerm));
      else dispatch(getStores());
      resetForm();
      setEditStore(null);
    } catch (error) {
      toast.error(`Failed to update store: ${error.message || "Unknown error"}`);
    }
  };

  const columnDefs = [
    { headerName: "Name", field: "storeName", sortable: true, filter: true, flex: 1 },
    { headerName: "Description", field: "storeDescription", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Image",
      field: "storeImage",
      cellRenderer: (params) => <img src={params.value} className="h-12 w-12 object-fill rounded-md" />,
      width: 100,
    },
    { headerName: "Homepage Title", field: "homePageTitle", sortable: true, filter: true, flex: 1 },
    { headerName: "Type", field: "storeType", sortable: true, filter: true, width: 120 },
    { headerName: "Discount", field: "discountPercentage", sortable: true, filter: true, width: 120, cellRenderer: (params) => `${params.value}%` },
    { headerName: "Show on Homepage", field: "showOnHomepage", cellRenderer: (params) => (params.value ? "✅" : "❌"), width: 150 },
    { headerName: "Popular", field: "popularStore", cellRenderer: (params) => (params.value ? "✅" : "❌"), width: 100 },
    { headerName: "HTML Content", field: "storeHtmlContent", flex: 1, cellRenderer: (params) => params.value ? `${params.value.substring(0, 50)}...` : "" },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <button onClick={() => handleDelete(params.value)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs cursor-pointer">Delete</button>
          <button onClick={() => handleEdit(params.data)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs cursor-pointer">Edit</button>
        </div>
      ),
      width: 150,
    },
  ];

  // const defaultColDef = useCallback(() => ({ flex: 1, minWidth: 100, resizable: true }), []);
  const defaultColDef = { flex: 1, minWidth: 100, resizable: true };
  const onGridReady = useCallback((params) => params.api.sizeColumnsToFit(), []);

  // const dataToDisplay = searchText.length > 0 ? searchResults : stores;
  const dataToDisplay = Array.isArray(searchText.length > 0 ? searchResults : stores)
  ? (searchText.length > 0 ? searchResults : stores)
  : [];
console.log("stores",stores)
console.log("dataToDisplay",dataToDisplay)
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Manage Stores</h1>

      <input
        type="text"
        placeholder="Search stores..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div className="text-center py-8">Loading Stores...</div>
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
          {searchText.length > 0 ? "No stores found for your search." : "No stores available."}
        </div>
      )}

      {/* ✅ Formik Form */}
      <Formik
        enableReinitialize
        initialValues={
          editStore || {
            storeName: "",
            storeDescription: "",
            storeImage: "",
            homePageTitle: "",
            showOnHomepage: false,
            storeType: "",
            discountPercentage: "",
            popularStore: false,
            storeHtmlContent: "",
            metaTitle: "",
metaDescription: "",
metaKeywords: "",
          }
        }
        validationSchema={storeSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (editStore) await handleUpdate(values, resetForm);
            else {
              await dispatch(addStore(values)).unwrap();
              toast.success("Store added!");
              resetForm();
              if (debouncedSearchTerm.length > 0) dispatch(searchStores(debouncedSearchTerm));
              else dispatch(getStores());
            }
          } catch (error) {
            toast.error(`Submission failed: ${error.message || "Unknown error"}`);
          }
        }}
      >
        {() => (
          <Form className="bg-white p-6 shadow-md rounded-lg space-y-6 mt-10">
            {/* All form fields same as your React code */}
            <div>
              <label className="block mb-1 font-medium">Store Name</label>
              <Field name="storeName" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="storeName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Store Description</label>
              <Field as="textarea" name="storeDescription" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="storeDescription" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Store Image URL</label>
              <Field name="storeImage" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="storeImage" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Homepage Title</label>
              <Field name="homePageTitle" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="homePageTitle" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Store Type</label>
              <Field as="select" name="storeType" className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Store Type</option>
                <option value="Top">Top</option>
                <option value="Brands">Brands</option>
                <option value="Popular">Popular</option>
                <option value="Popular Store">Popular Store</option>
              </Field>
              <ErrorMessage name="storeType" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Discount Percentage</label>
              <Field type="number" name="discountPercentage" className="w-full px-3 py-2 border rounded-md" />
              <ErrorMessage name="discountPercentage" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
  <label className="block mb-1 font-medium">Meta Title</label>
  <Field name="metaTitle" className="w-full px-3 py-2 border rounded-md" />
</div>

<div>
  <label className="block mb-1 font-medium">Meta Description</label>
  <Field as="textarea" name="metaDescription" className="w-full px-3 py-2 border rounded-md" />
</div>

<div>
  <label className="block mb-1 font-medium">Meta Keywords</label>
  <Field name="metaKeywords" className="w-full px-3 py-2 border rounded-md" />
</div>
            <div className="flex items-center space-x-2">
              <Field type="checkbox" name="popularStore" />
              <label className="font-medium">Popular Store</label>
            </div>

            <div>
              <label className="block mb-1 font-medium">Store HTML Content</label>
              <Field as="textarea" name="storeHtmlContent" className="w-full px-3 py-2 border rounded-md" rows={5} />
              <ErrorMessage name="storeHtmlContent" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex items-center space-x-2">
              <Field type="checkbox" name="showOnHomepage" />
              <label className="font-medium">Show on Homepage</label>
            </div>

            <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer">
              {loading ? "Submitting..." : editStore ? "Update Store" : "Add Store"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StoresPage;
