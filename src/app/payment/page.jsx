// 'use client';
// import React from 'react';
// import { useCreateOrderMutation } from '../../redux/razorpay/paymentApi';
// import { useDispatch } from 'react-redux';
// import { setPaymentStatus, setError } from '../../redux/razorpay/paymeslice';

// const Payment = () => {
//   const [createOrder] = useCreateOrderMutation();
//   const dispatch = useDispatch();

//   const loadRazorpay = (order) => {
//     const options = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//       amount: order.amount.toString(),
//       currency: order.currency,
//       name: "Your Company",
//       description: "Test Transaction",
//       order_id: order.id,
//       handler: function (response) {
//         dispatch(setPaymentStatus(response.razorpay_payment_id));
//         alert("Payment Successful!");
//       },
//       prefill: {
//         name: "User Name",
//         email: "user@example.com",
//         contact: "9999999999",
//       },
//       theme: { color: "#3399cc" },
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   const handlePayment = async () => {
//     const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
//     if (!res) {
//       alert('Failed to load Razorpay SDK');
//       return;
//     }

//     try {
//       const order = await createOrder({ amount: 500 }).unwrap();
//       loadRazorpay(order);
//     } catch (error) {
//       dispatch(setError(error.data?.error || 'Failed to create order'));
//     }
//   };

//   // Helper to load Razorpay script dynamically
//   const loadScript = (src) =>
//     new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   return (
//     <div>
//       <button onClick={handlePayment}>Pay ₹500</button>
//     </div>
//   );
// };

// export default Payment;