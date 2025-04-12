import { HiArrowLeft } from "react-icons/hi";

const CustomLeftArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-6 m-auto h-8 w-8 flex items-center justify-center hover:bg-gray-950 hover:text-white duration-200 cursor-pointer"
      aria-label="Next"
      style={{
        background: "transparent",
        border: "none",
        outline: "none",
        boxShadow: "none",
      }}
    >
      <HiArrowLeft className="text-base" />
    </button>
  );
};

export default CustomLeftArrow;