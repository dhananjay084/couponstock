"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addDeal, getDeals, deleteDeal, updateDeal } from "@/redux/deal/dealSlice";
import { toast, ToastContainer } from "react-toastify";
import { getCategories } from "@/redux/category/categorySlice";
import { getStores } from "@/redux/store/storeSlice";
import { fetchCountries, addCountry } from "@/redux/country/countrySlice";
import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import clsx from "clsx";

// AG Grid modules
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const DealSchema = Yup.object().shape({
  deals: Yup.array().of(
    Yup.object().shape({
      dealTitle: Yup.string().required("Title is required"),
      dealDescription: Yup.string().required("Description is required"),
      dealImage: Yup.string().url("Enter a valid image URL").required("Image URL is required"),
      homePageTitle: Yup.string().required("Home page title is required"),
      dealType: Yup.string().required("Deal type is required"),
      dealCategory: Yup.string().oneOf(["coupon", "deal"], "Invalid category").required("Category is required"),
      showOnHomepage: Yup.boolean(),
      details: Yup.string().required("Details are required"),
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

  // AG Grid state
  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getCategories());
    dispatch(getStores());
    dispatch(fetchCountries()); 

  }, [dispatch]);

  const columnDefs = [
    { headerName: "Title", field: "dealTitle", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Countries",
      field: "country",
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params) =>
        Array.isArray(params.value)
          ? params.value.join(", ")
          : params.value || "—",
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
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Deals/Coupons Upload</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search deals..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={onFilterTextBoxChanged}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading Deals...</div>
      ) : deals?.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={deals}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            quickFilterText={searchText}
            pagination
            paginationPageSize={10}
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
              details: editDeal.details || '',
              categorySelect: editDeal.categorySelect || '',
              store: editDeal.store || '',
              couponCode: editDeal.couponCode || '',
              discount: editDeal.discount || '',
              expiredDate: editDeal.expiredDate ? new Date(editDeal.expiredDate).toISOString().split('T')[0] : '',
              redirectionLink: editDeal.redirectionLink || '', // <-- NEW FIELD
              country: editDeal.country || [], // ✅ Add this

            } : {
              dealTitle: '',
              dealDescription: '',
              dealImage: '',
              homePageTitle: '',
              dealType: '',
              dealCategory: 'coupon',
              showOnHomepage: false,
              details: '',
              categorySelect: '',
              store: '',
              couponCode: '',
              discount: '',
              expiredDate: '',
              redirectionLink: '', // <-- NEW FIELD
              country: [], // ✅ Add this

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
        {({ values }) => (
          <Form className="mt-10">
            <FieldArray name="deals">
              {({ push, remove }) => (
                <div className="space-y-10">
                  {values.deals.map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 p-6 rounded-lg shadow-sm relative bg-white"
                    >
                      <h2 className="text-xl font-semibold mb-4">Deal Entry</h2>

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
                        <label className="block mb-1 font-medium">Details (HTML Content)</label>
                        <Field as="textarea" name={`deals[${index}].details`} className="w-full px-3 py-2 border rounded-md" />
                        <ErrorMessage name={`deals[${index}].details`} component="div" className="text-red-500 text-sm mt-1" />
                      </div>

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
          {countries.length > 0 ? (
            countries.map((country) => {
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
