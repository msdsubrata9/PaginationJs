document.addEventListener("DOMContentLoaded", function () {
  const app = document.querySelector(".app");
  let products = [];
  let page = 1;

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100");
      const data = await response.json();
      if (data && data.products) {
        products.push(...data.products);
        render();
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const render = () => {
    const productsContainer = document.createElement("div");
    productsContainer.classList.add("products");

    const pagination = document.createElement("div");
    pagination.classList.add("pagination");

    if (products.length > 0) {
      products.slice(page * 10 - 10, page * 10).forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("products__single");
        productElement.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}"/>
          <span>${product.title}</span>
        `;
        productsContainer.appendChild(productElement);
      });

      if (page > 1) {
        const prevBtn = createPaginationButton("◀️");
        pagination.appendChild(prevBtn);
      }

      for (let i = 1; i <= Math.ceil(products.length / 10); i++) {
        const pageBtn = createPaginationButton(i, page === i);
        pagination.appendChild(pageBtn);
      }

      if (page < Math.ceil(products.length / 10)) {
        const nextBtn = createPaginationButton("▶️");
        pagination.appendChild(nextBtn);
      }

      // Event delegation: single listener on the container
      pagination.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
          const text = e.target.textContent;

          if (text === "◀️") {
            selectPageHandle(page - 1);
          } else if (text === "▶️") {
            selectPageHandle(page + 1);
          } else {
            const selected = parseInt(text);
            if (!isNaN(selected)) {
              selectPageHandle(selected);
            }
          }
        }
      });
    }

    app.innerHTML = "";
    app.appendChild(productsContainer);
    app.appendChild(pagination);
  };

  const createPaginationButton = (text, isSelected = false) => {
    const button = document.createElement("button");
    button.textContent = text;
    if (isSelected) {
      button.classList.add("pagination_selected");
    }
    return button;
  };

  const selectPageHandle = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(products.length / 10) &&
      selectedPage !== page
    ) {
      page = selectedPage;
      render();
    }
  };
  fetchProducts();
});
