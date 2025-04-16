/* import { Router } from "express";
import { highlightsProducts } from "../constants/index.mjs";

const router = Router();

router.get("/highlights", (req, res) => {
  res.send(highlightsProducts);
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

// Fetch highlights products from Firestore
router.get("/highlights", async (req, res) => {
  try {
    const highlightsSnapshot = await db.collection("highlightedProducts").get(); // Fetch the collection from Firestore
    const highlights = highlightsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map the documents to an array of objects

    res.send(highlights); // Send the fetched highlights as the response
  } catch (error) {
    console.error("Error fetching highlighted products:", error);
    res.status(500).json({ message: "Error fetching highlighted products" });
  }
});

export default router;

