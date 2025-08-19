"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Banner from "@/components/Minor/Banner";
import TextLink from "@/components/Minor/TextLink";
import HeadingText from "@/components/Minor/HeadingText";
import PopularBrandCard from "@/components/cards/PopularBrandWithTitle";
import { getStores, searchStores, clearSearchResults } from "@/redux/store/storeSlice";
import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";
import { IconButton, Typography, InputBase, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

// Styled InputBase for search
const StyledSearchInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: theme.spacing(1),
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #c9c9c9",
  backgroundColor: "#fff",
}));

// Search Results Dropdown
const SearchResultsContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 5px)",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  border: "1px solid #c9c9c9",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  maxHeight: "300px",
  overflowY: "auto",
  zIndex: 999,
}));

const SearchResultItem = styled(Box)(({ theme }) => ({
  padding: "10px 15px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  "&:hover": { backgroundColor: "#f5f5f5" },
  "&:last-child": { borderBottom: "none" },
}));

const AllStores = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { stores = [], searchResults = [], loading, error } = useSelector((state) => state.store);
  const homeAdmin = useSelector((state) => state.homeAdmin) || { data: [] };
  const data = homeAdmin.data?.[0] || {};

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Fetch stores and home admin data on mount
  useEffect(() => {
    dispatch(getStores());
    dispatch(getHomeAdminData());
  }, [dispatch]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Dispatch search API
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchStores(debouncedSearchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm("");
    dispatch(clearSearchResults());
    setShowSearchDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory("All");
  };

  const handleSearchFocus = () => setShowSearchDropdown(true);
  const handleSearchBlur = () => setTimeout(() => setShowSearchDropdown(false), 200);

  const handleSearchResultClick = (storeId) => {
    router.push(`/store/${storeId}`);
    setSearchTerm("");
    dispatch(clearSearchResults());
    setShowSearchDropdown(false);
  };

  const categories = ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  const finalFilteredStores =
    selectedCategory === "All"
      ? stores
      : stores.filter((store) => store.storeName?.toLowerCase().startsWith(selectedCategory.toLowerCase()));

  return (
    <div>
      <Banner Text="Every day we the most interesting things" ColorText="discuss" BgImage={data.allStoresPageBanner} />
      <TextLink text="Popular" colorText="Stores" link="" linkText="" />

      {loading && <p className="text-center text-lg font-medium">Loading stores...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}

      {/* Popular Stores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 mb-6">
        {stores.filter((store) => store.popularStore).map((store) => (
          <PopularBrandCard key={store._id} data={store} />
        ))}
      </div>

      {/* Filter & Search */}
      <div className="w-full px-4 md:px-8 py-2 flex flex-col gap-4 my-4">
        <div className="flex justify-between items-center">
          <Typography variant="body1" fontWeight="bold" className="text-lg">
            See All <Typography color="#592ea9" display="inline">stores</Typography>
          </Typography>

          <Box className="flex items-center gap-2 relative">
            <IconButton className="!bg-[#592EA9] !rounded-lg hover:opacity-80 ">
              <SearchIcon className="text-white" />
            </IconButton>
            <StyledSearchInput
              placeholder="Search stores..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />

            {showSearchDropdown && searchTerm.length > 0 && (
              <SearchResultsContainer>
                {loading ? (
                  <SearchResultItem>Loading...</SearchResultItem>
                ) : searchResults.length > 0 ? (
                  searchResults.map((store) => (
                    <SearchResultItem key={store._id} onClick={() => handleSearchResultClick(store._id)}>
                      <Typography variant="body2" fontWeight="bold">{store.storeName}</Typography>
                      <Typography variant="caption" color="textSecondary">{store.storeType}</Typography>
                    </SearchResultItem>
                  ))
                ) : (
                  <SearchResultItem>No stores found.</SearchResultItem>
                )}
              </SearchResultsContainer>
            )}
          </Box>
        </div>

        {/* Alphabet Filter */}
        <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex gap-2">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-[10px] border cursor-pointer ${
                  category === selectedCategory ? "bg-[#592EA9] text-white" : "border-gray-400 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered Stores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 mb-10">
        {finalFilteredStores.length === 0 && !loading ? (
          <p className="text-center col-span-full text-gray-600">No stores found matching your criteria.</p>
        ) : (
          finalFilteredStores.map((store) => <PopularBrandCard key={store._id} data={store} />)
        )}
      </div>

      <HeadingText
        title={data.allStoresAboutHeading}
        content={data.allStoresAboutDescription}
        isHtml={true}
      />
    </div>
  );
};

export default AllStores;
