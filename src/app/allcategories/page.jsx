"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Banner from "@/components/Minor/Banner";
import TextLink from "@/components/Minor/TextLink";
import CategoryCard from "@/components/cards/CategoryCard";
import HeadingText from "@/components/Minor/HeadingText";
import { getCategories, searchCategories, clearSearchResults } from "@/redux/category/categorySlice";
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

const AllCategories = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { categories, searchResults, loading } = useSelector((state) => state.category);
  const homeAdmin = useSelector((state) => state.homeAdmin) || {};
  const data = (homeAdmin.data && homeAdmin.data[0]) || {};

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const alphabet = ["All", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getHomeAdminData());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchCategories(debouncedSearchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  useEffect(() => {
    filterCategoriesByLetter(selectedLetter);
  }, [categories, selectedLetter]);

  const filterCategoriesByLetter = (letter) => {
    if (!categories || categories.length === 0) {
      setFilteredCategories([]);
      return;
    }
    if (letter === "All") setFilteredCategories(categories);
    else
      setFilteredCategories(
        categories.filter((cat) =>
          cat.name?.toLowerCase().startsWith(letter.toLowerCase())
        )
      );
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm("");
    dispatch(clearSearchResults());
    setShowSearchDropdown(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedLetter("All");
  };

  const handleSearchFocus = () => setShowSearchDropdown(true);

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchDropdown(false), 200);
  };

  const handleSearchResultClick = (categoryId) => {
    router.push(`/category?name=${categoryId}`);
    setSearchTerm("");
    dispatch(clearSearchResults());
    setShowSearchDropdown(false);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Banner */}
      <Banner
        Text="Every day we the most interesting things"
        ColorText="discuss"
        BgImage={data.allCategoriesPageBanner}
      />

      {/* Popular Categories */}
      <TextLink text="Popular Categories" colorText="" link="" linkText="" />
      <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {categories && categories.length > 0 ? (
          categories
            .filter((cat) => cat.popularStore)
            .map((cat) => <CategoryCard key={cat._id} data={cat} />)
        ) : (
          <p className="text-center w-full">No popular categories found.</p>
        )}
      </div>

      {/* Filter & Search */}
      <div className="w-full px-4 md:px-8 py-2 flex flex-col gap-4 my-6">
        <div className="flex justify-between items-center">
          <Typography variant="body1" fontWeight="bold" className="text-lg">
            See All <Typography color="#592ea9" display="inline">categories</Typography>
          </Typography>

          <Box className="flex items-center gap-2 relative">
            <IconButton className="!bg-[#592EA9] !rounded-lg hover:opacity-80">
              <SearchIcon className="text-white" />
            </IconButton>
            <StyledSearchInput
              placeholder="Search categories..."
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
                  searchResults.map((cat) => (
                    <SearchResultItem key={cat._id} onClick={() => handleSearchResultClick(cat.name)}>
                      <Typography variant="body2" fontWeight="bold">{cat.name}</Typography>
                    </SearchResultItem>
                  ))
                ) : (
                  <SearchResultItem>No categories found.</SearchResultItem>
                )}
              </SearchResultsContainer>
            )}
          </Box>
        </div>

        {/* Alphabet Filter */}
        <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex gap-2">
            {alphabet.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(letter)}
                className={`px-4 py-2 rounded-[10px] border ${
                  letter === selectedLetter
                    ? "bg-[#592EA9] text-white"
                    : "border-gray-400 text-gray-700"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* All Categories */}
      <div className="px-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => <CategoryCard key={cat._id} data={cat} />)
        ) : (
          <p className="text-center w-full col-span-full">
            {loading ? "Loading categories..." : "No categories found matching your criteria."}
          </p>
        )}
      </div>

      {/* About Section */}
      <HeadingText
        title={data.allCategoriesAboutHeading}
        content={data.allCategoriesAboutDescription}
        isHtml={true}
      />
    </div>
  );
};

export default AllCategories;
