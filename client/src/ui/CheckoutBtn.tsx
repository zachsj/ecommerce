import { loadStripe } from "@stripe/stripe-js";
import { ProductProps } from "../../type";
import { store } from "../lib/store";
import { config } from "../../config";

const CheckoutBtn = ({ products }: { products: ProductProps[] }) => {
  const { currentUser } = store();
  const publishableKey =
    "pk_test_51Qylgi2RHWH63CtCaRJtJjk2s74Vva2mdLMFcHTTVJRbDFzc14WZMKjlAhLAzRXIZ1VycnjlPeY1pRkU98rvdC7000LnzzW2zJ";
  const stripePromise = loadStripe(publishableKey);

  const handleCheckout = async () => { //This function runs when the user clicks the checkout button.
    const stripe = await stripePromise;
    //console.log("Stripe", stripe); // Log the response from Stripe
    const response = await fetch(`${config?.baseUrl}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: products,
        email: currentUser?.email,
      }),
    });
    const checkoutSession = await response?.json();
    //console.log("checkout", checkoutSession);
    const result: any = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    if (result.error) {
      window.alert(result?.error?.message);
    }
  };
  return (
    <div className="mt-6">
      {currentUser ? ( //if user logged in you see this
        <button
          onClick={handleCheckout}
          type="submit"
          className="w-full rounded-md border border-transparent bg-gray-800 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-skyText focus:ring-offset-2 focus:ring-offset-gray-50 duration-200 cursor-pointer"
        >
          Checkout
        </button>
      ) : ( //if user NOT logged in you see this
        <button className="w-full text-base text-white text-center rounded-md border border-transparent bg-gray-500 px-4 py-3 cursor-not-allowed">
          Checkout
        </button>
      )}
      {!currentUser && ( //see note
        <p className="mt-2 text-sm font-medium text-red-500 text-center">
          Need to sign in to make checkout
        </p>
      )}
    </div>
  );
};

export default CheckoutBtn;