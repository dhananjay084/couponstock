"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCountries } from "../../redux/country/countrySlice";
import { getStores } from "../../redux/store/storeSlice";
import { getCategories } from "../../redux/category/categorySlice";

const schema = Yup.object().shape({
  submitterName: Yup.string().required("Name is required"),
  submitterEmail: Yup.string().email("Invalid email").required("Email is required"),
  submitterPhone: Yup.string().required("Phone is required"),
  dealTitle: Yup.string().required("Deal title is required"),
  dealDescription: Yup.string().required("Description is required"),
  dealImage: Yup.string().url("Invalid URL").required("Image URL is required"),
  dealCategory: Yup.string().required("Category type is required"),
  categorySelect: Yup.string().required("Category is required"),
  couponCode: Yup.string().required("Coupon code is required"),
  discount: Yup.string().required("Discount is required"),
  expiredDate: Yup.date().required("Expiry date is required"),
  store: Yup.string().required("Store is required"),
  country: Yup.array().min(1, "Select at least one country").required("Country is required"),
});

export default function SubmitCouponPage() {
  const dispatch = useDispatch();
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});
  const { stores = [] } = useSelector((state) => state.store || {});
  const { categories = [] } = useSelector((state) => state.category || {});

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(getStores());
    dispatch(getCategories());
  }, [dispatch]);

  const initialValues = {
    submitterName: "",
    submitterEmail: "",
    submitterPhone: "",
    dealTitle: "",
    dealDescription: "",
    dealImage: "",
    dealCategory: "coupon",
    categorySelect: "",
    couponCode: "",
    discount: "",
    expiredDate: "",
    store: "",
    country: selectedCountry ? [selectedCountry] : [],
  };

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/coupon-submissions`, values);
      toast.success("Coupon submitted for review!");
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#592EA9] mb-6">Submit a Coupon</h1>
      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-[#E4D8FF]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Your Name</label>
                <Field name="submitterName" className="w-full border rounded-md px-3 py-2" />
                {touched.submitterName && errors.submitterName && (
                  <p className="text-red-500 text-sm">{errors.submitterName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Email Address</label>
                <Field name="submitterEmail" type="email" className="w-full border rounded-md px-3 py-2" />
                {touched.submitterEmail && errors.submitterEmail && (
                  <p className="text-red-500 text-sm">{errors.submitterEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <Field name="submitterPhone" className="w-full border rounded-md px-3 py-2" />
                {touched.submitterPhone && errors.submitterPhone && (
                  <p className="text-red-500 text-sm">{errors.submitterPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Deal Title</label>
              <Field name="dealTitle" className="w-full border rounded-md px-3 py-2" />
              {touched.dealTitle && errors.dealTitle && (
                <p className="text-red-500 text-sm">{errors.dealTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Deal Description</label>
              <Field as="textarea" name="dealDescription" rows={3} className="w-full border rounded-md px-3 py-2" />
              {touched.dealDescription && errors.dealDescription && (
                <p className="text-red-500 text-sm">{errors.dealDescription}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Deal Image URL</label>
                <Field name="dealImage" className="w-full border rounded-md px-3 py-2" />
                {touched.dealImage && errors.dealImage && (
                  <p className="text-red-500 text-sm">{errors.dealImage}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Offer Type</label>
                <Field as="select" name="dealCategory" className="w-full border rounded-md px-3 py-2">
                  <option value="coupon">Coupon</option>
                  <option value="deal">Deal</option>
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <Field as="select" name="categorySelect" className="w-full border rounded-md px-3 py-2">
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Field>
                {touched.categorySelect && errors.categorySelect && (
                  <p className="text-red-500 text-sm">{errors.categorySelect}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Store</label>
                <Field as="select" name="store" className="w-full border rounded-md px-3 py-2">
                  <option value="">Select store</option>
                  {stores.map((s) => (
                    <option key={s._id} value={s.storeName}>
                      {s.storeName}
                    </option>
                  ))}
                </Field>
                {touched.store && errors.store && (
                  <p className="text-red-500 text-sm">{errors.store}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Coupon Code</label>
                <Field name="couponCode" className="w-full border rounded-md px-3 py-2" />
                {touched.couponCode && errors.couponCode && (
                  <p className="text-red-500 text-sm">{errors.couponCode}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Discount</label>
                <Field name="discount" className="w-full border rounded-md px-3 py-2" />
                {touched.discount && errors.discount && (
                  <p className="text-red-500 text-sm">{errors.discount}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Expiry Date</label>
                <Field name="expiredDate" type="date" className="w-full border rounded-md px-3 py-2" />
                {touched.expiredDate && errors.expiredDate && (
                  <p className="text-red-500 text-sm">{errors.expiredDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <select
                  multiple
                  value={values.country}
                  onChange={(e) =>
                    setFieldValue(
                      "country",
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  {countries.map((c) => (
                    <option key={c._id} value={c.country_name}>
                      {c.country_name}
                    </option>
                  ))}
                </select>
                {touched.country && errors.country && (
                  <p className="text-red-500 text-sm">{errors.country}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#592EA9] text-white px-6 py-2 rounded-md hover:bg-[#4b1f86] cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Coupon"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
