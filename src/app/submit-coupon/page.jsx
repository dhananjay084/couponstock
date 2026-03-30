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
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#efe7ff_0%,rgba(239,231,255,0)_60%),radial-gradient(900px_500px_at_90%_10%,#ffe9ef_0%,rgba(255,233,239,0)_55%)]">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-8 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E4D8FF] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#592EA9]">
              Coupon Submission
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#2b1c4d] leading-tight font-['Space_Grotesk',_system-ui]">
              Submit a Deal That Customers Will Love
            </h1>
            <p className="text-sm md:text-base text-[#4a3d66] max-w-xl">
              Share your best offer with the MyCouponStock community. We review every
              submission quickly and publish the approved ones across the site.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#E9E1FF] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Approval</p>
                <p className="text-2xl font-semibold text-[#2b1c4d]">Fast</p>
                <p className="text-xs text-[#6c5f8a]">Usually within 24 hours</p>
              </div>
              <div className="rounded-2xl border border-[#E9E1FF] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Reach</p>
                <p className="text-2xl font-semibold text-[#2b1c4d]">Global</p>
                <p className="text-xs text-[#6c5f8a]">All active countries</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E9E1FF] bg-white/80 p-4 text-xs text-[#5b4a7a]">
              Tip: Use a clear deal title, a short description, and a high‑quality
              image URL to boost approval chances.
            </div>
          </div>

          <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit} enableReinitialize>
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-5 rounded-3xl border border-[#E4D8FF] bg-white/95 p-6 md:p-8 shadow-[0_30px_90px_-60px_rgba(89,46,169,0.5)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Your Name</label>
                    <Field name="submitterName" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.submitterName && errors.submitterName && (
                      <p className="text-red-500 text-xs mt-1">{errors.submitterName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Email Address</label>
                    <Field name="submitterEmail" type="email" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.submitterEmail && errors.submitterEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.submitterEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Phone</label>
                    <Field name="submitterPhone" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.submitterPhone && errors.submitterPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.submitterPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Deal Title</label>
                  <Field name="dealTitle" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                  {touched.dealTitle && errors.dealTitle && (
                    <p className="text-red-500 text-xs mt-1">{errors.dealTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Deal Description</label>
                  <Field as="textarea" name="dealDescription" rows={3} className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                  {touched.dealDescription && errors.dealDescription && (
                    <p className="text-red-500 text-xs mt-1">{errors.dealDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Deal Image URL</label>
                    <Field name="dealImage" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.dealImage && errors.dealImage && (
                      <p className="text-red-500 text-xs mt-1">{errors.dealImage}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Offer Type</label>
                    <Field as="select" name="dealCategory" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20">
                      <option value="coupon">Coupon</option>
                      <option value="deal">Deal</option>
                    </Field>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Category</label>
                    <Field as="select" name="categorySelect" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20">
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Field>
                    {touched.categorySelect && errors.categorySelect && (
                      <p className="text-red-500 text-xs mt-1">{errors.categorySelect}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Store</label>
                    <Field as="select" name="store" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20">
                      <option value="">Select store</option>
                      {stores.map((s) => (
                        <option key={s._id} value={s.storeName}>
                          {s.storeName}
                        </option>
                      ))}
                    </Field>
                    {touched.store && errors.store && (
                      <p className="text-red-500 text-xs mt-1">{errors.store}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Coupon Code</label>
                    <Field name="couponCode" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.couponCode && errors.couponCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.couponCode}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Discount</label>
                    <Field name="discount" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.discount && errors.discount && (
                      <p className="text-red-500 text-xs mt-1">{errors.discount}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Expiry Date</label>
                    <Field name="expiredDate" type="date" className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20" />
                    {touched.expiredDate && errors.expiredDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.expiredDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#7b6aa8]">Country</label>
                    <select
                      multiple
                      value={values.country}
                      onChange={(e) =>
                        setFieldValue(
                          "country",
                          Array.from(e.target.selectedOptions, (opt) => opt.value)
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-[#E1D7FF] bg-white px-3 py-2.5 text-sm focus:border-[#592EA9] focus:ring-2 focus:ring-[#592EA9]/20"
                    >
                      {countries.map((c) => (
                        <option key={c._id} value={c.country_name}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                    {touched.country && errors.country && (
                      <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#592EA9] px-6 py-3 text-white font-semibold tracking-wide hover:bg-[#4b1f86] transition disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Coupon"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
