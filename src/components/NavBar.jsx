"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Person3Icon from "@mui/icons-material/Person3";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";

import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { searchDeals, clearSearchResults } from "../redux/deal/dealSlice";
import { logoutUser, checkCurrentUser } from "../redux/auth/authApi";
import { toast } from "react-toastify";

const baseNavLinks = [
  { name: "All Offers", href: "/allcoupons" },
  { name: "Stores", href: "/allstores" },
  { name: "All Categories", href: "/allcategories" },
  { name: "All Blogs", href: "/blogs" }
];

const adminLinks =  [
  { name: "Add Blogs", href: "/admin/blogs" },
  { name: "Add Offers", href: "/admin/deals" },
  { name: "Add Stores", href: "/admin/stores" },
  { name: "Add Categories", href: "/admin/category" },
  { name: "Contact List", href: "/admin/contact" },
  { name: "Add Home", href: "/admin/home" },
  { name: "Add Reviews", href: "/admin/review" },

];


const SearchBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})(({ scrolled }) => ({
  position: "relative",
  backgroundColor: scrolled ? "rgba(255,255,255,0.15)" : "#fff",
  padding: "8px 12px 8px 50px",
  borderRadius: "14px",
  border: scrolled ? "1px solid rgba(255,255,255,0.7)" : "1px solid #c9c9c9",
  width: "100%",
  maxWidth: scrolled ? 800 : "100%",
  display: "flex",
  alignItems: "center",
  transition: "all 0.4s ease",
  color: scrolled ? "#fff" : "inherit",
  boxShadow: scrolled ? "0 0 10px rgba(255,255,255,0.2)" : "none",
  marginTop: scrolled ? 0 : 8,
  marginLeft: scrolled ? 20 : 0,
  zIndex: 1500,
}));


const SearchIconWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "scrolled",
})(({ scrolled }) => ({
  position: "absolute",
  left: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  borderRadius: "8px",
  padding: "5px",
  background: scrolled ? "rgba(255,255,255,0.3)" : "#592EA9",
  transition: "all 0.4s ease",
}));

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== "scrolled",
})(({ scrolled }) => ({
  width: "100%",
  color: scrolled ? "#fff" : "inherit",
  "& input::placeholder": {
    color: scrolled ? "rgba(255,255,255,0.7)" : "#888",
  },
  transition: "color 0.4s ease",
}));


const SearchResultsContainer = styled(Box)(() => ({
  position: "absolute",
  top: "calc(100% + 5px)",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  border: "1px solid #c9c9c9",
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
  maxHeight: "300px",
  overflowY: "auto",
  zIndex: 9999,
}));

const SearchResultItem = styled(Box)(() => ({
  padding: "10px 15px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
  "&:last-child": {
    borderBottom: "none",
  },
}));

const NavBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { searchResults, loading } = useSelector((state) => state.deal);
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const isAdminMenuOpen = Boolean(adminAnchorEl);
  
  const handleAdminMenuOpen = (e) => setAdminAnchorEl(e.currentTarget);
  const handleAdminMenuClose = () => setAdminAnchorEl(null);
  const isAdmin = isAuthenticated && user?.role === "admin";
  const navLinks = isAdmin
  ?  adminLinks
  : baseNavLinks;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const open = Boolean(anchorEl);

  const searchBarRef = useRef();

  // Scroll handler for background + scrolled state
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 5;
      // Only update state if it actually changed
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Dispatch search with debounced term
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      dispatch(searchDeals(debouncedSearchTerm));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedSearchTerm, dispatch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults]);

  const handleResultClick = (deal) => {
    router.push(`/deal/${deal._id}?category=${deal.categorySelect}`);
    setShowResults(false);
    setSearchTerm("");
    dispatch(clearSearchResults());
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    router.push("/profilep");
    handleMenuClose();
  };

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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  

  return (
    <>
 <AppBar
  position="sticky"
  sx={{
    background: scrolled ? "#592EA9" : "rgba(255, 255, 255, 0.85)",
    color: scrolled ? "#fff" : "#000",
    backdropFilter: "blur(8px)",
    boxShadow: scrolled
      ? "0 4px 20px rgba(0, 0, 0, 0.3)"
      : "0 4px 20px rgba(0, 0, 0, 0.05)",
    zIndex: 1300,
    transition: "background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
  }}
>

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            position: "relative",
          }}
        >
          {/* Left: Logo */}
          <Box display="flex" alignItems="center" sx={{ flex: "0 0 auto" }}>
            <Link href="/" passHref>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  cursor: "pointer",
                  color: scrolled ? "#fff" : "#592EA9",
                  transition: "color 0.4s ease",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                MY COUPON STOCK
              </Typography>
            </Link>
          </Box>

          {/* Center: Search bar (only when scrolled) */}
          {scrolled && !isMobile && (
            <Box
              ref={searchBarRef}
              sx={{
                flex: "1 1 auto",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                marginX: 2,
                transition: "all 0.5s ease",
              }}
            >
              <SearchBar scrolled={scrolled}>
                <SearchIconWrapper scrolled={scrolled}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  scrolled={scrolled}
                  placeholder="Search for deals"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  fullWidth
                />
                {showResults && searchTerm && (
                  <SearchResultsContainer>
                    {loading ? (
                      <SearchResultItem>Loading...</SearchResultItem>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((deal) => (
                        <SearchResultItem
                          key={deal._id}
                          onClick={() => handleResultClick(deal)}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="textSecondary"
                          >
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
          )}

          {/* Right: Navigation & Icons */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 3,
                alignItems: "center",
                flex: "0 0 auto",
                color: scrolled ? "#fff" : "#333",
                transition: "color 0.4s ease",
              }}
            >
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} passHref>
                  <Typography
                    variant="body1"
                    sx={{
                      cursor: "pointer",
                      fontWeight: 500,
                      "&:hover": {
                        color: scrolled ? "#ddd" : "#592EA9",
                      },
                      transition: "color 0.4s ease",
                    }}
                  >
                    {link.name}
                  </Typography>
                </Link>
              ))}
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: scrolled ? "#fff" : "inherit" }}
                aria-label="profile menu"
              >
                <Person3Icon />
              </IconButton>
            </Box>
          )}

          {/* Mobile Icons */}
          {isMobile && (
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: scrolled ? "#fff" : "inherit" }}
                aria-label="profile menu"
              >
                <Person3Icon />
              </IconButton>
              <IconButton
  onClick={() => setDrawerOpen(prev => !prev)} // toggle drawer
  sx={{ color: scrolled ? "#fff" : "inherit" }}
  aria-label="toggle drawer"
>
  <MenuIcon />
</IconButton>


            </Box>
          )}
        </Toolbar>

        {/* Search bar below Nav (only when NOT scrolled and NOT mobile) */}
        {!scrolled && !isMobile && (
          <Box
            ref={searchBarRef}
            px={2}
            sx={{ position: "relative", pb: 1, transition: "all 0.5s ease" }}
          >
            <SearchBar scrolled={scrolled}>
              <SearchIconWrapper scrolled={scrolled}>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                scrolled={scrolled}
                placeholder="Search for deals"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
                fullWidth
              />
              {showResults && searchTerm && (
                <SearchResultsContainer>
                  {loading ? (
                    <SearchResultItem>Loading...</SearchResultItem>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((deal) => (
                      <SearchResultItem
                        key={deal._id}
                        onClick={() => handleResultClick(deal)}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="textSecondary"
                        >
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
        )}

        {/* Profile Menu */}
        
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {isAuthenticated ? (
            <>
              <MenuItem onClick={handleProfile} sx={{ gap: 1.5 }}>
                <Person3Icon fontSize="small" color="primary" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
                <LogoutIcon fontSize="small" color="error" />
                Logout
              </MenuItem>
            </>
          ) : (
            <MenuItem onClick={handleLogin} sx={{ gap: 1.5 }}>
              <LoginIcon fontSize="small" color="primary" />
              Login
            </MenuItem>
          )}
        </Menu>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box width={260} p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" color="#592EA9">
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
  <CloseIcon />
</IconButton>

          </Box>
          <Divider sx={{ my: 2 }} />
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
