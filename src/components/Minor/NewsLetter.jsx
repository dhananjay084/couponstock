"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NewsletterImg from "../../assets/NewsLetter.png";
import { Typography, TextField, Button, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { subscribeUser, resetSubscriberState } from "../../redux/newletter/newsletterSlice";
import { toast } from "react-toastify";

const NewsLetter = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.newsletter);

  const [inputValue, setInputValue] = useState("") ;

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
    <div className="pro-card rounded-2xl border border-[#E3E8F2] bg-white p-4 sm:p-6">
      <div className="relative mx-auto h-[150px] w-[300px] sm:h-[200px] sm:w-[400px]">
        <Image src={NewsletterImg} alt="Newsletter" fill style={{ objectFit: "contain" }} />
      </div>

      <div className="mx-auto mt-4 max-w-[80%] text-center sm:max-w-[70%]">
        <p className="text-[12px] font-medium text-[#6D7790]">Get our weekly</p>
        <p className="text-[24px] font-extrabold tracking-tight text-[#1A243B]">NEWSLETTER</p>
        <p className="text-[12px] leading-5 text-[#5B667F]">
          Get weekly updates on the newest design stories, case studies and tips right in your mailbox.
        </p>
        <Typography color="#5b3cc4" sx={{ fontSize: "12px", fontWeight: 700 }}>
          Subscribe now!
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }} >
          <TextField
            label="Enter your email"
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#FAFBFF",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              color: "#fff",
              borderRadius: "10px",
              mt: 2,
              px: 3,
              fontWeight: 700,
              background: "#5B3CC4",
              cursor: "pointer",
              "&:hover": { background: "#4A30A9" },
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default NewsLetter;
