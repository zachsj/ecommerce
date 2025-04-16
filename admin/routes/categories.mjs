/* import { Router } from "express";
import { categories, products } from "../constants/index.mjs";

const router = Router();

router.get("/categories", (req, res) => {
  res.send(categories);
});

router.get("/categories/:id", (req, res) => {
  const id = req.params.id;
  const matchedProducts = products?.filter((item) => item?._base === id);

  if (!matchedProducts || matchedProducts.length === 0) {
    return res
      .status(404)
      .json({ message: "No products matched with this category" });
  }
  res.json(matchedProducts);
});

export default router; */

import { Router } from "express";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Dynamically import Firebase credentials
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('../admin/firebase-service-account.json'), 'utf8'));
//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const router = Router();

// Fetch all categories from Firestore
router.get("/categories", async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection("categories").get();
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Fetch products based on category ID
router.get("/categories/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const productsSnapshot = await db.collection("products").where("_base", "==", categoryId).get();
    const matchedProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (matchedProducts.length === 0) {
      return res.status(404).json({ message: "No products matched with this category" });
    }

    res.json(matchedProducts);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Error fetching products by category" });
  }
});

export default router;
