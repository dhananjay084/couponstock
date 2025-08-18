"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from "@/redux/review/reviewSlice";

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      designation: "",
      desc: "",
      image: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      designation: Yup.string().required("Designation is required"),
      desc: Yup.string().required("Description is required"),
      image: Yup.string().url("Must be a valid URL").required("Image URL is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (editId) {
        dispatch(updateReview({ id: editId, data: values }));
        setEditId(null);
      } else {
        dispatch(addReview(values));
      }
      resetForm();
    },
  });

  const handleEdit = (review) => {
    formik.setValues({
      name: review.name,
      designation: review.designation,
      desc: review.desc,
      image: review.image,
    });
    setEditId(review._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteReview(id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 shadow-lg rounded-lg border">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit Review" : "Add Review"}</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {["name", "designation", "desc", "image"].map((field) => (
          <div key={field}>
            <input
              type="text"
              name={field}
              placeholder={`Enter ${field}`}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border px-3 py-2 rounded"
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-red-500 text-sm">{formik.errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Update Review" : "Add Review"}
        </button>
      </form>

      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-semibold">All Reviews</h3>
        {loading && <p>Loading reviews...</p>}
        {!loading &&
          reviews.map((review) => (
            <div
              key={review._id}
              className="border p-4 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Name:</strong> {review.name}</p>
                <p><strong>Designation:</strong> {review.designation}</p>
                <p><strong>Desc:</strong> {review.desc}</p>
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 object-fill mt-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
