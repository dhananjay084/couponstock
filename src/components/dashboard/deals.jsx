"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addDeal, getDeals, deleteDeal, updateDeal, bulkAddDeals } from "../../redux/deal/dealSlice";
import { toast } from "react-toastify";
import { getCategories } from "../../redux/category/categorySlice";
import { getStores } from "../../redux/store/storeSlice";
import { fetchCountries, addCountry } from "../../redux/country/countrySlice";
import "react-toastify/dist/ReactToastify.css";
import { uploadImage } from "../../lib/uploadImage";
import { isValidUrl } from "../../lib/validation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import clsx from "clsx";
import { getCountryCodeFromName, isAllowedCountryCode } from "../../lib/countryPath";
import { titleize } from "../../lib/slugify";
import * as XLSX from "xlsx";

// AG Grid modules
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const DealSchema = Yup.object().shape({
  deals: Yup.array().of(
    Yup.object().shape({
      dealTitle: Yup.string().required("Title is required"),
      dealDescription: Yup.string().required("Description is required"),
      dealImage: Yup.string()
        .test("is-url", "Enter a valid image URL", (val) => isValidUrl(val))
        .required("Image URL is required"),
      homePageTitle: Yup.string().required("Home page title is required"),
      dealType: Yup.string().required("Deal type is required"),
      dealCategory: Yup.string().oneOf(["coupon", "deal"], "Invalid category").required("Category is required"),
      showOnHomepage: Yup.boolean(),
      layoutFormat: Yup.string().oneOf(["custom", "structured"]).default("custom"),
      details: Yup.string().when("layoutFormat", {
        is: "custom",
        then: (schema) => schema.required("Details are required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      descriptionImage: Yup.string().test("is-url", "Enter a valid image URL", (val) => {
        if (!val) return true;
        return isValidUrl(val);
      }),
      tagPrimary: Yup.string(),
      tagSecondary: Yup.string(),
      headline: Yup.string(),
      usedTodayText: Yup.string(),
      successRateText: Yup.string(),
      endingSoonText: Yup.string(),
      userTypeText: Yup.string(),
      categorySelect: Yup.string().required("Please select a category"),
      store: Yup.string().required("Store is required"),
      expiredDate: Yup.date().required("Expiration date is required"),
      couponCode: Yup.string().required("Coupon code is required"),
      discount: Yup.string().required("Discount is required"),
      redirectionLink: Yup.string().required("Redirection link is required"),
      country: Yup.array()
        .of(Yup.string())
        .min(1, "Please select at least one country")
        .required("Country is required"),
    })
  ),
});



const DealsPage = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deal);
  const { categories } = useSelector((state) => state.category);
  const { stores } = useSelector((state) => state.store);
  const [editDeal, setEditDeal] = useState(null);
  const [newCountry, setNewCountry] = useState("");
  const { countries } = useSelector((state) => state.country); // ✅ ADD THIS LINE
  const allowedCountries = Object.values(
    (countries || []).reduce((acc, c) => {
      const name = (c.country_name || "").trim();
      if (!name) return acc;
      const code = getCountryCodeFromName(name);
      if (!isAllowedCountryCode(code)) return acc;
      const key = name.toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...c, code };
      } else {
        const existingName = acc[key].country_name || "";
        const existingIsTitle = existingName === titleize(existingName.toLowerCase());
        const nextIsTitle = name === titleize(name.toLowerCase());
        if (!existingIsTitle && nextIsTitle) {
          acc[key] = { ...c, code };
        }
      }
      return acc;
    }, {})
  );

  // AG Grid state
  const gridRef = useRef();
  const formTopRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkErrors, setBulkErrors] = useState([]);

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getCategories());
    dispatch(getStores());
    dispatch(fetchCountries()); 

  }, [dispatch]);

  const BULK_HEADERS = [
    "dealTitle",
    "dealDescription",
    "dealImage",
    "homePageTitle",
    "dealType",
    "dealCategory",
    "showOnHomepage",
    "layoutFormat",
    "details",
    "descriptionImage",
    "tagPrimary",
    "tagSecondary",
    "headline",
    "usedTodayText",
    "successRateText",
    "endingSoonText",
    "userTypeText",
    "categorySelect",
    "store",
    "couponCode",
    "discount",
    "expiredDate",
    "redirectionLink",
    "country",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
  ];

  const downloadBulkTemplate = () => {
    const sheet = XLSX.utils.aoa_to_sheet([BULK_HEADERS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Deals");
    XLSX.writeFile(wb, "deals-bulk-template.xlsx");
  };

  const normalizeHeader = (header) =>
    String(header || "")
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();

  const toBoolean = (val) => {
    if (typeof val === "boolean") return val;
    const text = String(val || "").trim().toLowerCase();
    return ["true", "yes", "1"].includes(text);
  };

  const parseCountry = (val) => {
    if (Array.isArray(val)) return val.filter(Boolean);
    return String(val || "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  };

  const normalizeText = (val) => String(val ?? "").trim();

  const normalizeDealCategory = (val) => {
    const text = normalizeText(val).toLowerCase();
    if (text === "coupon" || text === "coupons") return "coupon";
    if (text === "deal" || text === "deals") return "deal";
    return text || "deal";
  };

  const normalizeDateValue = (val) => {
    if (val === null || val === undefined || val === "") return "";

    if (typeof val === "number") {
      const parsed = XLSX.SSF.parse_date_code(val);
      if (parsed?.y && parsed?.m && parsed?.d) {
        const mm = String(parsed.m).padStart(2, "0");
        const dd = String(parsed.d).padStart(2, "0");
        return `${parsed.y}-${mm}-${dd}`;
      }
      return "";
    }

    if (val instanceof Date && !Number.isNaN(val.getTime())) {
      return val.toISOString().slice(0, 10);
    }

    const raw = normalizeText(val);
    if (!raw) return "";

    const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slash) {
      const dd = slash[1].padStart(2, "0");
      const mm = slash[2].padStart(2, "0");
      const yyyy = slash[3];
      return `${yyyy}-${mm}-${dd}`;
    }

    const dash = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dash) {
      const dd = dash[1].padStart(2, "0");
      const mm = dash[2].padStart(2, "0");
      const yyyy = dash[3];
      return `${yyyy}-${mm}-${dd}`;
    }

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return "";
  };

  const normalizeLayoutFormat = (val) => {
    if (typeof val === "boolean") {
      return val ? "structured" : "custom";
    }
    if (typeof val === "number") {
      return val === 1 ? "structured" : "custom";
    }

    const text = normalizeText(val).toLowerCase();
    if (!text) return "custom";
    if (text === "structured") return "structured";
    if (text === "custom") return "custom";
    if (["true", "yes", "y", "1"].includes(text)) return "structured";
    if (["false", "no", "n", "0"].includes(text)) return "custom";
    return "custom";
  };

  const toDisplayString = useCallback((value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value && typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (err) {
        return String(value);
      }
    }
    return value ?? "";
  }, []);

  const parseBulkFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    if (!rows.length) return [];

    const headerMap = {};
    Object.keys(rows[0]).forEach((key) => {
      headerMap[normalizeHeader(key)] = key;
    });

    return rows.map((row, idx) => {
      const get = (name) => row[headerMap[normalizeHeader(name)]] ?? "";
      const layoutFormat = normalizeLayoutFormat(get("layoutFormat"));

      const dealDescription = normalizeText(get("dealDescription"));
      const details = normalizeText(get("details"));
      const homePageTitle = normalizeText(get("homePageTitle"));

      return {
        __row: idx + 2,
        dealTitle: normalizeText(get("dealTitle")),
        dealDescription,
        dealImage: normalizeText(get("dealImage")),
        homePageTitle,
        dealType: normalizeText(get("dealType")),
        dealCategory: normalizeDealCategory(get("dealCategory")),
        showOnHomepage: toBoolean(get("showOnHomepage")),
        layoutFormat,
        // Backend requires details when format=custom; fallback prevents silent row failure.
        details: layoutFormat === "custom" ? (details || dealDescription || homePageTitle) : details,
        descriptionImage: normalizeText(get("descriptionImage")),
        tagPrimary: normalizeText(get("tagPrimary")),
        tagSecondary: normalizeText(get("tagSecondary")),
        headline: normalizeText(get("headline")),
        usedTodayText: normalizeText(get("usedTodayText")),
        successRateText: normalizeText(get("successRateText")),
        endingSoonText: normalizeText(get("endingSoonText")),
        userTypeText: normalizeText(get("userTypeText")),
        categorySelect: normalizeText(get("categorySelect")),
        store: normalizeText(get("store")),
        couponCode: normalizeText(get("couponCode")),
        discount: normalizeText(get("discount")),
        expiredDate: normalizeDateValue(get("expiredDate")),
        redirectionLink: normalizeText(get("redirectionLink")),
        country: parseCountry(get("country")),
        metaTitle: normalizeText(get("metaTitle")),
        metaDescription: normalizeText(get("metaDescription")),
        metaKeywords: normalizeText(get("metaKeywords")),
      };
    });
  };

  const handleBulkUpload = async (file) => {
    if (!file) return;
    setBulkUploading(true);
    try {
      const dealsFromFile = await parseBulkFile(file);
      setBulkErrors([]);
      if (!dealsFromFile.length) {
        toast.error("No rows found in the file.");
        return;
      }

      const payloadDeals = dealsFromFile.map((d) => {
        const copy = { ...d };
        delete copy.__row;
        return copy;
      });

      const result = await dispatch(bulkAddDeals(payloadDeals)).unwrap();
      const inserted = result?.insertedCount ?? 0;
      const failed = result?.failedCount ?? 0;

      if (inserted) {
        toast.success(`${inserted} deal(s) uploaded successfully.`);
        dispatch(getDeals());
      }
      if (failed) {
        const mappedErrors = (result?.errors || []).map((err) => {
          const sheetRow = typeof err?.index === "number"
            ? (dealsFromFile[err.index]?.__row ?? err.index + 2)
            : null;
          return {
            row: sheetRow,
            message: err?.message || "Failed to save deal",
            missingFields: Array.isArray(err?.missingFields) ? err.missingFields : [],
          };
        });
        setBulkErrors(mappedErrors);
        toast.error(`Some rows failed. See Bulk Upload Errors below.`);
        console.warn("Bulk upload errors:", result?.errors || []);
      }
      if (!failed) {
        setBulkErrors([]);
      }
    } catch (err) {
      toast.error(err?.message || "Failed to process file.");
      setBulkErrors([
        {
          row: null,
          message: err?.message || "Failed to process file.",
          missingFields: [],
        },
      ]);
    } finally {
      setBulkUploading(false);
    }
  };

  const columnDefs = [
    { headerName: "Title", field: "dealTitle", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Countries",
      field: "country",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => toDisplayString(params.value),
      cellRenderer: (params) =>
        Array.isArray(params.value)
          ? params.value.join(", ")
          : toDisplayString(params.value) || "—",
    },
    
    { headerName: "Description", field: "dealDescription", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Image",
      field: "dealImage",
      cellRenderer: (params) => (
        <img src={params.value} alt="deal" className="h-12 w-12 object-fill rounded-md" />
      ),
      width: 100,
      resizable: false,
    },
    { headerName: "Homepage Title", field: "homePageTitle", sortable: true, filter: true, flex: 1 },
    { headerName: "Type", field: "dealType", sortable: true, filter: true, width: 120 },
    { headerName: "Category", field: "dealCategory", sortable: true, filter: true, width: 120 },
    {
      headerName: "Homepage?",
      field: "showOnHomepage",
      cellRenderer: (params) => (params.value ? "✅" : "❌"),
      width: 120,
      filter: true,
    },
    { headerName: "Store", field: "store", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <div className="flex space-x-2 items-center h-full">
          <button
            onClick={() => {
              const slug = params.data?.slug || params.value;
              window.open(`/deal/${slug}?category=${params.data?.categorySelect || ""}`, "_blank");
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs cursor-pointer"
          >
            Preview
          </button>
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
      width: 260,
      minWidth: 220,
      resizable: false,
      suppressSizeToFit: true,
      pinned: "right",
      cellStyle: { overflow: "visible" },
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: true,
      valueFormatter: (params) => toDisplayString(params.value),
    }),
    [toDisplayString]
  );
  const onGridReady = useCallback((params) => params.api.sizeColumnsToFit(), []);
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(searchText);
  }, [searchText]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDeal(id)).unwrap();
      // toast.success("Deal deleted!");
      dispatch(getDeals());
    } catch (error) {
      toast.error(`Failed to delete deal: ${error.message || "Unknown error"}`);
    }
  };

  const handleEdit = (deal) => {
    setEditDeal(deal);
    setTimeout(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleUpdate = async (values, resetForm) => {
    try {
      await dispatch(updateDeal({ id: editDeal._id, data: values.deals[0] })).unwrap();
      // toast.success("Deal updated!");
      dispatch(getDeals());
      resetForm();
      setEditDeal(null);
    } catch (error) {
      toast.error(`Failed to update deal: ${error.message || "Unknown error"}`);
    }
  };
  const handleAddCountry = async () => {
    if (!newCountry.trim()) {
      toast.error("Country name cannot be empty");
      return;
    }
  
    try {
      await dispatch(addCountry(newCountry)).unwrap();
      toast.success(`Country "${newCountry}" added successfully!`);
      setNewCountry("");
      dispatch(fetchCountries());
    } catch (error) {
      toast.error(`Failed to add country: ${error.message || "Unknown error"}`);
    }
  };
  
  const isExpired = (deal) => {
    if (!deal?.expiredDate) return false;
    const exp = new Date(deal.expiredDate);
    if (Number.isNaN(exp.getTime())) return false;
    const endOfDay = new Date(exp);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay < new Date();
  };

  const filteredDeals = deals.filter((deal) => {
    if (expiryFilter === "expired") return isExpired(deal);
    if (expiryFilter === "active") return !isExpired(deal);
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Deals/Coupons Upload</h1>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-800">Bulk Upload (Excel)</div>
            <div className="text-sm text-gray-500">
              Use the template headers exactly. Country can be comma-separated.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadBulkTemplate}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Download Template
            </button>
            <label className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
              {bulkUploading ? "Uploading..." : "Upload Excel"}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  handleBulkUpload(file);
                }}
                disabled={bulkUploading}
              />
            </label>
          </div>
        </div>
      </div>

      {bulkErrors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-sm font-semibold text-red-800 mb-2">Bulk Upload Errors</div>
          <div className="max-h-56 overflow-auto space-y-2">
            {bulkErrors.map((err, idx) => (
              <div key={`${err.row || "na"}-${idx}`} className="text-sm text-red-900">
                <span className="font-medium">
                  {err.row ? `Row ${err.row}` : "Row unknown"}:
                </span>{" "}
                <span>{err.message}</span>
                {err.missingFields.length > 0 && (
                  <span> ({err.missingFields.join(", ")})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Search deals..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={onFilterTextBoxChanged}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={expiryFilter}
          onChange={(e) => setExpiryFilter(e.target.value)}
          className="w-full md:w-56 px-4 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="all">All Deals</option>
          <option value="active">Active Deals</option>
          <option value="expired">Expired Deals</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading Deals...</div>
      ) : filteredDeals?.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={filteredDeals}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            quickFilterText={searchText}
            theme="legacy"
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            domLayout="autoHeight"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No deals available.</div>
      )}
{/* ✅ Add Country Section */}
<div className="mb-8 border p-4 rounded-md bg-gray-50">
  <h2 className="text-lg font-semibold mb-3">Add a Country</h2>
  <div className="flex gap-3">
    <input
      type="text"
      placeholder="Enter country name"
      value={newCountry}
      onChange={(e) => setNewCountry(e.target.value)}
      className="flex-1 px-3 py-2 border rounded-md"
    />
    <button
      onClick={handleAddCountry}
      type="button"
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Add Country
    </button>
  </div>

  {countries.length === 0 && (
    <p className="text-sm text-gray-500 mt-2">
      ⚠️ No countries found. Add one above to get started.
    </p>
  )}
</div>

<Formik
        enableReinitialize
        initialValues={{
          deals: [
            editDeal ? {
              dealTitle: editDeal.dealTitle || '',
              dealDescription: editDeal.dealDescription || '',
              dealImage: editDeal.dealImage || '',
              homePageTitle: editDeal.homePageTitle || '',
              dealType: editDeal.dealType || '',
              dealCategory: editDeal.dealCategory || 'coupon',
              showOnHomepage: editDeal.showOnHomepage ?? false,
              layoutFormat: editDeal.layoutFormat || 'custom',
              details: editDeal.details || '',
              descriptionImage: editDeal.descriptionImage || '',
              tagPrimary: editDeal.tagPrimary || '',
              tagSecondary: editDeal.tagSecondary || '',
              headline: editDeal.headline || '',
              usedTodayText: editDeal.usedTodayText || '',
              successRateText: editDeal.successRateText || '',
              endingSoonText: editDeal.endingSoonText || '',
              userTypeText: editDeal.userTypeText || '',
              categorySelect: editDeal.categorySelect || '',
              store: editDeal.store || '',
              couponCode: editDeal.couponCode || '',
              discount: editDeal.discount || '',
              expiredDate: editDeal.expiredDate ? new Date(editDeal.expiredDate).toISOString().split('T')[0] : '',
              redirectionLink: editDeal.redirectionLink || '', // <-- NEW FIELD
              country: editDeal.country || [], // ✅ Add this
              metaTitle: editDeal?.metaTitle || "",
metaDescription: editDeal?.metaDescription || "",
metaKeywords: editDeal?.metaKeywords || "",

            } : {
              dealTitle: '',
              dealDescription: '',
              dealImage: '',
              homePageTitle: '',
              dealType: '',
              dealCategory: 'coupon',
              showOnHomepage: false,
              layoutFormat: 'custom',
              details: '',
              descriptionImage: '',
              tagPrimary: '',
              tagSecondary: '',
              headline: '',
              usedTodayText: '',
              successRateText: '',
              endingSoonText: '',
              userTypeText: '',
              categorySelect: '',
              store: '',
              couponCode: '',
              discount: '',
              expiredDate: '',
              redirectionLink: '', // <-- NEW FIELD
              country: [], // ✅ Add this
              metaTitle: editDeal?.metaTitle || "",
metaDescription: editDeal?.metaDescription || "",
metaKeywords: editDeal?.metaKeywords || "",

            },
          ],
        }}
        
        validationSchema={DealSchema}
        onSubmit={async (values, { resetForm }) => {
          if (editDeal) {
            await handleUpdate(values, resetForm);
          } else {
            try {
              for (let deal of values.deals) {
                await dispatch(addDeal(deal)).unwrap();
              }
              toast.success(`${values.deals.length} deal(s) added!`);
              dispatch(getDeals());
              resetForm();
            } catch (error) {
              toast.error(`Failed to upload deals: ${error.message || 'Unknown error'}`);
            }
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="mt-10">
            <div ref={formTopRef} />
            <FieldArray name="deals">
              {({ push, remove }) => (
                <div className="space-y-10">
                  {values.deals.map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-6 rounded-lg shadow-sm relative bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                          {editDeal ? "Edit Deal" : "Deal Entry"}
                        </h2>
                        {editDeal && (
                          <button
                            type="button"
                            onClick={() => setEditDeal(null)}
                            className="text-sm text-gray-600 underline"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Title</label>
                        <Field name={`deals[${index}].dealTitle`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].dealTitle`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Description</label>
                        <Field as="textarea" name={`deals[${index}].dealDescription`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].dealDescription`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Image URL</label>
                        <Field name={`deals[${index}].dealImage`} className="w-full px-3 py-2 border rounded-md" />
                        <input
                          type="file"
                          accept="image/*"
                          className="mt-2"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImage(file);
                              setFieldValue(`deals[${index}].dealImage`, url);
                              toast.success("Image uploaded");
                            } catch (err) {
                              toast.error(err.message || "Upload failed");
                            } finally {
                              e.target.value = "";
                            }
                          }}
                        />
                        <ErrorMessage name={`deals[${index}].dealImage`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Homepage Title</label>
                        <Field name={`deals[${index}].homePageTitle`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].homePageTitle`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Type</label>
                        <Field
                          as="select"
                          name={`deals[${index}].dealType`}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select Deal Type</option>
                          <option value="Today's Top Deal">Today's Top Deal</option>
                          <option value="Hot">Hot</option>
                          <option value="Deal of week">Deal of week</option>
                          <option value="Coupons/Deals">Coupons/Deals</option>
                          <option value="Top Deals">Top Deals</option>
                        </Field>
                        <ErrorMessage
                          name={`deals[${index}].dealType`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>


                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Category</label>
                        <Field as="select" name={`deals[${index}].dealCategory`} className="w-full px-3 py-2 border rounded-md">
                          <option value="coupon">Coupon</option>
                          <option value="deal">Deal</option>
                        </Field>
                        <ErrorMessage name={`deals[${index}].dealCategory`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Deal Page Format</label>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <Field
                              type="checkbox"
                              name={`deals[${index}].layoutFormat`}
                              checked={values.deals[index].layoutFormat === "structured"}
                              onChange={(e) =>
                                setFieldValue(
                                  `deals[${index}].layoutFormat`,
                                  e.target.checked ? "structured" : "custom"
                                )
                              }
                            />
                            Use Structured Format
                          </label>
                          <span className="text-xs text-gray-500">
                            Unchecked uses Custom HTML (current behavior)
                          </span>
                        </div>
                      </div>

                      {values.deals[index].layoutFormat === "custom" && (
                        <div className="mb-4">
                          <label className="block mb-1 font-medium">Details (HTML Content)</label>
                          <Field as="textarea" name={`deals[${index}].details`} className="w-full px-3 py-2 border rounded-md" />
                          <ErrorMessage name={`deals[${index}].details`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      )}

                      {values.deals[index].layoutFormat === "structured" && (
                        <div className="mb-6 border border-dashed border-gray-300 p-4 rounded-md bg-gray-50">
                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Description Image URL</label>
                            <Field name={`deals[${index}].descriptionImage`} className="w-full px-3 py-2 border rounded-md" />
                            <input
                              type="file"
                              accept="image/*"
                              className="mt-2"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const url = await uploadImage(file);
                                  setFieldValue(`deals[${index}].descriptionImage`, url);
                                  toast.success("Image uploaded");
                                } catch (err) {
                                  toast.error(err.message || "Upload failed");
                                } finally {
                                  e.target.value = "";
                                }
                              }}
                            />
                            <ErrorMessage name={`deals[${index}].descriptionImage`} component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Tag 1 (e.g., Fashion Deal)</label>
                            <Field name={`deals[${index}].tagPrimary`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Tag 2 (e.g., Verified)</label>
                            <Field name={`deals[${index}].tagSecondary`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Headline (Main Title)</label>
                            <Field name={`deals[${index}].headline`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Used Today Text (e.g., 99+ used today)</label>
                            <Field name={`deals[${index}].usedTodayText`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Success Rate Text (e.g., 92% success)</label>
                            <Field name={`deals[${index}].successRateText`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-4">
                            <label className="block mb-1 font-medium">Ending Soon Text</label>
                            <Field name={`deals[${index}].endingSoonText`} className="w-full px-3 py-2 border rounded-md" />
                          </div>

                          <div className="mb-2">
                            <label className="block mb-1 font-medium">User Type Text (e.g., First-time)</label>
                            <Field name={`deals[${index}].userTypeText`} className="w-full px-3 py-2 border rounded-md" />
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Select Category</label>
                        <Field
                          as="select"
                          name={`deals[${index}].categorySelect`}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select...</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`deals[${index}].categorySelect`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Select Store</label>
                        <Field
                          as="select"
                          name={`deals[${index}].store`}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select a store</option>
                          {stores.map((store) => (
                            <option key={store._id} value={store.storeName}>
                              {store.storeName}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`deals[${index}].store`}
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Coupon Code</label>
                        <Field name={`deals[${index}].couponCode`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].couponCode`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Discount</label>
                        <Field name={`deals[${index}].discount`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].discount`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 font-medium">Expiration Date</label>
                        <Field type="date" name={`deals[${index}].expiredDate`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].expiredDate`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                      <div className="mb-4">
  <label className="block mb-1 font-medium">Redirection Link</label>
  <Field
    name={`deals[${index}].redirectionLink`}
    placeholder="https://example.com"
    className="w-full px-3 py-2 border rounded-md"
  />
  <ErrorMessage
    name={`deals[${index}].redirectionLink`}
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>
<div className="mb-4">
  <label className="block mb-1 font-medium">Meta Title</label>
  <Field
    name={`deals[${index}].metaTitle`}
    className="w-full px-3 py-2 border rounded-md"
  />
</div>

<div className="mb-4">
  <label className="block mb-1 font-medium">Meta Description</label>
  <Field
    as="textarea"
    name={`deals[${index}].metaDescription`}
    className="w-full px-3 py-2 border rounded-md"
  />
</div>

<div className="mb-4">
  <label className="block mb-1 font-medium">Meta Keywords</label>
  <Field
    name={`deals[${index}].metaKeywords`}
    className="w-full px-3 py-2 border rounded-md"
  />
</div>


                      <div className="mb-4 flex items-center gap-2">
                        <Field type="checkbox" name={`deals[${index}].showOnHomepage`} className="mr-2" />
                        <label className="font-medium">Show on Homepage?</label>
                      </div>

                      {values.deals.length > 1 && !editDeal && (
                        <button
                          type="button"
                          className="text-red-600 mt-2 underline text-sm absolute top-4 right-4 cursor-pointer"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      )}
                      <div className="mb-4">
  <label className="block mb-1 font-medium">Select Country</label>

  <Field name={`deals[${index}].country`}>
    {({ field, form }) => {
      // field.value will hold selected countries (as array)
      const selectedCountries = field.value || [];

      const toggleCountry = (countryName) => {
        const newSelection = selectedCountries.includes(countryName)
          ? selectedCountries.filter((c) => c !== countryName)
          : [...selectedCountries, countryName];

        form.setFieldValue(field.name, newSelection);
      };

      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {allowedCountries.length > 0 ? (
            allowedCountries.map((country) => {
              const isSelected = selectedCountries.includes(country.country_name);
              return (
                <button
                  type="button"
                  key={country._id}
                  onClick={() => toggleCountry(country.country_name)}
                  className={clsx(
                    "px-4 py-2 rounded-full border text-sm transition",
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  )}
                >
                  {country.country_name}
                </button>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No countries available.</p>
          )}
        </div>
      );
    }}
  </Field>

  <ErrorMessage
    name={`deals[${index}].country`}
    component="div"
    className="text-red-500 text-sm mt-1"
  />
</div>
                    </div>
                    
                  ))}
{/* ✅ Multi-select country pills */}




                  <div className="mt-8">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 cursor-pointer"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : editDeal ? 'Update Deal' : 'Submit Deals'}
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DealsPage;
