import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import { getDeals } from "@/redux/deal/dealSlice";
import { getStores } from "@/redux/store/storeSlice";
import { getCategories } from "@/redux/category/categorySlice";
import { fetchBlogs } from "@/redux/blog/blogSlice";
import { fetchReviews  } from "@/redux/review/reviewSlice";
import { getHomeAdminData } from "@/redux/admin/homeAdminSlice";

const withSkeleton = (WrappedComponent) => {
  return function Wrapper(props) {
    
     const dispatch = useDispatch();


    const { deals, loading: dealLoading } = useSelector((state) => state.deal);
    const { categories, loading: categoryLoading } = useSelector((state) => state.category);
    const { stores, loading: storeLoading } = useSelector((state) => state.store);
    const { blogs, loading: blogLoading } = useSelector((state) => state.blogs);
    const { reviews, loading: reviewLoading } = useSelector((state) => state.reviews);
    const { homeAdmin, loading: homeLoading } = useSelector((state) => state.homeAdmin);


    
    useEffect(() => {
  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(getDeals()).unwrap(),
        dispatch(getStores()).unwrap(),
        dispatch(getCategories()).unwrap(),
        dispatch(fetchReviews()).unwrap(),
        dispatch(fetchBlogs()).unwrap(),
        dispatch(getHomeAdminData()).unwrap(),
      ]);
    } catch (err) {
      console.error(" Data load error:", err);
    }
  };

  loadData();
}, [dispatch]);



    const isLoading =
      dealLoading ||
      categoryLoading ||
      storeLoading ||
      blogLoading ||
      reviewLoading ||
      homeLoading;

    
    if (isLoading) {
      return <PageSkeleton />;
    }


    return <WrappedComponent {...props} />;
  };
};

export default withSkeleton;
