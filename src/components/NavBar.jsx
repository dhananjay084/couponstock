"use client";

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import Person3Icon from "@mui/icons-material/Person3";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import Link from "next/link"; // <-- Next.js Link
import { useRouter } from "next/navigation"; // <-- Next.js router
import { useDispatch, useSelector } from "react-redux";
import { searchDeals, clearSearchResults } from "../redux/deal/dealSlice";
import { logoutUser, checkCurrentUser } from "../redux/auth/authApi";
import { toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";


const SearchBar = styled(Box)(() => ({
  backgroundColor: "#fff",
  padding: "10px 12px",
  borderRadius: "14px",
  border: "1px solid #c9c9c9",
  width: "100%",
  marginTop: "8px",
  position: "relative",
  display: "flex",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(() => ({
  position: "absolute",
  left: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  borderRadius: "8px",
  padding: "5px",
  background: "#592EA9",
}));

const StyledInputBase = styled(InputBase)(() => ({
  width: "100%",
  paddingLeft: "40px",
}));

const SearchResultsContainer = styled(Box)(() => ({
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

const SearchResultItem = styled(Box)(() => ({
  padding: "10px 15px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&:last-child": {
    borderBottom: "none",
  },
}));

const NavBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { searchResults, loading } = useSelector((state) => state.deal);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchDeals(debouncedSearchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleResultClick = (deal) => {
    router.push(`/deal/${deal._id}?category=${deal.categorySelect}`);
    setShowResults(false);
    setSearchTerm("");
    dispatch(clearSearchResults());
    //  toast.success(`Navigated to ${deal.dealTitle}`);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    router.push("/profilep");
    handleMenuClose();
  };


  let logoutToastFired = false;

  // const handleLogout = async () => {
     
  //   handleMenuClose();
  //   try {
  //     await dispatch(logoutUser()).unwrap();
  //     router.push("/login");
  
  //   } catch (e) {
  //     toast.error("Logout failed. Try again!");
  //     console.error("Logout error:", e);
  //   }
  // };
  const handleLogout = async () => {
  handleMenuClose();

  dispatch(logoutUser())
    .unwrap()
    .then(() => {
      toast.success("Logged out successfully");
      router.push("/login");
    })
    .catch(() => toast.error("Logout failed. Try again!"));
};


  const handleLogin = () => {
    router.push("/login");
    handleMenuClose();
    toast.info("Please login to continue");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none", padding: "10px 0" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", color: "black" }}>
        <Box display="flex" alignItems="center">
          <Link href="/" >
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="#592ea9"
              sx={{ cursor: "pointer", textDecoration: "none" }}
            >
              MY COUPON STOCK
            </Typography>
          </Link>
        </Box>

        <IconButton onClick={handleMenuOpen}>
          <Person3Icon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {isAuthenticated ? (
            <>
              <MenuItem onClick={handleProfile} style={{ cursor: 'pointer' }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}><Person3Icon fontSize="small" color="primary" />
                Profile</MenuItem>
              <MenuItem onClick={handleLogout} style={{ cursor: 'pointer' }} sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontWeight: 500,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}> <LogoutIcon fontSize="small" color="error" />
                Logout</MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLogin} style={{ cursor: 'pointer' }} sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontWeight: 500,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}> <LoginIcon fontSize="small" color="primary" />
              Login</MenuItem>
          )}
        </Menu>
      </Toolbar>

      <Box px={2} sx={{ position: "relative" }}>
        <SearchBar>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search for deals"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            fullWidth
          />
          {showResults && searchTerm && (
            <SearchResultsContainer>
              {loading ? (
                <SearchResultItem>Loading...</SearchResultItem>
              ) : searchResults.length > 0 ? (
                searchResults.map((deal) => (
                  <SearchResultItem key={deal._id} onClick={() => handleResultClick(deal)}>
                    <Typography variant="body2" fontWeight="bold" color="textSecondary">
                      {deal.dealTitle}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {deal.store}
                    </Typography>
                  </SearchResultItem>
                ))
              ) : (
                <SearchResultItem>No deals found.</SearchResultItem>
              )}
            </SearchResultsContainer>
          )}
        </SearchBar>
      </Box>
    </AppBar>
  );
};

export default NavBar;
