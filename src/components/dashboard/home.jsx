"use client";

import React, { useEffect, useState, useRef } from "react";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getDeals } from "../../redux/deal/dealSlice";
import { getHomeAdminData, createHomeAdmin, updateHomeAdmin } from "../../redux/admin/homeAdminSlice";
import { fetchCountries } from "../../redux/country/countrySlice";
import { toast } from "react-toastify";
import { uploadImage } from "../../lib/uploadImage";
import { isValidUrl } from "../../lib/validation";

const HtmlField = React.memo(function HtmlField({
  label,
  name,
  value,
  error,
  setFieldValue,
  setFieldTouched,
}) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (focused) return;
    if (!ref.current) return;
    const next = value || "";
    if (ref.current.innerHTML !== next) {
      ref.current.innerHTML = next;
    }
  }, [value, focused]);

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div
        ref={ref}
        className="w-full min-h-[120px] border rounded p-2 bg-white"
        dir="ltr"
        lang="en"
        spellCheck
        style={{ direction: "ltr", unicodeBidi: "embed", textAlign: "left" }}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setFieldTouched(name, true, false);
          setFieldValue(name, e.currentTarget.innerHTML);
        }}
      />
      <p className="text-xs text-gray-500 mt-1">Type normally. HTML is saved and rendered on homepage.</p>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
});

const HomeAdminPage = () => {
  const dispatch = useDispatch();
  const { deals = [] } = useSelector((state) => state.deal || {});
  const { data: entries = [] } = useSelector((state) => state.homeAdmin || {});
  const { countries = [] } = useSelector((state) => state.country || {});
  const [editingEntry, setEditingEntry] = useState(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const skipResetOnCountryRef = useRef(false);

  // ref to avoid stale closure issues inside formik's onSubmit
  const editingEntryRef = useRef(null);

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getHomeAdminData());
    dispatch(fetchCountries());
  }, [dispatch]);

  // keep ref in sync whenever editingEntry state changes
  useEffect(() => {
    editingEntryRef.current = editingEntry;
  }, [editingEntry]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const formik = useFormik({
    initialValues: {
      country: "",
      homepageBanner: "",
      midHomepageBanners: [{ image: "", link: "" }],
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
      faqImage: "",
      bannerDeals: [],
      dealPageBannerDeals: [],
      storePageBannerDeals: [],
      categoryPageBannerDeals: [],
      faqs: [{ question: "", answer: "" }],
      homeFooterTitle: "",
      homeFooterDescription: "",
      homeMetaTitle: "",
      homeMetaDescription: "",
    },

    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      bannerDeals: Yup.array().min(6, "Select at least 6 deals").required("Required"),
      dealPageBannerDeals: Yup.array().test(
        "min-if-set",
        "Select at least 3 deals",
        (arr) => !arr || arr.length === 0 || arr.length >= 3
      ),
      storePageBannerDeals: Yup.array().test(
        "min-if-set",
        "Select at least 3 deals",
        (arr) => !arr || arr.length === 0 || arr.length >= 3
      ),
      categoryPageBannerDeals: Yup.array().test(
        "min-if-set",
        "Select at least 3 deals",
        (arr) => !arr || arr.length === 0 || arr.length >= 3
      ),
      homepageBanner: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Required"),
      midHomepageBanners: Yup.array()
        .of(
          Yup.object({
            image: Yup.string()
              .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
              .required("Required"),
            link: Yup.string()
              .test("is-url", "Must be a valid URL", (val) => !val || isValidUrl(val))
              .nullable()
              .notRequired(),
          })
        )
        .min(3, "Add at least 3 mid homepage banners")
        .max(4, "Add at most 4 mid homepage banners")
        .required("Required"),
      allCouponsPageBanner: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Required"),
      allCouponsAboutHeading: Yup.string().required("Required"),
      allCouponsAboutDescription: Yup.string().required("Required"),
      allStoresPageBanner: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Required"),
      allStoresAboutHeading: Yup.string().required("Required"),
      allStoresAboutDescription: Yup.string().required("Required"),
      allCategoriesPageBanner: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Required"),
      allCategoriesAboutHeading: Yup.string().required("Required"),
      allCategoriesAboutDescription: Yup.string().required("Required"),
      individualStoreBanner: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Required"),
      faqImage: Yup.string()
        .transform((val) => (val === "" ? null : val))
        .nullable()
        .test("is-url", "Must be a valid URL", (val) => !val || isValidUrl(val)),
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
      const payload = {
        ...values,
        homeMetaTitle: (values.homeMetaTitle || "").trim(),
        homeMetaDescription: (values.homeMetaDescription || "").trim(),
        homeFooterTitle: values.homeFooterTitle || "",
        homeFooterDescription: values.homeFooterDescription || "",
      };
      try {
        if (currentEdit && currentEdit._id) {
          // update
          await dispatch(updateHomeAdmin({ id: currentEdit._id, data: payload })).unwrap();
          toast.success("Updated successfully");
          setEditingEntry(null);
          formik.resetForm();
          // refresh entries
          dispatch(getHomeAdminData());
        } else {
          // create
          await dispatch(createHomeAdmin(payload)).unwrap();
          toast.success("Created successfully");
          formik.resetForm();
          // refresh entries
          dispatch(getHomeAdminData());
        }
      } catch (err) {
        console.error("HomeAdmin submit error:", err);
        const apiError =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.error ||
          err?.message;
        toast.error(apiError || "Failed to save. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.country) {
      dispatch(getDeals(formik.values.country));
    } else {
      dispatch(getDeals());
    }
    // reset banner deals only on user-driven country changes
    if (skipResetOnCountryRef.current) {
      skipResetOnCountryRef.current = false;
      return;
    }
    formik.setFieldValue("bannerDeals", []);
    formik.setFieldValue("dealPageBannerDeals", []);
    formik.setFieldValue("storePageBannerDeals", []);
    formik.setFieldValue("categoryPageBannerDeals", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formik.values.country]);

  // Populate form values for editing — keeps editingEntry state AND ref consistent
  const editEntry = (entry) => {
    if (!entry) return;
    setEditingEntry(entry);
    editingEntryRef.current = entry;
    skipResetOnCountryRef.current = true;

    // map bannerDeals to IDs if they are objects
    const bannerDealsIds = Array.isArray(entry.bannerDeals)
      ? entry.bannerDeals.map((d) => (typeof d === "string" ? d : d._id))
      : [];
    const dealPageBannerDealsIds = Array.isArray(entry.dealPageBannerDeals)
      ? entry.dealPageBannerDeals.map((d) => (typeof d === "string" ? d : d._id))
      : [];
    const storePageBannerDealsIds = Array.isArray(entry.storePageBannerDeals)
      ? entry.storePageBannerDeals.map((d) => (typeof d === "string" ? d : d._id))
      : [];
    const categoryPageBannerDealsIds = Array.isArray(entry.categoryPageBannerDeals)
      ? entry.categoryPageBannerDeals.map((d) => (typeof d === "string" ? d : d._id))
      : [];

    formik.setValues({
      country: entry.country || "",
      homepageBanner: entry.homepageBanner || "",
      midHomepageBanners: Array.isArray(entry.midHomepageBanners) && entry.midHomepageBanners.length
        ? entry.midHomepageBanners.map((b) =>
            typeof b === "string" ? { image: b, link: "" } : { image: b.image || "", link: b.link || "" }
          )
        : [{ image: "", link: "" }],
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
      faqImage: entry.faqImage || "",
      bannerDeals: bannerDealsIds,
      dealPageBannerDeals: dealPageBannerDealsIds,
      storePageBannerDeals: storePageBannerDealsIds,
      categoryPageBannerDeals: categoryPageBannerDealsIds,
      faqs: Array.isArray(entry.faqs) && entry.faqs.length ? entry.faqs : [{ question: "", answer: "" }],
      homeFooterTitle: entry.homeFooterTitle || "",
      homeFooterDescription: entry.homeFooterDescription || "",
      homeMetaTitle: entry.homeMetaTitle || "",
      homeMetaDescription: entry.homeMetaDescription || "",
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
              <th className="p-2 border">Country</th>
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
                <td className="p-2 border">{entry.country}</td>
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
        {/* Country */}
        <div ref={countryRef} className="relative">
          <label className="block font-medium mb-1">Country</label>
          <button
            type="button"
            onClick={() => setCountryOpen((v) => !v)}
            className="w-full border border-[#D9CCF5] rounded-lg px-3 py-2 bg-white text-left text-sm text-[#2b1c4d] focus:outline-none focus:ring-2 focus:ring-[#592EA9]/30"
          >
            {formik.values.country ? formik.values.country : "Select country"}
          </button>
          {countryOpen && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#E4D8FF] bg-white shadow-lg max-h-60 overflow-y-auto">
              {countries.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    formik.setFieldValue("country", c.country_name);
                    setCountryOpen(false);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[#F5F1FF]"
                >
                  {c.country_name}
                </div>
              ))}
              {countries.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">No countries found.</div>
              )}
            </div>
          )}
          {formik.touched.country && formik.errors.country && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.country}</p>
          )}
        </div>

        {/* Banner Deals multi-select */}
        <div>
          <label className="block font-medium">Banner Deals (select at least 6)</label>
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
            {deals
              .filter((deal) =>
                formik.values.country
                  ? Array.isArray(deal.country)
                    ? deal.country.includes(formik.values.country)
                    : deal.country === formik.values.country
                  : true
              )
              .map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealTitle}
              </option>
            ))}
          </select>
          {formik.touched.bannerDeals && formik.errors.bannerDeals && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.bannerDeals}</p>
          )}
        </div>

        {/* Deals Page Banner Deals multi-select */}
        <div>
          <label className="block font-medium">Deals Page Banner Deals</label>
          <select
            name="dealPageBannerDeals"
            multiple
            value={formik.values.dealPageBannerDeals}
            onChange={(e) =>
              formik.setFieldValue(
                "dealPageBannerDeals",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {deals
              .filter((deal) =>
                formik.values.country
                  ? Array.isArray(deal.country)
                    ? deal.country.includes(formik.values.country)
                    : deal.country === formik.values.country
                  : true
              )
              .map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealTitle}
              </option>
            ))}
          </select>
          {formik.touched.dealPageBannerDeals && formik.errors.dealPageBannerDeals && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.dealPageBannerDeals}</p>
          )}
        </div>

        {/* Stores Page Banner Deals multi-select */}
        <div>
          <label className="block font-medium">Stores Page Banner Deals</label>
          <select
            name="storePageBannerDeals"
            multiple
            value={formik.values.storePageBannerDeals}
            onChange={(e) =>
              formik.setFieldValue(
                "storePageBannerDeals",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {deals
              .filter((deal) =>
                formik.values.country
                  ? Array.isArray(deal.country)
                    ? deal.country.includes(formik.values.country)
                    : deal.country === formik.values.country
                  : true
              )
              .map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealTitle}
              </option>
            ))}
          </select>
          {formik.touched.storePageBannerDeals && formik.errors.storePageBannerDeals && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.storePageBannerDeals}</p>
          )}
        </div>

        {/* Categories Page Banner Deals multi-select */}
        <div>
          <label className="block font-medium">Categories Page Banner Deals</label>
          <select
            name="categoryPageBannerDeals"
            multiple
            value={formik.values.categoryPageBannerDeals}
            onChange={(e) =>
              formik.setFieldValue(
                "categoryPageBannerDeals",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            className="w-full border rounded p-2"
          >
            {deals
              .filter((deal) =>
                formik.values.country
                  ? Array.isArray(deal.country)
                    ? deal.country.includes(formik.values.country)
                    : deal.country === formik.values.country
                  : true
              )
              .map((deal) => (
              <option key={deal._id} value={deal._id}>
                {deal.dealTitle}
              </option>
            ))}
          </select>
          {formik.touched.categoryPageBannerDeals && formik.errors.categoryPageBannerDeals && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.categoryPageBannerDeals}</p>
          )}
        </div>

        {/* Image URL inputs */}
        {[
          { label: "Home Page Banner", name: "homepageBanner" },
          { label: "All Coupons Banner", name: "allCouponsPageBanner" },
          { label: "All Stores Banner", name: "allStoresPageBanner" },
          { label: "All Categories Banner", name: "allCategoriesPageBanner" },
          { label: "Individual Store Banner", name: "individualStoreBanner" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              className="w-full border rounded p-2"
              placeholder="https://..."
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadImage(file);
                  formik.setFieldValue(name, url);
                  toast.success("Image uploaded");
                } catch (err) {
                  toast.error(err.message || "Upload failed");
                } finally {
                  e.target.value = "";
                }
              }}
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="text-red-600 text-sm mt-1">{formik.errors[name]}</p>
            )}
          </div>
        ))}

        {/* Text inputs */}
        {[
          { label: "All Coupons Heading", name: "allCouponsAboutHeading" },
          { label: "All Coupons Description", name: "allCouponsAboutDescription" },
          { label: "All Stores Heading", name: "allStoresAboutHeading" },
          { label: "All Stores Description", name: "allStoresAboutDescription" },
          { label: "All Categories Heading", name: "allCategoriesAboutHeading" },
          { label: "All Categories Description", name: "allCategoriesAboutDescription" },
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

        {/* Home Footer HTML fields */}
        {[
          { label: "Home Footer Title (HTML)", name: "homeFooterTitle" },
          { label: "Home Footer Description (HTML)", name: "homeFooterDescription" },
        ].map(({ label, name }) => (
          <HtmlField
            key={name}
            label={label}
            name={name}
            value={formik.values[name]}
            error={formik.touched[name] && formik.errors[name]}
            setFieldValue={formik.setFieldValue}
            setFieldTouched={formik.setFieldTouched}
          />
        ))}

        {/* Home Meta fields */}
        {[
          { label: "Home Meta Title", name: "homeMetaTitle" },
          { label: "Home Meta Description", name: "homeMetaDescription" },
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

        <FormikProvider value={formik}>
          <FieldArray name="midHomepageBanners">
            {({ push, remove }) => (
              <div className="space-y-2">
                <h2 className="font-semibold">Mid Homepage Banners (3–4)</h2>
                {formik.values.midHomepageBanners.map((val, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      name={`midHomepageBanners[${i}].image`}
                      value={val?.image || ""}
                      onChange={formik.handleChange}
                      placeholder="Banner image URL"
                      className="w-full border rounded p-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border rounded p-2"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadImage(file);
                          formik.setFieldValue(`midHomepageBanners[${i}].image`, url);
                          toast.success("Image uploaded");
                        } catch (err) {
                          toast.error(err.message || "Upload failed");
                        } finally {
                          e.target.value = "";
                        }
                      }}
                    />
                    <input
                      name={`midHomepageBanners[${i}].link`}
                      value={val?.link || ""}
                      onChange={formik.handleChange}
                      placeholder="Redirect URL (optional)"
                      className="w-full border rounded p-2"
                    />
                    {formik.values.midHomepageBanners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="text-red-600 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {formik.touched.midHomepageBanners && formik.errors.midHomepageBanners && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.midHomepageBanners}</p>
                )}
                {formik.values.midHomepageBanners.length < 4 && (
                  <button
                    type="button"
                    onClick={() => push({ image: "", link: "" })}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Add Banner
                  </button>
                )}
              </div>
            )}
          </FieldArray>
        </FormikProvider>

        <div>
          <label className="block font-medium mb-1">FAQ Image URL</label>
          <input
            name="faqImage"
            value={formik.values.faqImage}
            onChange={formik.handleChange}
            className="w-full border rounded p-2"
            placeholder="https://..."
          />
          <input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const url = await uploadImage(file);
                formik.setFieldValue("faqImage", url);
                toast.success("Image uploaded");
              } catch (err) {
                toast.error(err.message || "Upload failed");
              } finally {
                e.target.value = "";
              }
            }}
          />
          {formik.touched.faqImage && formik.errors.faqImage && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.faqImage}</p>
          )}
        </div>

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
            onClick={async () => {
              const errors = await formik.validateForm();
              if (Object.keys(errors).length > 0) {
                toast.error("Please fix the highlighted fields before saving.");
              }
            }}
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
