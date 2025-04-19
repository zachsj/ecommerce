import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface Props {
  showButton?: boolean;
  link?: string;
  className?: string;
}

const LinkButton = ({ showButton, link, className }: Props) => {
  const newClassName = twMerge(
    // Default (mobile): smaller size, margin-top
    "bg-darkText/80 hover:bg-darkText text-whiteText py-1 px-4 text-sm mt-4",
    // Desktop overrides
    "md:py-2.5 md:px-6 md:text-base md:mt-3",
    // Common styles
    "rounded-full flex items-center gap-2 duration-200",
    className
  );
  return (
    <Link to={link ? link : "/product"} className={newClassName}>
      {showButton && <FaArrowLeft />} Start Shopping
    </Link>
  );
};

export default LinkButton;