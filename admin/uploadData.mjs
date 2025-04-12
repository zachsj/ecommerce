import admin from "firebase-admin";
import serviceAccount from "../admin/firebase-service-account.json" assert { type: "json" };

// Import individual datasets
import { categories, products, highlightsProducts, blogsData } from "./constants/index.mjs";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

// Function to upload data to Firestore
const sanitizePath = (path) => {
    // Ensure path is a string before applying replace
    if (typeof path !== 'string') {
        throw new Error(`Invalid path: expected string but got ${typeof path}`);
    }
    return path.replace(/[^a-zA-Z0-9_-]/g, '-');  // Replace special characters with dashes
};

const uploadCollection = async (collectionName, dataset) => {
    const collectionRef = db.collection(collectionName);

    for (const item of dataset) {
        let docId = item.id || item.name;
        //console.log(`Uploading ${collectionName} with ID: ${docId}`);
        if (!docId) {
            console.error(`❌ Invalid document path for ${collectionName}:`, item);
            continue; // Skip this item if no valid ID
        }

        // Convert docId to string if it's not a string
        docId = String(docId);

        // Sanitize the document ID
        try {
            docId = sanitizePath(docId);  // Sanitize the document ID
        } catch (error) {
            console.error(error.message);
            continue; // Skip this item if there's an issue with the ID
        }

        const docRef = collectionRef.doc(docId);
        await docRef.set(item);
    }

    console.log(`✅ Uploaded ${dataset.length} items to "${collectionName}"`);
};

// Function to rename _id to id for all collections
const renameId = (data) => {
    return data.map(item => {
        const { _id, ...rest } = item;
        return { id: _id, ...rest };
    });
};

// Rename _id to id for all collections
const updatedCategories = renameId(categories);
const updatedProducts = renameId(products);
const updatedHighlightsProducts = renameId(highlightsProducts);
const updatedBlogsData = renameId(blogsData);

// Run uploads
const uploadData = async () => {
    try {
        // Use the named imports directly
        await uploadCollection("categories", updatedCategories);
        await uploadCollection("products", updatedProducts);
        await uploadCollection("highlightedProducts", updatedHighlightsProducts);
        await uploadCollection("blogs", updatedBlogsData);

        console.log("🎉 All data uploaded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error uploading data:", error);
        process.exit(1);
    }
};

uploadData();