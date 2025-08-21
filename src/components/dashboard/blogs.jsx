"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  fetchBlogs,
  updateBlog,
  deleteBlog,
} from "@/redux/blog/blogSlice"; // adjust path for App Router
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AddBlogPage() {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);
  const [editBlogId, setEditBlogId] = useState(null);
  const gridRef = useRef();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      imageLink: "",
      heading: "",
      blogDetails: "",
      tags: "",
      showOnHomepage: false,
      featuredPost: false,
    },
    validationSchema: Yup.object({
      imageLink: Yup.string().url("Must be a valid URL").required("Required"),
      heading: Yup.string().required("Required"),
      blogDetails: Yup.string().required("Required"),
      tags: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        image: values.imageLink,
        heading: values.heading,
        details: values.blogDetails,
        tags: values.tags.split(",").map((tag) => tag.trim()),
        showOnHomepage: values.showOnHomepage,
        featuredPost: values.featuredPost,
      };

      try {
        if (editBlogId) {
          await dispatch(updateBlog({ id: editBlogId, data: payload })).unwrap();
          // toast.success("Blog updated!");
        } else {
          await dispatch(createBlog(payload)).unwrap();
          // toast.success("Blog added!");
        }
        dispatch(fetchBlogs());
        resetForm();
        setEditBlogId(null);
      } catch (error) {
        toast.error(`Operation failed: ${error.message || "Unknown error"}`);
      }
    },
  });

  const handleEdit = (blog) => {
    formik.setValues({
      imageLink: blog.image || "",
      heading: blog.heading || "",
      blogDetails: blog.details || "",
      tags: (blog.tags && blog.tags.join(", ")) || "",
      showOnHomepage: blog.showOnHomepage ?? false,
      featuredPost: blog.featuredPost ?? false,
    });
    setEditBlogId(blog._id);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      // toast.success("Blog deleted!");
      dispatch(fetchBlogs());
    } catch (error) {
      toast.error(`Failed to delete blog: ${error.message || "Unknown error"}`);
    }
  };

  const columnDefs = [
    {
      headerName: "Image",
      field: "image",
      cellRenderer: (params) => (
        <img
          src={params.value}
          alt="blog"
          className="h-12 w-12 object-fill rounded-md"
        />
      ),
      width: 100,
      resizable: false,
    },
    { headerName: "Heading", field: "heading", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Tags",
      field: "tags",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (params.value ? params.value.join(", ") : ""),
      flex: 1,
    },
    {
      headerName: "Homepage",
      field: "showOnHomepage",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (params.value ? "✅" : "❌"),
      width: 120,
    },
    {
      headerName: "Featured",
      field: "featuredPost",
      sortable: true,
      filter: true,
      cellRenderer: (params) => (params.value ? "✅" : "❌"),
      width: 120,
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

  const defaultColDef = useCallback(
    () => ({ flex: 1, minWidth: 100, resizable: true }),
    []
  );

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Manage Blogs</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 bg-white shadow-md p-6 rounded mb-10"
      >
        <h2 className="text-xl font-bold">{editBlogId ? "Edit Blog" : "Add Blog"}</h2>

        <div>
          <label className="block">Image Link</label>
          <input
            name="imageLink"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.imageLink}
            className="border p-2 w-full rounded"
          />
          {formik.touched.imageLink && formik.errors.imageLink && (
            <p className="text-red-500 text-sm">{formik.errors.imageLink}</p>
          )}
        </div>

        <div>
          <label className="block">Heading</label>
          <input
            name="heading"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.heading}
            className="border p-2 w-full rounded"
          />
          {formik.touched.heading && formik.errors.heading && (
            <p className="text-red-500 text-sm">{formik.errors.heading}</p>
          )}
        </div>

        <div>
          <label className="block">Blog Details</label>
          <textarea
            name="blogDetails"
            onChange={formik.handleChange}
            value={formik.values.blogDetails}
            className="border p-2 w-full rounded"
          />
          {formik.touched.blogDetails && formik.errors.blogDetails && (
            <p className="text-red-500 text-sm">{formik.errors.blogDetails}</p>
          )}
        </div>

        <div>
          <label className="block">Tags (comma-separated)</label>
          <input
            name="tags"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.tags}
            className="border p-2 w-full rounded"
          />
          {formik.touched.tags && formik.errors.tags && (
            <p className="text-red-500 text-sm">{formik.errors.tags}</p>
          )}
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="showOnHomepage"
              checked={formik.values.showOnHomepage}
              onChange={formik.handleChange}
            />
            Show on Homepage
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featuredPost"
              checked={formik.values.featuredPost}
              onChange={formik.handleChange}
            />
            Featured Post
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {editBlogId ? "Update Blog" : "Add Blog"}
        </button>
      </form>

      {loading ? (
        <div className="text-center py-8">Loading Blogs...</div>
      ) : blogs?.length > 0 ? (
        <div className="ag-theme-alpine flex-grow" style={{ width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={blogs}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            pagination
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No blogs available.</div>
      )}
    </div>
  );
}
