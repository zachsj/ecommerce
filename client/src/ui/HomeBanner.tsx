import { homeBanner } from "../assets";
import Container from "./Container";
import LinkButton from "./LinkButton";

const HomeBanner = () => {
  return (
    <Container className="relative py-5 overflow-hidden">
      {/* Image container with responsive height */}
      <div className="relative w-full h-[240px] md:h-[400px] lg:h-[600px] rounded-md overflow-hidden">
        <img
          src={homeBanner}
          alt="homeBanner"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Text and Button at bottom-left */}
        <div className="absolute bottom-1 left-4 z-10 max-w-[50%] md:bottom-4 md:max-w-[250px]">
          <p className="text-xs md:text-lg font-semibold leading-[1.1] md:leading-6 text-whiteText/90 mt-2 md:mt-0">
            The latest tech gift you’ve been hoping for right here..
          </p>
          <LinkButton className="mt-3 w-32 md:w-44 text-xs md:text-sm flex items-center justify-center bg-whiteText text-darkText hover:bg-darkText hover:text-whiteText duration-200" />
        </div>
      </div>
    </Container>
  );
};

export default HomeBanner;
