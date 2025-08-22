
// "use client";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import PageSkeleton from "@/components/skeletons/PageSkeleton";
// import { getDeals } from "@/redux/deal/dealSlice";
// import { getStores } from "@/redux/store/storeSlice";
// import { getCategories } from "@/redux/category/categorySlice";
// import { fetchBlogs } from "@/redux/blog/blogSlice";
// import { fetchReviews } from "@/redux/review/reviewSlice";
// import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";

// const withSkeleton = (WrappedComponent) => {
//   return function Wrapper(props) {
//     const dispatch = useDispatch();
//     const [localLoading, setLocalLoading] = useState(true);

//     const { deals } = useSelector((state) => state.deal);
//     const { categories } = useSelector((state) => state.category);
//     const { stores } = useSelector((state) => state.store);
//     const { blogs } = useSelector((state) => state.blogs);
//     const { reviews } = useSelector((state) => state.reviews);
//     const { homeAdmin } = useSelector((state) => state.homeAdmin);

//     useEffect(() => {
//       const loadData = async () => {
//         try {
//           await Promise.allSettled([
//             dispatch(getDeals()),
//             dispatch(getStores()),
//             dispatch(getCategories()),
//             dispatch(fetchReviews()),
//             dispatch(fetchBlogs()),
//             dispatch(getHomeAdminData()),
//           ]);
//         } catch (err) {
//           console.error("Data load error:", err);
//         } finally {
//           setLocalLoading(false);
//         }
//       };

//       // only fetch if no data already
//       if (
//         !deals?.length ||
//         !categories?.length ||
//         !stores?.length ||
//         !blogs?.length ||
//         !reviews?.length ||
//         !homeAdmin
//       ) {
//         loadData();
//       } else {
//         setLocalLoading(false);
//       }
//     }, [dispatch]);

//     if (localLoading) {
//       return <PageSkeleton />;
//     }

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withSkeleton;
