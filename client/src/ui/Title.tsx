//Used in Highlights.tsx, Categories.tsx, ProductList.tsx, DiscountBanner.tsx all on App.tsx(homepage)
// and additionally ProductCard.tsx, Blog.tsx

import { twMerge } from "tailwind-merge";  //twMerge helps combine and override Tailwind CSS classes.

interface Props {  //Props define what data this component expects.
  text: string;
  className?: string;
}
const Title = ({ text, className }: Props) => {  //accepts text and className as props.
  const newClassName = twMerge("text-4xl font-bold", className); //"text-4xl font-bold" → Default style. className (if provided) is merged. ensures that className can override default styles if needed.
  return <h2 className={newClassName}>{text}</h2>;  //All Titles by default are now in a h2 tag with default styling of "text-4xl font-bold"
};

export default Title;