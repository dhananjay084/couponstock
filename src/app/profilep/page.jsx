"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

import HeadingText from "../../components/Minor/HeadingText";
import { addReview } from "../../redux/review/reviewSlice";
import { fetchReferralLink, fetchMyReferrals } from "../../redux/referral/referralSlice";
import { checkCurrentUser, updateCurrentUser, updatePassword } from "../../redux/auth/authApi";
import { uploadImage } from "../../lib/uploadImage";

import {
  FaCamera,
  FaCopy,
  FaEdit,
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaPhoneAlt,
  FaSearch,
  FaShareAlt,
  FaTimes,
  FaUserCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const DEFAULT_REVIEW_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/219/219988.png";

const couponContent = `
  <div style="line-height: 1.7; font-size: 15px; color:#444;">
    <ul style="list-style: disc; padding-left: 18px; margin-top: 8px;">
      <li>
        Receive <strong>₹5,000 worth of Welcome e-Gift vouchers</strong> from top
        brands like Yatra, Pantaloons, Hush Puppies, and Shoppers Stop.
      </li>
      <li>
        Get <strong>free movie tickets worth ₹6,000 every year</strong>.<br/>
        Valid for <strong>2 tickets per booking per month</strong>.<br/>
        Maximum discount: <strong>₹500 for 2 tickets</strong>.
      </li>
      <li>
        Earn <strong style="color:#592EA9;">5X Reward Points</strong> on Dining,
        Departmental Stores, and Grocery spends.
      </li>
      <li>
        Earn <strong>2 Reward Points</strong> per ₹100 on all other spends
        <span style="color:#777;">(except fuel)</span>.
      </li>
      <li>
        <strong>1% fuel surcharge waiver</strong> at all fuel stations for transactions
        between ₹500 – ₹4,000.<br/>
        Maximum benefit: <strong>₹250/month</strong>.
      </li>
      <li>
        Enjoy <strong>6 complimentary International Airport lounge visits</strong>
        every year <span style="color:#666;">(2 visits per quarter)</span>.
      </li>
      <li>
        Get <strong>2 complimentary Domestic Airport lounge visits</strong> every quarter.
      </li>
      <li>
        Lowest <strong>1.99% Forex Mark-up Fee</strong> on international transactions.
      </li>
    </ul>
  </div>
`;

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://example.com";

  const { user: authUser, loading: authLoading } = useSelector((state) => state.auth || {});

  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [cookieUser, setCookieUser] = useState({
    name: "",
    email: "",
    id: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    dispatch(checkCurrentUser())
      .unwrap()
      .catch(() => {
        const cookieName = Cookies.get("userName");
        const cookieEmail = Cookies.get("userEmail");
        const cookieId = Cookies.get("userId");
        if (!cookieName && !cookieEmail && !cookieId) {
          router.replace("/");
        }
      });
  }, [dispatch, isMounted, router]);

  useEffect(() => {
    if (!isMounted) return;
    setCookieUser({
      name: Cookies.get("userName") || "",
      email: Cookies.get("userEmail") || "",
      id: Cookies.get("userId") || "",
    });
  }, [isMounted, authUser]);

  useEffect(() => {
    if (!isMounted) return;

    dispatch(fetchMyReferrals())
      .unwrap()
      .then((data) => {
        setReferrals(Array.isArray(data?.referrals) ? data.referrals : []);
      })
      .catch((err) => {
        console.error("Failed to fetch referrals:", err);
      });

    dispatch(fetchReferralLink())
      .unwrap()
      .then((data) => {
        setReferralLink(data?.referralLink || `${SERVER_URL}/signup`);
      })
      .catch(() => {
        setReferralLink(`${SERVER_URL}/signup`);
      });
  }, [dispatch, isMounted, SERVER_URL]);

  useEffect(() => {
    setProfileForm((prev) => ({
      name: authUser?.name || cookieUser.name || prev.name,
      email: authUser?.email || cookieUser.email || prev.email,
      phone: authUser?.phone || "",
      avatar: authUser?.avatar || "",
    }));
    setAvatarPreview(authUser?.avatar || "");
  }, [authUser, cookieUser.email, cookieUser.name]);

  const filteredReferrals = useMemo(() => {
    if (!searchValue.trim()) return referrals;
    const normalizedSearch = searchValue.toLowerCase();
    return referrals.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const email = String(item?.email || "").toLowerCase();
      return name.includes(normalizedSearch) || email.includes(normalizedSearch);
    });
  }, [referrals, searchValue]);

  const activeUser = useMemo(() => {
    const normalizedName = authUser?.name || cookieUser.name || "User";
    const normalizedEmail = authUser?.email || cookieUser.email || "";

    return {
      name: normalizedName,
      email: normalizedEmail,
      phone: authUser?.phone || "",
      avatar: avatarPreview || authUser?.avatar || "",
      designation: "User",
      authProvider: authUser?.authProvider || "local",
      socialProvider: authUser?.socialProvider || "",
    };
  }, [authUser, avatarPreview, cookieUser.email, cookieUser.name]);

  const initials = useMemo(() => {
    return String(activeUser.name || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [activeUser.name]);

  const isNormalSignupAccount = activeUser.authProvider === "local";

  if (!isMounted || (authLoading && !authUser && !cookieUser.id)) {
    return <div className="p-8 text-center text-sm text-slate-600">Loading profile...</div>;
  }

  const validate = () => {
    const nextErrors = {};
    if (!desc.trim()) nextErrors.desc = "Description is required";
    if (!profileForm.name.trim()) nextErrors.name = "Name is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: activeUser.name,
      designation: activeUser.designation,
      email: activeUser.email,
      desc: desc,
      image: DEFAULT_REVIEW_IMAGE,
    };

    dispatch(addReview(payload))
      .unwrap()
      .then(() => {
        toast.success("Review submitted successfully!");
        setSubmitted(true);
        setDesc("");
      })
      .catch((err) => {
        console.error("Failed to submit review:", err);
        toast.error("Failed to submit review. Please try again.");
      });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.info("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setIsUploadingAvatar(true);

    try {
      const uploadedUrl = await uploadImage(file);
      setProfileForm((prev) => ({ ...prev, avatar: uploadedUrl }));
      setAvatarPreview(uploadedUrl);
      toast.success("Profile image uploaded.");
    } catch (err) {
      setAvatarFile(null);
      setAvatarPreview(authUser?.avatar || "");
      toast.error(typeof err === "string" ? err : err?.message || "Image upload failed.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }

    setIsSavingProfile(true);
    try {
      const avatarUrl = profileForm.avatar || activeUser.avatar || "";

      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        avatar: avatarUrl,
      };

      const result = await dispatch(updateCurrentUser(payload)).unwrap();
      const updatedUser = result?.user || result || {};

      setProfileForm((prev) => ({
        ...prev,
        name: updatedUser?.name || payload.name,
        email: updatedUser?.email || prev.email,
        phone: updatedUser?.phone || payload.phone,
        avatar: updatedUser?.avatar || avatarUrl,
      }));
      setAvatarPreview(updatedUser?.avatar || avatarUrl);
      setAvatarFile(null);
      setErrors((prev) => ({ ...prev, name: undefined }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const result = await dispatch(updatePassword(passwordForm)).unwrap();
      toast.success(result?.message || "Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Password update failed.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      setShowModal(true);
      return;
    }

    try {
      await navigator.share({
        title: "My Coupon Stock",
        text: "Check out this amazing app!",
        url: referralLink,
      });
    } catch {
      // User cancelled or sharing failed; avoid noisy toast.
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5efff_0%,_#ffffff_45%,_#f7fbff_100%)] pb-14">
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#140b2f_0%,#5b2db7_45%,#9f67ff_100%)] px-4 pb-12 pt-10 text-white sm:px-6 lg:px-10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(18,7,46,0.28)] sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative h-28 w-28 rounded-full border-4 border-white/35 bg-white/10 shadow-xl">
                      <button
                        type="button"
                        onClick={() => activeUser.avatar && setShowAvatarModal(true)}
                        className="h-full w-full overflow-hidden rounded-full"
                      >
                        {activeUser.avatar ? (
                          <img
                            src={activeUser.avatar}
                            alt={activeUser.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-white/10 text-white">
                            {initials ? (
                              <span className="text-3xl font-black tracking-wide">{initials}</span>
                            ) : (
                              <FaUserCircle className="text-6xl" />
                            )}
                          </div>
                        )}
                      </button>

                      <label
                        htmlFor="profile-avatar-input"
                        className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#592EA9] shadow-lg transition hover:scale-105"
                        title="Upload profile image"
                      >
                        <FaCamera />
                      </label>
                      <input
                        id="profile-avatar-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div>
                      <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
                        {activeUser.socialProvider === "google"
                          ? "Google Connected"
                          : activeUser.authProvider === "social"
                            ? "Social Account"
                            : "Member Account"}
                      </span>
                      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        {activeUser.name}
                      </h1>
                      <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
                        Manage your account, referral network, and review activity from one cleaner profile space.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/90">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                          <FaEnvelope className="text-white/75" />
                          {activeUser.email || "No email available"}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                          <FaPhoneAlt className="text-white/75" />
                          {activeUser.phone || "Add phone number"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#48218f] shadow-lg transition hover:-translate-y-0.5"
                    >
                      <FaShareAlt />
                      Share App
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        document.getElementById("profile-editor")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start lg:justify-end">
                {[
                  { label: "Referrals", value: referrals.length, accent: "from-[#fff4d6] to-[#ffe6a3]", tone: "text-[#7a5200]" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`min-w-[150px] rounded-[22px] border border-white/15 bg-gradient-to-br ${item.accent} px-4 py-3 shadow-[0_16px_32px_rgba(14,10,36,0.16)]`}
                  >
                    <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${item.tone}`}>{item.label}</p>
                    <p className="mt-2 text-2xl font-black leading-none text-[#120c28]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="w-full overflow-hidden border-y border-[#e9dcff] bg-[#f7efff] py-3 shadow-sm">
          <div className="marquee">
            <div className="marquee-content text-[#592EA9] font-semibold text-sm md:text-base tracking-wide">
              Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon.
              &nbsp;•&nbsp;
              Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon.
              &nbsp;•&nbsp;
              Keep shopping! We are watching your purchases and your cashback is being added. Your wallet will be visible soon.
            </div>
          </div>
        </div>

        <main className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="space-y-6">
            <section
              id="profile-editor"
              className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
                    Profile Editor
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#1b1331]">Update your account details</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Your current details stay the same, but now you can edit them from this page and upload a custom avatar too.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f5efff] px-4 py-3 text-sm font-semibold text-[#592EA9]">
                  {activeUser.socialProvider === "google"
                    ? "Using Google profile image when available"
                    : "Using your saved profile image"}
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="mt-6 grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Full name</span>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => {
                        setProfileForm((prev) => ({ ...prev, name: e.target.value }));
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                        errors.name
                          ? "border-red-400 bg-red-50"
                          : "border-[#e2d6fb] bg-[#fcfbff] focus:border-[#7c4dff]"
                      }`}
                    />
                    {errors.name ? <p className="mt-2 text-xs text-red-600">{errors.name}</p> : null}
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Phone number</span>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Add your phone number"
                      className="w-full rounded-2xl border border-[#e2d6fb] bg-[#fcfbff] px-4 py-3 text-sm outline-none transition focus:border-[#7c4dff]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Email address</span>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-[#ece6fb] bg-[#f5f4f8] px-4 py-3 text-sm text-slate-500"
                  />
                </label>

                <div className="rounded-[24px] border border-dashed border-[#d9c8ff] bg-[linear-gradient(135deg,#faf7ff_0%,#f5fbff_100%)] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#1f153a]">Profile image</p>
                      <p className="mt-1 text-sm text-slate-600">
                        If your Google account has a picture, it appears automatically. You can also upload your own image here.
                      </p>
                      {isUploadingAvatar ? (
                        <p className="mt-2 text-xs font-semibold text-[#592EA9]">
                          Uploading image...
                        </p>
                      ) : null}
                    </div>
                    <label
                      htmlFor="profile-avatar-input-secondary"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#592EA9] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#4c2594]"
                    >
                      <FaCamera />
                      Upload Image
                    </label>
                    <input
                      id="profile-avatar-input-secondary"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile || isUploadingAvatar}
                    className="inline-flex items-center gap-2 rounded-full bg-[#16112b] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaEdit />
                    {isSavingProfile ? "Saving..." : isUploadingAvatar ? "Uploading image..." : "Update Profile"}
                  </button>
                  <span className="text-sm text-slate-500">
                    Changes update your profile immediately after save.
                  </span>
                </div>
              </form>
            </section>

            {isNormalSignupAccount ? (
              <section className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
                    Security
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#1b1331]">Update password</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    This option is available for normal signup accounts only.
                  </p>
                </div>

                <form onSubmit={handlePasswordSave} className="mt-6 grid gap-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Current password</span>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-[#e2d6fb] bg-[#fcfbff] px-4 py-3 text-sm outline-none transition focus:border-[#7c4dff]"
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#2a2143]">New password</span>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-[#e2d6fb] bg-[#fcfbff] px-4 py-3 text-sm outline-none transition focus:border-[#7c4dff]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Confirm password</span>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        className="w-full rounded-2xl border border-[#e2d6fb] bg-[#fcfbff] px-4 py-3 text-sm outline-none transition focus:border-[#7c4dff]"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="inline-flex items-center gap-2 rounded-full bg-[#592EA9] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4c2594] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <FaEdit />
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                    <span className="text-sm text-slate-500">
                      Minimum 8 characters recommended.
                    </span>
                  </div>
                </form>
              </section>
            ) : null}

            <section className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]">
              <HeadingText title="My Coupon Stock" content={couponContent} isHtml={true} />
            </section>

            <section className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
                    Feedback
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#1b1331]">Write a review</h2>
                </div>
                <div className="rounded-2xl bg-[#f8f3ff] px-4 py-3 text-sm text-[#5f4a95]">
                  Review will be submitted as <strong>{activeUser.name}</strong>
                </div>
              </div>

              {submitted ? (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  Review submitted successfully.
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="flex items-center gap-4 rounded-[24px] bg-[#fbf9ff] p-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-[#e0d4ff] bg-white">
                    <img
                      src={DEFAULT_REVIEW_IMAGE}
                      alt="review avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#241a3f]">{activeUser.name}</p>
                    <p className="text-xs text-slate-500">{activeUser.designation}</p>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[#2a2143]">Description</span>
                  <textarea
                    name="desc"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={5}
                    placeholder="Write your review..."
                    className={`w-full resize-none rounded-[24px] border px-4 py-4 text-sm outline-none transition ${
                      errors.desc
                        ? "border-red-400 bg-red-50"
                        : "border-[#e2d6fb] bg-[#fcfbff] focus:border-[#7c4dff]"
                    }`}
                  />
                  {errors.desc ? <p className="mt-2 text-xs text-red-600">{errors.desc}</p> : null}
                </label>

                <button
                  type="submit"
                  className="rounded-full bg-[#592EA9] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4c2594]"
                >
                  Submit Review
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
                Referral Hub
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#1b1331]">Invite and grow your network</h2>
              <p className="mt-2 text-sm text-slate-600">
                Share your referral link, bring friends in, and track everyone from one place.
              </p>

              <div className="mt-5 rounded-[26px] bg-[linear-gradient(135deg,#151028_0%,#4f289c_55%,#8455eb_100%)] p-5 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
                  Your referral link
                </p>
                <p className="mt-3 break-all text-sm leading-6 text-white/90">{referralLink}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#4e25a0]"
                  >
                    <FaCopy />
                    Copy Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white"
                  >
                    <FaShareAlt />
                    Share More
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-[30px] border border-[#eadfff] bg-white p-6 shadow-[0_20px_60px_rgba(84,57,145,0.08)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
                    My Referrals
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#1b1331]">Referral activity</h2>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-[#e1d4ff] bg-[#fbf9ff] px-4 py-3 text-sm text-slate-500">
                  <FaSearch className="text-[#7e61b8]" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full bg-transparent outline-none sm:w-52"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </label>
              </div>

              <div className="mt-5 overflow-hidden rounded-[24px] border border-[#eee6ff]">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-[linear-gradient(90deg,#5a2fb0_0%,#7a52d6_100%)] text-white">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em]">S.No</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em]">Name</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em]">Email</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.16em]">Joined On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReferrals.length > 0 ? (
                        filteredReferrals.map((referral, idx) => (
                          <tr key={referral._id} className="border-t border-[#f0eaff] text-sm text-slate-700 transition hover:bg-[#fbf8ff]">
                            <td className="px-5 py-4 font-semibold text-[#5b34af]">{idx + 1}</td>
                            <td className="px-5 py-4">{referral.name}</td>
                            <td className="px-5 py-4">{referral.email}</td>
                            <td className="px-5 py-4">
                              {referral.createdAt
                                ? new Date(referral.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-500">
                            No referrals found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {showAvatarModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#120a25]/70 px-4 backdrop-blur-sm">
          <div className="relative rounded-[32px] border border-white/15 bg-[linear-gradient(145deg,#1c103d_0%,#34206b_100%)] p-4 shadow-[0_30px_90px_rgba(8,4,24,0.5)]">
            <button
              type="button"
              onClick={() => setShowAvatarModal(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <FaTimes size={18} />
            </button>
            {activeUser.avatar ? (
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-[300px] w-[300px] rounded-full border-4 border-white/20 object-cover shadow-2xl sm:h-[360px] sm:w-[360px]"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120a25]/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-[30px] border border-white/40 bg-white/95 p-8 shadow-[0_30px_90px_rgba(22,12,50,0.28)]">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-slate-500 transition hover:text-slate-900"
            >
              <FaTimes size={20} />
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7e61b8]">
              Share & Earn
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#1b1331]">
              Share My Coupon Stock and earn cashback
            </h2>

            <div className="mt-6 rounded-[24px] bg-[#f8f4ff] p-4">
              <p className="text-sm text-slate-500">Your app referral link</p>
              <p className="mt-2 break-all text-sm font-semibold text-[#43257d]">{referralLink}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#592EA9] px-4 py-2 text-sm font-bold text-white"
              >
                <FaCopy />
                Copy Link
              </button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/?text=Check%20out%20this%20amazing%20app!%20${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 transition hover:scale-105"
              >
                <FaWhatsapp size={24} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition hover:scale-105"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Check%20out%20this%20amazing%20app!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition hover:scale-105"
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition hover:scale-105"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProfilePage;
