document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".api-renderer").forEach(function (container) {
    const apiUrl = container.getAttribute("data-api-url");
    const limit = container.getAttribute("data-api-limit");
    const grid = container.querySelector(".api-renderer__grid");
    const loader = container.querySelector(".api-renderer__loading");
    const errorEl = container.querySelector(".api-renderer__error");
    const retryBtn = container.querySelector(".api-renderer__retry-btn");

    function fetchData() {
      // Reset state
      loader.style.display = "flex";
      errorEl.style.display = "none";
      grid.style.display = "none";
      grid.innerHTML = "";

      // Append limit if using default fakestoreapi
      let url = apiUrl;
      if (limit && apiUrl.includes("fakestoreapi.com") && !apiUrl.includes("limit=")) {
        const separator = apiUrl.includes("?") ? "&" : "?";
        url = apiUrl + separator + "limit=" + limit;
      }

      fetch(url)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
          }
          return response.json();
        })
        .then(function (data) {
          const products = Array.isArray(data) ? data : [];
          if (products.length === 0) {
            throw new Error("No products found.");
          }

          // Render products
          products.forEach(function (product) {
            const card = document.createElement("div");
            card.className = "api-renderer__card";

            // Safely parse properties
            const imageSrc = product.image || "";
            const rawTitle = product.title || "Unnamed Product";
            const titleText = rawTitle.length > 52 ? rawTitle.substring(0, 52) + "..." : rawTitle;
            const priceVal = typeof product.price === "number" ? product.price : 0.00;
            const rawDesc = product.description || "No description available.";
            const descText = rawDesc.length > 110 ? rawDesc.substring(0, 110) + "..." : rawDesc;
            
            const ratingObj = product.rating || { rate: 4.0, count: 99 };
            const rate = ratingObj.rate || 0.0;
            const count = ratingObj.count || 0;
            const starsHTML = getStarsHTML(rate);

            card.innerHTML = `
              <div class="api-renderer__image-container">
                <img class="api-renderer__image" src="${imageSrc}" alt="${rawTitle}" loading="lazy" />
              </div>
              <div class="api-renderer__info">
                <h3 class="api-renderer__product-title">${titleText}</h3>
                <div class="api-renderer__rating">
                  <span class="api-renderer__stars">${starsHTML}</span>
                  <span class="api-renderer__rating-count">(${count})</span>
                </div>
                <div class="api-renderer__price-row">
                  <span class="api-renderer__price">$${priceVal.toFixed(2)}</span>
                  <span class="api-renderer__prime"></span>
                </div>
                <p class="api-renderer__desc">${descText}</p>
                <button class="api-renderer__add-btn" type="button">Add to Cart</button>
              </div>
            `;
            grid.appendChild(card);
          });

          // Toggle displays
          loader.style.display = "none";
          grid.style.display = "grid";
        })
        .catch(function (error) {
          console.error("API Data Renderer fetch failed:", error);
          loader.style.display = "none";
          errorEl.style.display = "block";
        });
    }

    function getStarsHTML(rate) {
      let html = "";
      const fullStars = Math.floor(rate);
      const halfStar = rate % 1 >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;
      
      for (let i = 0; i < fullStars; i++) {
        html += "★";
      }
      if (halfStar) {
        html += "★"; // Render full star as simplification, or can be custom character
      }
      for (let i = 0; i < emptyStars; i++) {
        html += "☆";
      }
      return html;
    }

    if (retryBtn) {
      retryBtn.addEventListener("click", fetchData);
    }

    fetchData();
  });
});
