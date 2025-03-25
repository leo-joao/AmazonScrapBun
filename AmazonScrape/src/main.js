import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
  const keywordInput = document.getElementById("keywordInput");
  const scrapeButton = document.getElementById("scrapeButton");

  const showLoadingSpinner = () => {
    document.getElementById("loadingSpinner").style.display = "flex";
  };

  const hideLoadingSpinner = () => {
    document.getElementById("loadingSpinner").style.display = "none";
  };

  const scrapeProducts = () => {
    const keyword = keywordInput.value;

    if (!keyword) {
      Swal.fire({
        title: "Attention!",
        text: "Please enter a keyword to search!",
        icon: "error",
      });
      return;
    }

    resultsBody.innerHTML = "";
    showLoadingSpinner();

    fetch(`/api/scrape?keyword=${encodeURIComponent(keyword)}`)
      .then((response) => response.json())
      .then((data) => {
        const resultsContainer = document.getElementById("results");
        const resultsBody = document.getElementById("resultsBody");

        resultsContainer.style.display = "block";

        if (data.length === 0) {
          resultsBody.innerHTML =
            "<tr><td colspan='4'>No products found.</td></tr>";
          hideLoadingSpinner();
          return;
        }

        data.forEach((product) => {
          const productRow = document.createElement("tr");

          productRow.innerHTML = `
            <td><img src="${product.image}" alt="Product Image" /></td>
            <td class="details">${product.title}</td>
            <td>${product.rating} stars</td>
            <td>${product.reviews}</td>
          `;

          resultsBody.appendChild(productRow);
        });

        hideLoadingSpinner();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while scraping.");
        Swal.fire({
          title: "An error occurred while scraping!",
          text: error,
          icon: "error",
        });
        hideLoadingSpinner();
      });
  };

  scrapeButton.addEventListener("click", scrapeProducts);

  keywordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      scrapeProducts();
    }
  });
});
