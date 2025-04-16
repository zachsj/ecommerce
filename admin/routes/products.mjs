//This would pull data direct from constants index.mjs file instead of firestore
/* import { Router } from "express";
import { products } from "../constants/index.mjs";

const router = Router(); //initializes an Express Router instance, allows defining API routes separately from the main server file.

router.get("/products", (req, res) => {
  res.send(products);
});

router.get("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((item) => item._id === productId);

  if (!product) {
    return res.status(404).json({ message: "Single Phone was not found" });
  }
  res.send(product); //If a matching product is found, it is sent as the response.
});

export default router; */


import { Router } from "express";
import admin from "firebase-admin";
// Dynamically import JSON file in ES module scope
import fs from "fs";
import path from "path";

// Initialize Firebase Admin SDK with the service account credentials
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('../admin/firebase-service-account.json'), 'utf8'));
//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const router = Router(); // initializes an Express Router instance

// Route to get all products
router.get("/products", async (req, res) => {
  try {
    // Get all products from Firestore
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No products found" });
    }

    const products = snapshot.docs.map((doc) => doc.data()); // Get all products data
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products from Firestore" });
  }
});

// Route to get a single product by ID
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    // Get a product from Firestore by its ID
    const productDoc = await db.collection("products").doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productDoc.data(); // Get the product data
    res.send(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product from Firestore" });
  }
});

export default router;
