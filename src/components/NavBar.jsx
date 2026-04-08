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
import {
  searchStores,
  clearSearchResults as clearStoreSearchResults,
} from "../redux/store/storeSlice";
import { logoutUser, checkCurrentUser } from "../redux/auth/authApi";
import { fetchCountries, setSelectedCountry } from "../redux/country/countrySlice";
import { toast } from "react-toastify";
import { addCountryPrefix, getCountryCodeFromName, isAllowedCountryCode } from "../lib/countryPath";
import { titleize } from "../lib/slugify";
import globeImage from "../assets/globe.png";

const baseNavLinks = [
  { name: "All Offers", href: "/deals" },
  { name: "Stores", href: "/store" },
  { name: "All Categories", href: "/category" },
  { name: "All Blogs", href: "/blogs" },
  { name: "Submit Coupon", href: "/submit-coupon" }
];

const adminLinks =  [
  { name: "Add Blogs", href: "/admin/blogs" },
  { name: "Add Offers", href: "/admin/deals" },
  { name: "Add Stores", href: "/admin/stores" },
  { name: "Add Categories", href: "/admin/category" },
  { name: "Contact List", href: "/admin/contact" },
  { name: "Add Home", href: "/admin/home" },
  { name: "Add Reviews", href: "/admin/review" },
  { name: "Coupon Submissions", href: "/admin/submissions" },

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
  background: "linear-gradient(180deg, #FFFFFF 0%, #FCFAFF 100%)",
  border: "1px solid #E9DFFF",
  borderRadius: "14px",
  boxShadow: "0 14px 30px rgba(89, 46, 169, 0.16)",
  maxHeight: "420px",
  overflowY: "auto",
  zIndex: 9999,
}));

const SearchResultsGrid = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  "@media (min-width: 900px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
}));

const SearchResultItem = styled(Box)(() => ({
  padding: "12px",
  borderBottom: "1px solid #EEE8FA",
  cursor: "pointer",
  background: "transparent",
  transition: "background 0.2s ease, transform 0.2s ease",
  "&:hover": {
    backgroundColor: "#F8F3FF",
    transform: "translateY(-1px)",
  },
  "&:last-child": {
    borderBottom: "none",
  },
}));

const SearchResultsHeader = styled(Box)(() => ({
  position: "sticky",
  top: 0,
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderBottom: "1px solid #EEE8FA",
  background: "rgba(255,255,255,0.96)",
  backdropFilter: "blur(6px)",
}));

const ResultChip = styled(Box)(() => ({
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#5F3F9A",
  background: "#F1E8FF",
  border: "1px solid #E2D0FF",
  borderRadius: "999px",
  padding: "2px 8px",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
}));

const NavBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { searchResults, loading } = useSelector((state) => state.store || {});
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { countries = [], selectedCountry } = useSelector((state) => state.country || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [countryOpen, setCountryOpen] = useState(false);
  const isAdminMenuOpen = Boolean(adminAnchorEl);
  
  const handleAdminMenuOpen = (e) => setAdminAnchorEl(e.currentTarget);
  const handleAdminMenuClose = () => setAdminAnchorEl(null);
  const isAdmin =
    isAuthenticated &&
    typeof user?.role === "string" &&
    user.role.toLowerCase() === "admin";
  const navLinks = isAdmin
  ?  adminLinks
  : baseNavLinks;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const open = Boolean(anchorEl);

  const searchBarRef = useRef();
  const countryRef = useRef();
  const scrollRafRef = useRef(null);
  const lastSearchKeyRef = useRef("");

  // Scroll handler for background + scrolled state
  useEffect(() => {
    const SCROLL_ON = 12;
    const SCROLL_OFF = 4;
    const handleScroll = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrolled((prev) => {
          if (prev && y <= SCROLL_OFF) return false;
          if (!prev && y >= SCROLL_ON) return true;
          return prev;
        });
        scrollRafRef.current = null;
      });
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  
  

  useEffect(() => {
    dispatch(checkCurrentUser());
  }, [dispatch]);
  
  useEffect(() => {
    if (!countries.length) dispatch(fetchCountries());
  }, [dispatch, countries.length]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Dispatch store search only for new typed queries (debounced).
  useEffect(() => {
    const query = debouncedSearchTerm.trim();
    if (!query) {
      if (lastSearchKeyRef.current) {
        dispatch(clearStoreSearchResults());
        lastSearchKeyRef.current = "";
      }
      return;
    }

    const key = `${selectedCountry || "all"}::${query.toLowerCase()}`;
    if (lastSearchKeyRef.current === key) {
      return;
    }
    lastSearchKeyRef.current = key;
    dispatch(
      searchStores({
        searchTerm: query,
        country: selectedCountry || undefined,
      })
    );
  }, [debouncedSearchTerm, dispatch, selectedCountry]);

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

  const handleResultClick = (store) => {
    if (!store?.slug) {
      toast.error("Store not found");
      return;
    }
    router.push(withCountry(`/store/${encodeURIComponent(store.slug)}`));
    setShowResults(false);
    setSearchTerm("");
    dispatch(clearStoreSearchResults());
  };

  const clipText = (value, max = 68) => {
    const text = String(value || "").trim();
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  const countryLabel = (countryValue) => {
    if (Array.isArray(countryValue) && countryValue.length > 0) {
      const firstTwo = countryValue.filter(Boolean).slice(0, 2);
      return firstTwo.join(", ");
    }
    if (typeof countryValue === "string" && countryValue.trim()) {
      return countryValue.trim();
    }
    return selectedCountry || "Global";
  };

  const renderResultsHeader = () => (
    <SearchResultsHeader>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#3D2869" }}>
        Matching Stores
      </Typography>
      <Typography sx={{ fontSize: "0.72rem", color: "#7D68A8", fontWeight: 600 }}>
        {searchResults.length} result{searchResults.length === 1 ? "" : "s"}
      </Typography>
    </SearchResultsHeader>
  );

  const renderStoreCard = (store, onClick, compact = false) => (
    <SearchResultItem key={store._id} onClick={onClick}>
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
        <Box display="flex" alignItems="center" gap={1.2} minWidth={0}>
          <Box
            component="img"
            src={store.storeImage || "/default-store.jpg"}
            alt={store.storeName || "Store"}
            sx={{
              width: compact ? 34 : 40,
              height: compact ? 34 : 40,
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid #E7DBFF",
              flexShrink: 0,
              background: "#fff",
            }}
          />
          <Box minWidth={0}>
            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                color: "#2E1B59",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {store.storeName || "Store"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#7E6AAB",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                mt: 0.2,
              }}
            >
              {clipText(store.homePageTitle || store.storeDescription || "Explore store offers", 44)}
            </Typography>
          </Box>
        </Box>
        {typeof store.discountPercentage === "number" && (
          <ResultChip>{store.discountPercentage}% OFF</ResultChip>
        )}
      </Box>

      <Typography
        sx={{
          mt: 0.8,
          ml: compact ? "46px" : "52px",
          fontSize: "0.74rem",
          color: "#5F4A87",
          lineHeight: 1.35,
          display: compact ? "none" : "block",
        }}
      >
        {clipText(store.storeDescription || "Top coupons and offers available.", 84)}
      </Typography>

      <Box
        sx={{
          mt: compact ? 0.7 : 0.9,
          ml: compact ? "46px" : "52px",
          display: "flex",
          gap: 0.8,
          flexWrap: "wrap",
        }}
      >
        {store.storeType && <ResultChip>{store.storeType}</ResultChip>}
        <ResultChip>{countryLabel(store.country)}</ResultChip>
      </Box>
    </SearchResultItem>
  );

  const handleCountryChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    dispatch(setSelectedCountry(value));
  };

  const selectCountry = (value) => {
    if (!value) return;
    dispatch(setSelectedCountry(value));
    setCountryOpen(false);
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

  const allowedCountries = Object.values(
    countries.reduce((acc, c) => {
      const name = (c.country_name || "").trim();
      if (!name) return acc;
      const key = name.toLowerCase();
      if (!acc[key]) {
        acc[key] = { ...c, code: getCountryCodeFromName(name) };
      } else {
        const existingName = acc[key].country_name || "";
        const existingIsTitle = existingName === titleize(existingName.toLowerCase());
        const nextIsTitle = name === titleize(name.toLowerCase());
        if (!existingIsTitle && nextIsTitle) {
          acc[key] = { ...c, code: getCountryCodeFromName(name) };
        }
      }
      return acc;
    }, {})
  ).filter((c) => isAllowedCountryCode(c.code));

  const selectedCode = selectedCountry ? getCountryCodeFromName(selectedCountry) : "";
  const selectedFlagCode = selectedCode === "uk" ? "gb" : selectedCode;
  const getFlagUrl = (code) => {
    const flagCode = code === "uk" ? "gb" : code;
    return flagCode ? `https://flagcdn.com/w20/${flagCode}.png` : "";
  };
  const isGlobalCode = (code) => String(code || "").toLowerCase() === "gl";
  const renderCountryIcon = (code, altText) => {
    if (isGlobalCode(code)) {
      return (
        <Box
          component="img"
          src={globeImage?.src || globeImage}
          alt="Global"
          sx={{ width: 18, height: 18, borderRadius: "50%" }}
        />
      );
    }
    return (
      <Box
        component="img"
        src={getFlagUrl(code)}
        alt={altText}
        sx={{ width: 18, height: 12, borderRadius: "2px" }}
      />
    );
  };

  const withCountry = (href) => {
    if (!href) return href;
    if (href.startsWith("/admin")) return href;
    return addCountryPrefix(href, selectedCountry || "");
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
            <Link href={withCountry("/")} passHref>
            <Typography
  variant={isMobile ? "subtitle1" : "h6"}
  fontWeight="bold"
  sx={{
    cursor: "pointer",
    color: scrolled ? "#fff" : "#592EA9",
    transition: "color 0.4s ease",
    "&:hover": { opacity: 0.8 },
    fontSize: isMobile ? "1rem" : "1.25rem", // slightly smaller on mobile
  }}
>
                MY COUPON STOCK
              </Typography>
            </Link>
            {selectedCountry && (
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  color: scrolled ? "rgba(255,255,255,0.9)" : "#592EA9",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {selectedCountry}
              </Typography>
            )}
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
                  placeholder="Search for stores"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  fullWidth
                />
                {showResults && searchTerm && (
                  <SearchResultsContainer>
                    {loading ? (
                      <SearchResultItem>
                        <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                          Searching stores...
                        </Typography>
                      </SearchResultItem>
                    ) : searchResults.length > 0 ? (
                      <>
                        {renderResultsHeader()}
                        <SearchResultsGrid>
                          {searchResults.map((store) =>
                            renderStoreCard(store, () => handleResultClick(store), false)
                          )}
                        </SearchResultsGrid>
                      </>
                    ) : (
                      <SearchResultItem>
                        <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                          No stores found.
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#8E7AAE" }}>
                          Try a different keyword like brand name or category.
                        </Typography>
                      </SearchResultItem>
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
              <Box ref={countryRef} sx={{ position: "relative" }}>
                <Box
                  onClick={() => setCountryOpen((v) => !v)}
                  sx={{
                    cursor: "pointer",
                    border: "1px solid #D9CCF5",
                    borderRadius: "10px",
                    px: 1.5,
                    py: 0.75,
                    fontSize: "0.85rem",
                    background: "#fff",
                    color: "#2b1c4d",
                    minWidth: 140,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {selectedCode &&
                      renderCountryIcon(
                        selectedFlagCode,
                        `${selectedCountry || "Country"} flag`
                      )}
                    <span>{selectedCountry || "Select Country"}</span>
                  </Box>
                  <span style={{ fontSize: "0.75rem", color: "#592EA9" }}>▼</span>
                </Box>
                {countryOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      right: 0,
                      width: 200,
                      maxHeight: 260,
                      overflowY: "auto",
                      bgcolor: "#fff",
                      border: "1px solid #E4D8FF",
                      borderRadius: "12px",
                      boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
                      zIndex: 2000,
                    }}
                  >
                    {allowedCountries.map((c) => (
                      <Box
                        key={c._id}
                        onClick={() => selectCountry(c.country_name)}
                        sx={{
                          px: 2,
                          py: 1,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          color: "#2b1c4d",
                          "&:hover": { background: "#F5F1FF" },
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {c.code &&
                          renderCountryIcon(c.code, `${c.country_name} flag`)}
                        {c.country_name}
                      </Box>
                    ))}
                    {allowedCountries.length === 0 && (
                      <Box sx={{ px: 2, py: 1, fontSize: "0.85rem", color: "#777" }}>
                        No countries found
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
              {navLinks.map((link) => (
                <Link key={link.name} href={withCountry(link.href)} passHref>
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
  onClick={() => setDrawerOpen(prev => !prev)}
  sx={{
    color: scrolled ? "#fff" : "inherit",
    transition: "transform 0.3s ease, opacity 0.3s ease",
    transform: drawerOpen ? "rotate(180deg)" : "rotate(0deg)",
  }}
  aria-label="toggle drawer"
>
  <Box
    sx={{
      position: "relative",
      width: 24,
      height: 24,
    }}
  >
    <MenuIcon
      sx={{
        position: "absolute",
        inset: 0,
        opacity: drawerOpen ? 0 : 1,
        transform: drawerOpen ? "scale(0.8)" : "scale(1)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    />
    <CloseIcon
      sx={{
        position: "absolute",
        inset: 0,
        opacity: drawerOpen ? 1 : 0,
        transform: drawerOpen ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    />
  </Box>
</IconButton>



            </Box>
          )}
        </Toolbar>

        {/* Search bar below Nav (only when NOT scrolled and NOT mobile) */}
       {/* Search bar below Nav (visible on all screens when not scrolled) */}
       {!scrolled && !isMobile && (
  <Box
    ref={searchBarRef}
    px={isMobile ? 1 : 2}
    sx={{
      position: "relative",
      pb: 1,
      transition: "all 0.5s ease",
      width: "100%",
    }}
  >
    <SearchBar scrolled={scrolled}>
      <SearchIconWrapper scrolled={scrolled}>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        scrolled={scrolled}
        placeholder="Search stores"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowResults(true)}
        fullWidth
      />
      {showResults && searchTerm && (
        <SearchResultsContainer>
          {loading ? (
            <SearchResultItem>
              <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                Searching stores...
              </Typography>
            </SearchResultItem>
          ) : searchResults.length > 0 ? (
            <>
              {renderResultsHeader()}
              <SearchResultsGrid>
                {searchResults.map((store) =>
                  renderStoreCard(store, () => handleResultClick(store), false)
                )}
              </SearchResultsGrid>
            </>
          ) : (
            <SearchResultItem>
              <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                No stores found.
              </Typography>
              <Typography variant="caption" sx={{ color: "#8E7AAE" }}>
                Try a different keyword like brand name or category.
              </Typography>
            </SearchResultItem>
          )}
        </SearchResultsContainer>
      )}
    </SearchBar>
  </Box>
)}


        {/* Profile Menu */}
        
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {isAuthenticated ? (
            <Box>
              <MenuItem onClick={handleProfile} sx={{ gap: 1.5 }}>
                <Person3Icon fontSize="small" color="primary" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5 }}>
                <LogoutIcon fontSize="small" color="error" />
                Logout
              </MenuItem>
            </Box>
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

    <Box sx={{ mb: 2 }}>
      <Box
        onClick={() => setCountryOpen((v) => !v)}
        sx={{
          cursor: "pointer",
          border: "1px solid #D9CCF5",
          borderRadius: "10px",
          px: 2,
          py: 1.2,
          fontSize: "0.9rem",
          background: "#fff",
          color: "#2b1c4d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {selectedCode &&
            renderCountryIcon(
              selectedFlagCode,
              `${selectedCountry || "Country"} flag`
            )}
          <span>{selectedCountry || "Select Country"}</span>
        </Box>
        <span style={{ fontSize: "0.75rem", color: "#592EA9" }}>▼</span>
      </Box>
      {countryOpen && (
        <Box
          sx={{
            mt: 1,
            maxHeight: 260,
            overflowY: "auto",
            bgcolor: "#fff",
            border: "1px solid #E4D8FF",
            borderRadius: "12px",
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
          }}
        >
          {allowedCountries.map((c) => (
            <Box
              key={c._id}
              onClick={() => {
                selectCountry(c.country_name);
                setDrawerOpen(false);
              }}
              sx={{
                px: 2,
                py: 1,
                fontSize: "0.9rem",
                cursor: "pointer",
                color: "#2b1c4d",
                "&:hover": { background: "#F5F1FF" },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {c.code && renderCountryIcon(c.code, `${c.country_name} flag`)}
              {c.country_name}
            </Box>
          ))}
          {allowedCountries.length === 0 && (
            <Box sx={{ px: 2, py: 1, fontSize: "0.9rem", color: "#777" }}>
              No countries found
            </Box>
          )}
        </Box>
      )}
    </Box>

    {/* 🔍 Search bar inside Drawer (mobile only) */}
    <Box
      ref={searchBarRef}
      sx={{
        position: "relative",
        mb: 2,
      }}
    >
      <SearchBar scrolled={false}>
        <SearchIconWrapper scrolled={false}>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          scrolled={false}
          placeholder="Search stores"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          fullWidth
        />
        {showResults && searchTerm && (
          <SearchResultsContainer>
            {loading ? (
              <SearchResultItem>
                <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                  Searching stores...
                </Typography>
              </SearchResultItem>
            ) : searchResults.length > 0 ? (
              <>
                {renderResultsHeader()}
                {searchResults.map((store) =>
                  renderStoreCard(
                    store,
                    () => {
                      handleResultClick(store);
                      setDrawerOpen(false);
                    },
                    true
                  )
                )}
              </>
            ) : (
              <SearchResultItem>
                <Typography variant="body2" sx={{ color: "#5F4A87", fontWeight: 600 }}>
                  No stores found.
                </Typography>
                <Typography variant="caption" sx={{ color: "#8E7AAE" }}>
                  Try a different keyword.
                </Typography>
              </SearchResultItem>
            )}
          </SearchResultsContainer>
        )}
      </SearchBar>
    </Box>

    <List>
      {navLinks.map((item) => (
        <ListItem key={item.name} disablePadding>
          <ListItemButton
            component={Link}
            href={withCountry(item.href)}
            onClick={() => setDrawerOpen(false)}
          >
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
