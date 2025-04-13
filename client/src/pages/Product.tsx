//This is the SHOP page

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "../../config";
import { ProductProps } from "../../type";
import { getData } from "../lib";  //from index.ts
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import _ from "lodash";
import PriceTag from "../ui/PriceTag";
import { MdOutlineStarOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import FormattedPrice from "../ui/FormattedPrice";
import { IoClose } from "react-icons/io5";
import AddToCartBtn from "../ui/AddToCartBtn";
import { productPayment } from "../assets";
import ProductCard from "../ui/ProductCard";
import CategoryFilters from "../ui/CategoryFilters";

const Product = () => {

  // Extract the product ID from the URL parameters
  //productData initial state is (null), productData can either be of type ProductProps (an object with product details, in type.ts file).
  //OR it can be null (no product is selected or data hasn't loaded yet). Later, it will be updated using setProductData() 
  //when the product is fetched. 
  const [productData, setProductData] = useState<ProductProps | null>(null);
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [color, setColor] = useState("");
  const { id } = useParams(); //extracts the id parameter from the URL using React Router's useParams() hook.

  //If id exists (i.e., the user is viewing a specific product) → Fetch a single product (/products/{id}) If id doesn’t exist → Fetch all products (/products/)
  //config?.baseUrl: A variable storing the base URL of the API. The optional chaining (?.) ensures it doesn’t throw an error if config is undefined.
  const endpoint = id
    ? `${config?.baseUrl}/products/${id}`
    : `${config?.baseUrl}/products/`;

  //Runs when id or endpoint changes (i.e., when navigating to a new product page or product listing).
  //The function inside useEffect runs when the component mounts and re-runs when dependencies change.
  //mounting" refers to the moment a component is first added to the DOM (rendered on the screen).
  useEffect(() => {  //React Hook used to perform side effects in a functional component.
    const fetchData = async () => {  //when a program requests data from a source (like an API), it does so without waiting for the response to come back before continuing to execute other code.
      try {
        setLoading(true);  // Set loading to true before fetching data
        const data = await getData(endpoint); //Calls getData(endpoint), which fetches product data. getData is in lib/index.ts.
        //console.log("Fetched data:", data);
        if (id) {  //If id exists → Fetch one product and reset allProducts.
          setProductData(data);  // Store the product details
          setAllProducts([]);  // Clear the allProducts array since we only need one product
        } else {  //If id doesn’t exist → Fetch all products and reset productData.
          setAllProducts(data);  // Store all products in state
          setProductData(null);  // Clear any previously selected product
        }
      } catch (error) {
        console.error("Error fetching data", error); // Log any errors that occur
      } finally {
        setLoading(false); // Ensure loading is turned off after fetching completes
      }
    };
    fetchData();  // Call the async function to fetch data
  }, [id, endpoint]);  //Runs again whenever id or endpoint changes (because they are in the dependency array [id, endpoint])

  //Runs when productData changes (i.e., when a new product is loaded).
  useEffect(() => {
    if (productData) {
      setImgUrl(productData?.images[0]);  // Set the first image as default
      setColor(productData?.colors[0]);  // Set the first color as default
    }
  }, [productData]);

  return (
    <div>
      {loading ? ( //If loading is true, it shows the Loading component.
        <Loading />
      ) : ( //Ifloading is false, it continues rendering the product details or list.
        <Container>
          {!!id && productData && _.isEmpty(allProducts) ? (  //!!id → Converts id to a boolean (if id exists, it's true).
            //productData → Checks if product data is available.  _.isEmpty(allProducts) → Ensures no list of products is available
            //If all these conditions are true, it means we should display a single product. Otherwise, we show all products. Line 99 and on is all products.
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-start">
                <div>
                  {productData?.images?.map((item, index) => (  //Maps through productData?.images, displaying small preview images.
                    <img
                      src={item}  //item = "https://example.com/image1.jpg"
                      alt="img"
                      key={index} //index represents the position in the array (0, 1, 2, …). If two images have the same URL, React might misidentify elements during re-renders.
                      //Instead, index provides a guaranteed unique key since array indexes are always unique.
                      className={`w-24 cursor-pointer opacity-80 hover:opacity-100 duration-300 ${imgUrl === item && //The logical AND (&&) operator returns the right-side value if the left side is true
                        "border border-gray-500 rounded-sm opacity-100" //only applies if imgUrl === item is true
                        }`}
                      onClick={() => setImgUrl(item)}  //Clicking on an image updates the main image (setImgUrl(item)).
                    />
                  ))}
                </div>
                <div>
                  <img src={imgUrl} alt="mainImage" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">{productData?.name}</h2>
                <div className="flex items-center justify-between">
                  <PriceTag
                    regularPrice={productData?.regularPrice}
                    discountedPrice={productData?.discountedPrice}
                    className="text-xl"
                  />
                  <div className="flex items-center gap-1">
                    <div className="text-base text-lightText flex items-center">
                      <MdOutlineStarOutline /> {/* Displays 5 empty star icons */}
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                    </div> {/* Shows the number of reviews for the product */}
                    <p className="text-base font-semibold">{`(${productData?.reviews} reviews)`}</p>
                  </div>
                </div>
                <p className="flex items-center">
                  <FaRegEye className="mr-1" />{" "}
                  <span className="font-semibold mr-1">
                    {productData?.reviews}
                  </span>{" "}
                  people are viewing this right now
                </p>
                <p>
                  You are saving{" "}
                  <span className="text-base font-semibold text-green-500">
                    <FormattedPrice
                      amount={
                        productData?.regularPrice! -
                        productData?.discountedPrice!
                      }
                    />
                  </span>{" "}
                  upon purchase
                </p>
                <div>
                  {color && (
                    <p>
                      Color:{" "}
                      <span
                        className="font-semibold capitalize"
                        style={{ color: color }}
                      >
                        {color}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-x-3">
                    {productData?.colors.map((item) => ( //here item is just a unique string, red, blue etc
                      <div
                        key={item}
                        className={`${item === color
                          ? "border border-black p-1 rounded-full"
                          : "border-transparent"
                          }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full cursor-pointer"
                          style={{ backgroundColor: item }}
                          onClick={() => setColor(item)}
                        />
                      </div>
                    ))}
                  </div>
                  {color && (
                    <button
                      onClick={() => setColor("")}
                      className="font-semibold mt-1 flex items-center gap-1 hover:text-red-600 duration-200"
                    >
                      <IoClose /> Clear
                    </button>
                  )}
                </div>
                <p>
                  Brand:{" "}
                  <span className="font-medium">{productData?.brand}</span>
                </p>
                <p>
                  Category:{" "}
                  <span className="font-medium">{productData?.category}</span>
                </p>
                <AddToCartBtn
                  product={productData}
                  title="Buy now"  //uppercase due to styling in AddToCartBtn, see lines 57 & 111
                  className="bg-black/80 py-3 text-base text-gray-200 hover:scale-100 hover:text-white duration-200"
                />
                <div className="bg-[#f7f7f7] p-5 rounded-md flex flex-col items-center justify-center gap-2">
                  <img
                    src={productPayment}
                    alt="payment"
                    className="w-auto object-cover"
                  />
                  <p className="font-semibold">
                    Guaranteed safe & secure checkout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-10">
              <CategoryFilters id={id} />
              <div>
                <p className="text-4xl font-semibold mb-5 text-center">
                  Products Collection
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {allProducts?.map((item: ProductProps) => (  //item of type ProductProps, ensures each product has the correct structure (with _id, name, price, etc.)
                    <ProductCard item={item} key={item?.id} /> //each item is an object (representing a product), so we need item._id (a unique identifier). In the colors list above, each item is already a unique string, so we can use it directly.
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default Product;