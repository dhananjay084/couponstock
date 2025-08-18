"use client"; // Required because we use client-side navigation

import { useRouter } from "next/navigation";

const ProductCard = ({ data }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/deal/${data._id}?category=${data.categorySelect}`);
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden w-full min-h-[428px] min-w-[300px] h-full mx-auto">
      {/* Background Image */}
      <img
        src={data.dealImage}
        alt="Product Image"
        className="absolute top-0 left-0 w-full h-full object-fill"
      />

      {/* Button at bottom-right */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleCardClick}
          className="bg-[#E5DBF9] text-[#592EA9] font-semibold px-6 py-2 rounded-full text-sm shadow-md hover:bg-[#d6c6f5] transition"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
