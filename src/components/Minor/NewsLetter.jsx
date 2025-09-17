"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NewsletterImg from "../../assets/NewsLetter.png";
import { Typography, TextField, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { subscribeUser, resetSubscriberState } from "@/redux/newletter/newsletterSlice";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const NewsLetter = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.newsletter);

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      dispatch(subscribeUser({ email: inputValue }));
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Thanks for subscribing!");
      setInputValue("");
      dispatch(resetSubscriberState());
    } else if (error) {
      toast.error(error);
    }
  }, [success, error, dispatch]);

  return (
    <div className="mt-8">
      {/* Toast container (put it anywhere inside JSX tree) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="mx-auto relative w-[300px] h-[150px] sm:w-[400px] sm:h-[200px]">
        <Image src={NewsletterImg} alt="Newsletter" fill style={{ objectFit: "contain" }} />
      </div>

      <div className="max-w-[70%] mx-auto text-center mt-4">
        <p className="font-medium text-[12px]">Get our weekly</p>
        <p className="text-[20px] font-semibold">NEWSLETTER</p>
        <p className="text-[12px]">
          Get weekly updates on the newest design stories, case studies and tips right in your mailbox.
        </p>
        <Typography color="#592ea9" sx={{ fontSize: "12px" }}>
          Subscribe now!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} >
          <TextField
            label="Enter your email"
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ color: "#fff", borderRadius: "7px", mt: 2, background: '#282828', cursor: "pointer" }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default NewsLetter;
