document.addEventListener("DOMContentLoaded", function() {
  fetch(`http://makeup-api.herokuapp.com/api/v1/products.json`)
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data);
    });
});

function buttonOnclicked() {
  var searchBrand = document.getElementById("makeup_input").value;

  var apiUrl;
  if (searchBrand) {
    apiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${searchBrand}`;
  } else {
    apiUrl = "http://makeup-api.herokuapp.com/api/v1/products.json";
  }

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data);
    });
}

function displayProducts(data) {
  var makeUpElement = document.getElementById("makeUp");

  makeUpElement.innerHTML = ""; // Clear existing content

  // Filter products to only include those with image links
  var productsWithImages = data.filter((product) => product.image_link);

  productsWithImages.slice(0, 20).forEach((product) => {
    var productContainer = document.createElement("div");
    productContainer.classList.add("makeup-product");

    var productImage = document.createElement("img");
    productImage.style.maxWidth = "200px";
    productImage.style.maxHeight = "200px";

    if (product.image_link) {
      productImage.src = product.image_link;
    } else {
      // Use a default image link if no picture is available
      productImage.src = "Cosmetic-Manufacturers-in-Chennai.jpg";
    }

    var productName = document.createElement("h2");
    productName.textContent = product.name;

    var productBrand = document.createElement("p");
    productBrand.textContent = `Brand: ${product.brand}`;

    var productPrice = document.createElement("p");
    productPrice.textContent = `Price: $${product.price}`;

    var productLink = document.createElement("a");
    productLink.href = product.product_link;
    productLink.textContent = "Product Link";
    productLink.style.color = "#ff66b2"; // Pink color
    productLink.style.textDecoration = "none"; // Remove underline

    var lineBreak = document.createElement("br");

    var websiteLink = document.createElement("a");
    websiteLink.href = product.website_link;
    websiteLink.textContent = "Website Link";
    websiteLink.style.color = "#ff66b2"; // Pink color
    websiteLink.style.textDecoration = "none"; // Remove underline

    // Append elements to the product container
    productContainer.appendChild(productImage);
    productContainer.appendChild(productName);
    productContainer.appendChild(productBrand);
    productContainer.appendChild(productPrice);
    productContainer.appendChild(productLink);
    productContainer.appendChild(lineBreak);
    productContainer.appendChild(websiteLink);

    makeUpElement.appendChild(productContainer);
  });
}
