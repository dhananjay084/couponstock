// components/ContactSection.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { submitContact, resetContactState } from "@/redux/contact/contactSlice"; // adjust path

const subjects = [
  "General Inquiry",
  "General Inquiry",
  "General Inquiry",
  "General Inquiry",
];

export default function ContactSection() {
  const dispatch = useDispatch();
  const { status, error, submission } = useSelector((state) => state.contact);

  const [selectedSubject, setSelectedSubject] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "Doe",
    email: "",
    phone: "+1 012 3456 789",
    message: "",
  });

  useEffect(() => {
    if (submission) {
      // Reset form on successful submission
      setForm({
        firstName: "",
        lastName: "Doe",
        email: "",
        phone: "+1 012 3456 789",
        message: "",
      });
      setSelectedSubject(0);
      // Optionally clear success message after a delay
      const t = setTimeout(() => dispatch(resetContactState()), 3000);
      return () => clearTimeout(t);
    }
  }, [submission, dispatch]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      alert("Please fill required fields.");
      return;
    }

    const payload = {
      ...form,
      subject: subjects[selectedSubject],
    };

    dispatch(submitContact(payload));
  };

  return (
    <div className="bg-white py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left card */}
        <div className="flex-shrink-0 w-full lg:w-1/3">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#4E2C9E] to-[#3E267D] p-8 text-white shadow-xl">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold">Contact Information</h2>
              <p className="text-sm opacity-90">Say something to start a live chat!</p>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <FiPhone size={18} />
                  </div>
                  <span className="text-lg font-medium">+1012 3456 789</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <FiMail size={18} />
                  </div>
                  <span className="text-lg font-medium">demo@gmail.com</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <FiMapPin size={18} />
                  </div>
                  <div className="text-sm">
                    132 Dartmouth Street Boston,<br />
                    Massachusetts 02156 United States
                  </div>
                </div>
              </div>

              {/* Social icons */}
              <div className="mt-8 flex gap-4">
                {[FaTwitter, FaInstagram, FaDiscord].map((Icon, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-full cursor-pointer transition ${
                      i === 1 ? "bg-white text-[#4E2C9E]" : "bg-black/20"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative circles */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 right-16 w-24 h-24 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="border-b border-gray-300 focus:outline-none py-2 bg-transparent placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Last Name *</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="border-b border-gray-300 focus:outline-none py-2 bg-transparent placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Email *</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="border-b border-gray-300 focus:outline-none py-2 bg-transparent placeholder-gray-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border-b border-gray-300 focus:outline-none py-2 bg-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Subject selection */}
          <div className="mt-8">
            <p className="text-sm font-semibold">Select Subject?</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-3">
              {subjects.map((subj, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                      selectedSubject === i
                        ? "bg-black text-white border-black"
                        : "bg-gray-200 border-gray-300"
                    }`}
                    onClick={() => setSelectedSubject(i)}
                  >
                    {selectedSubject === i && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sm">{subj}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mt-8">
            <label className="text-sm font-medium text-gray-600 mb-1 block">Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message.."
              rows={4}
              className="w-full resize-none border-b border-gray-300 focus:outline-none py-2 bg-transparent placeholder-gray-400"
            />
          </div>

          {/* Send button + status */}
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="bg-neutral-900 text-white px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition font-medium disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            <div className="flex-1 min-w-0">
              {status === "succeeded" && <p className="text-green-600">Message sent successfully.</p>}
              {status === "failed" && <p className="text-red-600">{error || "Failed to send message."}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
