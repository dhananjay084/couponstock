"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addDeal, getDeals, deleteDeal, updateDeal } from "@/redux/deal/dealSlice";
import { toast, ToastContainer } from "react-toastify";
import { getCategories } from "@/redux/category/categorySlice";
import { getStores } from "@/redux/store/storeSlice";

import "react-toastify/dist/ReactToastify.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// AG Grid modules
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

// Yup validation schema
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
    })
  ),
});

const DealsPage = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deal);
  const { categories } = useSelector((state) => state.category);
  const { stores } = useSelector((state) => state.store);
  const [editDeal, setEditDeal] = useState(null);

  // AG Grid state
  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getDeals());
    dispatch(getCategories());
    dispatch(getStores());
  }, [dispatch]);

  const columnDefs = [
    { headerName: "Title", field: "dealTitle", sortable: true, filter: true, flex: 1 },
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
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
          >
            Delete
          </button>
          <button
            onClick={() => handleEdit(params.data)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
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
      toast.success("Deal deleted!");
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
      toast.success("Deal updated!");
      dispatch(getDeals());
      resetForm();
      setEditDeal(null);
    } catch (error) {
      toast.error(`Failed to update deal: ${error.message || "Unknown error"}`);
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


                      <div className="mb-4 flex items-center gap-2">
                        <Field type="checkbox" name={`deals[${index}].showOnHomepage`} className="mr-2" />
                        <label className="font-medium">Show on Homepage?</label>
                      </div>

                      {values.deals.length > 1 && !editDeal && (
                        <button
                          type="button"
                          className="text-red-600 mt-2 underline text-sm absolute top-4 right-4"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}


                  <div className="mt-8">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
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
