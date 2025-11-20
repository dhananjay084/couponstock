"use client";

import React, { useEffect, useState, useRef } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getDeals } from "@/redux/deal/dealSlice";
import { getHomeAdminData, createHomeAdmin, updateHomeAdmin } from "@/redux/admin/homeAdminSlice";
import { toast } from "react-toastify";

const HomeAdminPage = () => {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal || {});
  const { data: entries = [] } = useSelector((state) => state.homeAdmin || {});
  const [editingEntry, setEditingEntry] = useState(null);

  // ref to avoid stale closure issues inside formik's onSubmit
  const editingEntryRef = useRef(null);

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getHomeAdminData());
  }, [dispatch]);

  // keep ref in sync whenever editingEntry state changes
  useEffect(() => {
    editingEntryRef.current = editingEntry;
  }, [editingEntry]);

  const formik = useFormik({
    initialValues: {
      homepageBanner: "",
      midHomepageBanner: "",
      allCouponsPageBanner: "",
      allCouponsAboutHeading: "",
      allCouponsAboutDescription: "",
      allStoresPageBanner: "",
      allStoresAboutHeading: "",
      allStoresAboutDescription: "",
      allCategoriesPageBanner: "",
      allCategoriesAboutHeading: "",
      allCategoriesAboutDescription: "",
      individualStoreBanner: "",
      bannerDeals: [],
      faqs: [{ question: "", answer: "" }],
    },

    validationSchema: Yup.object({
      bannerDeals: Yup.array().min(3, "Select exactly 3 deals").max(3, "Select exactly 3 deals").required("Required"),
      homepageBanner: Yup.string().url("Must be a valid URL").required("Required"),
      midHomepageBanner: Yup.string().url("Must be a valid URL").required("Required"),
      allCouponsPageBanner: Yup.string().url("Must be a valid URL").required("Required"),
      allCouponsAboutHeading: Yup.string().required("Required"),
      allCouponsAboutDescription: Yup.string().required("Required"),
      allStoresPageBanner: Yup.string().url("Must be a valid URL").required("Required"),
      allStoresAboutHeading: Yup.string().required("Required"),
      allStoresAboutDescription: Yup.string().required("Required"),
      allCategoriesPageBanner: Yup.string().url("Must be a valid URL").required("Required"),
      allCategoriesAboutHeading: Yup.string().required("Required"),
      allCategoriesAboutDescription: Yup.string().required("Required"),
      individualStoreBanner: Yup.string().url("Must be a valid URL").required("Required"),
      faqs: Yup.array().of(
        Yup.object({
          question: Yup.string().required("Required"),
          answer: Yup.string().required("Required"),
        })
      ),
    }),

    // IMPORTANT: do not use enableReinitialize (it caused values to be reset unexpectedly)
    enableReinitialize: false,

    onSubmit: async (values, { setSubmitting }) => {
      // read current editing entry from ref to avoid stale closures
      const currentEdit = editingEntryRef.current;
console.log("values",values)
      try {
        if (currentEdit && currentEdit._id) {
          // update
          await dispatch(updateHomeAdmin({ id: currentEdit._id, data: values })).unwrap();
          toast.success("Updated successfully");
          setEditingEntry(null);
          formik.resetForm();
          // refresh entries
          dispatch(getHomeAdminData());
        } else {
          // create
          await dispatch(createHomeAdmin(values)).unwrap();
          toast.success("Created successfully");
          formik.resetForm();
          // refresh entries
          dispatch(getHomeAdminData());
        }
      } catch (err) {
        console.error("HomeAdmin submit error:", err);
        toast.error("Failed to save. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Populate form values for editing — keeps editingEntry state AND ref consistent
  const editEntry = (entry) => {
    if (!entry) return;
    setEditingEntry(entry);
    editingEntryRef.current = entry;

    // map bannerDeals to IDs if they are objects
    const bannerDealsIds = Array.isArray(entry.bannerDeals)
      ? entry.bannerDeals.map((d) => (typeof d === "string" ? d : d._id))
      : [];

    formik.setValues({
      homepageBanner: entry.homepageBanner || "",
      midHomepageBanner: entry.midHomepageBanner || "",
      allCouponsPageBanner: entry.allCouponsPageBanner || "",
      allCouponsAboutHeading: entry.allCouponsAboutHeading || "",
      allCouponsAboutDescription: entry.allCouponsAboutDescription || "",
      allStoresPageBanner: entry.allStoresPageBanner || "",
      allStoresAboutHeading: entry.allStoresAboutHeading || "",
      allStoresAboutDescription: entry.allStoresAboutDescription || "",
      allCategoriesPageBanner: entry.allCategoriesPageBanner || "",
      allCategoriesAboutHeading: entry.allCategoriesAboutHeading || "",
      allCategoriesAboutDescription: entry.allCategoriesAboutDescription || "",
      individualStoreBanner: entry.individualStoreBanner || "",
      bannerDeals: bannerDealsIds,
      faqs: Array.isArray(entry.faqs) && entry.faqs.length ? entry.faqs : [{ question: "", answer: "" }],
    });
  };

  // Cancel editing helper (optional)
  const cancelEditing = () => {
    setEditingEntry(null);
    editingEntryRef.current = null;
    formik.resetForm();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-8">
      {/* Table of existing entries */}
      {entries.length > 0 && (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Home Banner</th>
              <th className="p-2 border">Coupons Heading</th>
              <th className="p-2 border">Deals</th>
              <th className="p-2 border">FAQs</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={entry._id} className="text-center">
                <td className="p-2 border">{idx + 1}</td>
                <td className="p-2 border break-words max-w-xs">{entry.homepageBanner}</td>
                <td className="p-2 border break-words max-w-xs">{entry.allCouponsAboutHeading}</td>
                <td className="p-2 border">{Array.isArray(entry.bannerDeals) ? entry.bannerDeals.length : 0}</td>
                <td className="p-2 border">{Array.isArray(entry.faqs) ? entry.faqs.length : 0}</td>
                <td className="p-2 border">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => editEntry(entry)}
                      type="button"
                    >
                      Edit
                    </button>
                    {/* optional cancel button when editing this specific row */}
                    {editingEntry && editingEntry._id === entry._id && (
                      <button
                        className="text-red-600 hover:underline cursor-pointer"
                        onClick={cancelEditing}
                        type="button"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Banner Deals multi-select */}
        <div>
          <label className="block font-medium">Banner Deals (select 3)</label>
          <select
            name="bannerDeals"
            multiple
            value={formik.values.bannerDeals}
            onChange={(e) =>
              formik.setFieldValue(
                "bannerDeals",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {deals.map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealTitle}
              </option>
            ))}
          </select>
          {formik.touched.bannerDeals && formik.errors.bannerDeals && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.bannerDeals}</p>
          )}
        </div>

        {/* Generic full inputs */}
        {[
          { label: "Home Page Banner", name: "homepageBanner" },
          { label: "Mid Homepage Banner", name: "midHomepageBanner" },
          { label: "All Coupons Banner", name: "allCouponsPageBanner" },
          { label: "All Coupons Heading", name: "allCouponsAboutHeading" },
          { label: "All Coupons Description", name: "allCouponsAboutDescription" },
          { label: "All Stores Banner", name: "allStoresPageBanner" },
          { label: "All Stores Heading", name: "allStoresAboutHeading" },
          { label: "All Stores Description", name: "allStoresAboutDescription" },
          { label: "All Categories Banner", name: "allCategoriesPageBanner" },
          { label: "All Categories Heading", name: "allCategoriesAboutHeading" },
          { label: "All Categories Description", name: "allCategoriesAboutDescription" },
          { label: "Individual Store Banner", name: "individualStoreBanner" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <textarea
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              className="w-full border rounded p-2"
              rows={2}
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="text-red-600 text-sm mt-1">{formik.errors[name]}</p>
            )}
          </div>
        ))}

        {/* FAQs */}
        <FormikProvider value={formik}>
          <FieldArray name="faqs">
            {({ push, remove }) => (
              <div className="space-y-2">
                <h2 className="font-semibold">FAQs</h2>
                {formik.values.faqs.map((faq, i) => (
                  <div key={i} className="border p-2 rounded space-y-1">
                    <input
                      name={`faqs[${i}].question`}
                      value={faq.question}
                      onChange={formik.handleChange}
                      placeholder="Question"
                      className="w-full border rounded p-1"
                    />
                    {formik.touched?.faqs?.[i]?.question && formik.errors?.faqs?.[i]?.question && (
                      <p className="text-red-600 text-sm">{formik.errors.faqs[i].question}</p>
                    )}

                    <textarea
                      name={`faqs[${i}].answer`}
                      value={faq.answer}
                      onChange={formik.handleChange}
                      placeholder="Answer"
                      className="w-full border rounded p-1"
                      rows={2}
                    />
                    {formik.touched?.faqs?.[i]?.answer && formik.errors?.faqs?.[i]?.answer && (
                      <p className="text-red-600 text-sm">{formik.errors.faqs[i].answer}</p>
                    )}

                    <div className="flex gap-3">
                      <button type="button" onClick={() => remove(i)} className="text-red-600 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push({ question: "", answer: "" })}
                  className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                  Add FAQ
                </button>
              </div>
            )}
          </FieldArray>
        </FormikProvider>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 cursor-pointer disabled:opacity-60"
          >
            {editingEntry ? "Update Entry" : "Create Entry"}
          </button>

          {editingEntry && (
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded hover:bg-gray-300"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HomeAdminPage;
