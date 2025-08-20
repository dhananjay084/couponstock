"use client";

import React, { useEffect, useState } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getDeals } from "@/redux/deal/dealSlice";
import { getHomeAdminData, createHomeAdmin, updateHomeAdmin } from "@/redux/admin/homeAdminSlice";

const HomeAdminPage = () => {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal);
  const { data: entries = [] } = useSelector((state) => state.homeAdmin);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getHomeAdminData());
  }, [dispatch]);

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
      bannerDeals: Yup.array().min(3).max(3).required(),
      homepageBanner: Yup.string().url().required(),
      midHomepageBanner: Yup.string().url().required(),
      allCouponsPageBanner: Yup.string().url().required(),
      allCouponsAboutHeading: Yup.string().required(),
      allCouponsAboutDescription: Yup.string().required(),
      allStoresPageBanner: Yup.string().url().required(),
      allStoresAboutHeading: Yup.string().required(),
      allStoresAboutDescription: Yup.string().required(),
      allCategoriesPageBanner: Yup.string().url().required(),
      allCategoriesAboutHeading: Yup.string().required(),
      allCategoriesAboutDescription: Yup.string().required(),
      individualStoreBanner: Yup.string().url().required(),
      faqs: Yup.array().of(
        Yup.object({
          question: Yup.string().required(),
          answer: Yup.string().required(),
        })
      ),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingEntry) {
        dispatch(updateHomeAdmin({ id: editingEntry._id, data: values })).then(() => {
          alert("Updated successfully");
          setEditingEntry(null);
          formik.resetForm();
        });
      } else {
        dispatch(createHomeAdmin(values)).then(() => {
          alert("Created successfully");
          formik.resetForm();
        });
      }
    },
  });

  const editEntry = (entry) => {
    setEditingEntry(entry);
    formik.setValues({
      ...entry,
      bannerDeals: entry.bannerDeals.map((d) => d._id),
      faqs: entry.faqs.length ? entry.faqs : [{ question: "", answer: "" }],
    });
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
                <td className="p-2 border">{entry.homepageBanner}</td>
                <td className="p-2 border">{entry.allCouponsAboutHeading}</td>
                <td className="p-2 border">{entry.bannerDeals.length}</td>
                <td className="p-2 border">{entry.faqs.length}</td>
                <td className="p-2 border">
                  <button
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => editEntry(entry)}
                  >
                    Edit
                  </button>
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
            <label className="block font-medium">{label}</label>
            <textarea
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              className="w-full border rounded p-2"
              rows={2}
            />
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
                    <textarea
                      name={`faqs[${i}].answer`}
                      value={faq.answer}
                      onChange={formik.handleChange}
                      placeholder="Answer"
                      className="w-full border rounded p-1"
                      rows={2}
                    />
                    <button type="button" onClick={() => remove(i)} className="text-red-600 cursor-pointer">
                      Remove
                    </button>
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

        <button
          type="submit"
          className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 cursor-pointer"
        >
          {editingEntry ? "Update Entry" : "Create Entry"}
        </button>
      </form>
    </div>
  );
};

export default HomeAdminPage;
