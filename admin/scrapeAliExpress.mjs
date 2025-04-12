/* import puppeteer from "puppeteer";

const productURL = "https://www.aliexpress.us/item/3256808490767070.html?spm=a2g0o.productlist.main.1.3b56KLUiKLUiUh&algo_pvid=a1b1f0de-8e35-4eca-aabc-0f0b91e87198&algo_exp_id=a1b1f0de-8e35-4eca-aabc-0f0b91e87198-0&pdp_ext_f=%7B%22order%22%3A%22-1%22%2C%22eval%22%3A%221%22%7D&pdp_npi=4%40dis%21USD%21114.95%2180.46%21%21%21831.17%21581.82%21%402101c80017430009687083194e8256%2112000046202455191%21sea%21US%210%21ABX&curPageLogUid=v2nS1N6ogywx&utparam-url=scene%3Asearch%7Cquery_from%3A#nav-description";

const scrapeProduct = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let productData;

    try {
        console.log(`Navigating to ${productURL}...`);
        await page.goto(productURL, { waitUntil: "networkidle2" });

        // Scroll to the bottom of the page to trigger lazy-loaded content
        await autoScroll(page);

        // Log the full body HTML for debugging
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        console.log("🔍 Full Page HTML:", bodyHTML);

        // Wait for the product description container
        await page.waitForSelector("#product-description .detailmodule_html", { timeout: 15000 })
            .catch(() => console.log("⚠️ Description not found in time."));

        productData = await page.evaluate(() => {
            const title = document.querySelector("h1[data-pl='product-title']")?.innerText.trim() || "No title found";
            const price = document.querySelector(".product-price-value")?.innerText.trim() || "No price found";

            console.log("🛠️ Step 1: Title found:", title);
            console.log("🛠️ Step 2: Price found:", price);

            // Get the full description container
            const descriptionContainer = document.querySelector("#product-description .detailmodule_html");
            console.log("🛠️ Step 3: Description container exists:", !!descriptionContainer);

            if (!descriptionContainer) {
                return { title, price, description: "No description found" };
            }

            // Log the full inner HTML of the description container
            //const descriptionHTML = descriptionContainer.innerHTML;
            //console.log("🔍 Description HTML:", descriptionHTML);

            // Return the full extracted HTML
            return { title, price, descriptionHTML };
        });

        console.log("✅ Final Data:", productData);

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await browser.close();
    }

    return productData;
};

// Function to scroll the page
const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            const distance = 100; // Distance to scroll each time
            const delay = 100; // Delay in milliseconds
            const totalHeight = 0;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // Stop scrolling when we reach the bottom
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, delay);
        });
    });
};

// Run the scraper
scrapeProduct().then(data => console.log("✅ Scraping Complete!", data)); */