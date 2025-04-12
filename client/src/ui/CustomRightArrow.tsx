import { HiArrowRight } from "react-icons/hi";

const CustomRightArrow = ({ onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-6 m-auto h-8 w-8 flex items-center justify-center hover:bg-gray-950 hover:text-white duration-200 cursor-pointer"
      aria-label="Next"
      style={{
        background: "transparent",
        border: "none",
        outline: "none",
        boxShadow: "none",
      }}
    >
      <HiArrowRight className="text-base" />
    </button>
  );
};

export default CustomRightArrow;