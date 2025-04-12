import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Cancel from "./pages/Cancel.tsx";
import Cart from "./pages/Cart.tsx";
import Category from "./pages/Category.tsx";
import Favorite from "./pages/Favorite.tsx";
import NotFound from "./pages/NotFound.tsx";
import Orders from "./pages/Orders.tsx";
import Product from "./pages/Product.tsx";
import Profile from "./pages/Profile.tsx";
import Success from "./pages/Success.tsx";
import Layout from "./ui/Layout.tsx";


const RouterLayout = () => {
  return (
    <Layout> {/* Layout is a wrapper (includes header, footer, etc.). */}
      <ScrollRestoration />
      <Outlet />  {/* <Outlet /> is a placeholder for the child routes below,renders the current route’s component. */}
    </Layout>     /* Example. If you go to /cart, Layout stays the same, but <Outlet /> loads <Cart />. */
  )
}

const router = createBrowserRouter([
  {
    path: '/',  //is the base route.
    element: <RouterLayout />, //means RouterLayout above is rendered first.
    children: [  //The children array defines which component should appear in <Outlet /> above
      {
        path: '/',  //When a user visits /, React Router sees that / matches path: '/' (parent route).
        element: <App />,  //It then renders <App /> inside <Outlet />.
      },
      {
        path: '/product',  //If a user visits /product, it renders <Product /> instead.
        element: <Product />,
      },
      {
        path: '/product/:id',
        element: <Product />,
      },
      {
        path: '/category',
        element: <Category />,
      },
      {
        path: '/category/:id',
        element: <Category />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/favorite',
        element: <Favorite />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/success',
        element: <Success />,
      },
      {
        path: '/cancel',
        element: <Cancel />,
      },
      {
        path: '*',
        element: <NotFound />,
      }, // Add more routes here
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(  //Finds the HTML element with the id="root" (from index.html).
  //Uses ReactDOM to render the React app inside this element
  <RouterProvider router={router} /> //Wraps the entire app with RouterProvider, which enables React Router.
)
