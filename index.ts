import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";

const app = express();
const port = 3300;

app.get("/api/scrape", async (req, res) => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
  const headers = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,pt;q=0.8",
      Accept:
        "text/html, */*; q=0.01",
      Referer: url,
      "Cache-Control": "no-cache",
      Cookie: "session-id=146-3840657-2536022;", // Se necessário trocar para outro cookie de sessão do seu navegador
    },
  };

  try {
    const response = await axios.get(url, headers);

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const products = document.querySelectorAll(".s-result-item");

    const results: { title: string; rating: string; reviews: string; image: string }[] = [];

    products.forEach((product) => {
      const titleElement = product.querySelector("h2 span");
      const ratingElement = product.querySelector("i span.a-icon-alt");
      const reviewsElement = product.querySelector("span.a-size-base.s-underline-text");
      const imageElement = product.querySelector("img.s-image");

      const title = titleElement ? titleElement.textContent.trim() : "No title";
      const rating = ratingElement ? ratingElement.textContent.split(" ")[0] : "No rating";
      const reviews = reviewsElement ? reviewsElement.textContent.replace(/,/g, "") : "No reviews";
      const image = imageElement ? imageElement.src : "No image";

      results.push({ title, rating, reviews, image });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
