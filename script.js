function SubmitComplaint() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let uniqueKey = "complaint#" + complaints.length + "_" + Date.now();

    //getting values from form
    let complaint_name = document.getElementById("complaint_name").value
    let complaint_email = document.getElementById("complaint_email").value
    let complaint_details = document.getElementById("complaint_details").value

    let arr = [complaint_name, complaint_email, complaint_details]

    //add this complaint to the complaint list
    complaints.push({ key: uniqueKey, data: arr});
    localStorage.setItem("complaints", JSON.stringify(complaints));
    console.log("Complaint submitted successfully!");

    //clear form
    document.getElementById("complaint_name").value = "";
    document.getElementById("complaint_email").value = "";
    document.getElementById("complaint_details").value = "";

    alert("Your complaint has been submitted. Thank you!");
}

function increase_quantity() {
    let quantity = parseInt(document.getElementById("item_quantity").innerText);
    quantity++;  // Increase the quantity by 1
    document.getElementById("item_quantity").innerText = quantity;  // Update the quantity display
    itemPriceMultiplier();  // Recalculate the total price after increasing the quantity
}

function decrease_quantity() {
    let quantity = parseInt(document.getElementById("item_quantity").innerText);
    if (quantity > 1) {  // Prevent the quantity from going below 1
        quantity--;  // Decrease the quantity by 1
        document.getElementById("item_quantity").innerText = quantity;  // Update the quantity display
        itemPriceMultiplier();  // Recalculate the total price after decreasing the quantity
    }
}

// original price should come from .csv export
// ie. product_id 000101 has product_price $29.99
function itemPriceMultiplier() {
    // Get the base price of the product (it's stored in the innerText of the product_price element)
    let basePrice = parseFloat(document.getElementById("product_price").getAttribute("data-price"));  // Use data-price as the base value

    // Get the quantity (ensure the quantity is an integer)
    let quantity = parseInt(document.getElementById("item_quantity").innerText);

    // Check if both values are valid numbers
    if (isNaN(basePrice) || isNaN(quantity)) {
        console.error("Price or quantity is not a number.");
        return;
    }

    // Calculate the total price
    let total = basePrice * quantity;

    // Set the total price in the product_price element with proper formatting
    document.getElementById("product_price").innerText = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const priceElement = document.getElementById("product_price");

    // Get the base price from the product page and store it as a data attribute
    const basePrice = parseFloat(priceElement.innerText.replace('$', ''));  // Remove $ sign before parsing

    // Store the base price for future calculations in a data-price attribute
    priceElement.setAttribute("data-price", basePrice);

    // Call itemPriceMultiplier() to initialize the price calculation with the correct quantity
    itemPriceMultiplier();
});

// Function to display a single product on product_page.html
function displayProduct(product) {
    document.getElementById("product_image_A").src = product.image;
    document.getElementById("product_name").innerText = product.name;
    document.getElementById("product_price").innerText = parseFloat(product.price).toFixed(2);
    // document.getElementById("product_id").innerText = product.id;
}

document.addEventListener('DOMContentLoaded', () => {
    const filePath = "https://raw.githubusercontent.com/chph-xyz/easy-clothes/refs/heads/main/inventory.csv";

    // Fetch the CSV
    fetch(filePath)
        .then(response => response.text())  // Read the CSV file as text
        .then(csvData => {
            // Parse the CSV data
            const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
            
            // Filter out the "male" items
            const maleItems = parsedData.data.filter(item => item.gender === 'male');
            
            // Select the first 6 "male" items
            const first6MaleItems = maleItems.slice(0, 6);

            // Populate the HTML elements with data
            populateProductData(first6MaleItems);
        })
        .catch(error => {
            console.error('Error fetching the CSV:', error);
        });

    // Function to populate the product data
    function populateProductData(items) {
        items.forEach((item, index) => {
            const itemNumber = index + 1;

            // Populate product image
            document.getElementById(`item_${itemNumber}`).src = item.image_path; // Assuming 'image_path' in CSV
            document.getElementById(`item_${itemNumber}`).alt = item.product_name;

            // Populate gender
            document.getElementById(`gender_${itemNumber}`).textContent = item.gender;

            // Populate product name
            document.getElementById(`product_name_${itemNumber}`).textContent = item.product_name;

            // Populate product price
            document.getElementById(`product_price_${itemNumber}`).textContent = `$${item.price}`;
        });
    }
});

// Add to Cart Button Functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelector(".addToCart").addEventListener("click", () => {
    const productName = document.getElementById("product_name").innerText;
    const productPrice = document.getElementById("product_price").innerText;
    const quantity = parseInt(document.getElementById("item_quantity").innerText);

    if (quantity > 0) {
        cart.push({ name: productName, price: productPrice, quantity });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart!");
    } else {
        alert("Please select a valid quantity.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("product_id"); // Get the product_id from URL

    if (productId) {
        // Fetch inventory data
        fetch("https://raw.githubusercontent.com/chph-xyz/easy-clothes/refs/heads/main/inventory.csv")
            .then(response => response.text())
            .then(csvData => {
                const products = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

                // Find the product with the matching ID
                const product = products.find(item => item.product_id === productId);

                if (product) {
                    // Populate fields with product data
                    document.getElementById("product_name").innerText = product.product_name;
                    document.getElementById("product_price").innerText = `$${parseFloat(product.price).toFixed(2)}`;
                    // document.getElementById("product_id").innerText = product.product_id;
                    document.getElementById("product_image_A").src = product.image_path;
                    document.getElementById("product_image_A").alt = product.product_name;

                    // Optional: Populate additional fields
                    // document.getElementById("product_gender").innerText = product.gender;
                    // document.getElementById("product_type").innerText = product.type;
                } else {
                    console.error("Product not found in inventory.");
                }
            })
            .catch(error => console.error("Error loading inventory:", error));
    } else {
        console.error("No product_id specified in URL.");
    }
});

function sendItemDataToLocalStorage(genderId, nameId, priceId, imageId) {
    // Extract content from the provided element IDs
    // const productCode = document.getElementById(productId).innerText;
    const gender = document.getElementById(genderId).innerText;
    const productName = document.getElementById(nameId).innerText;
    const productPrice = document.getElementById(priceId).innerText;
    const productImage = document.getElementById(imageId).src;

    const productData = {
        gender,
        name: productName,
        price: productPrice,
        image: productImage,
    };

    // Save the product data to localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(productData));

    console.log("Product data saved:", productData);

    // Allow navigation to proceed
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the product data from localStorage
    const productData = JSON.parse(localStorage.getItem("selectedProduct"));

    if (productData) {
        // Populate the product page with the retrieved data
        // document.getElementById("product_id").innerText = productData.id;
        document.getElementById("product_name").innerText = productData.name;
        document.getElementById("product_price").innerText = productData.price;
        document.getElementById("product_image_A").src = productData.image;
        document.getElementById("product_image_A").alt = productData.name;

        // Optional: Use gender data if needed
        console.log("Gender:", productData.gender);
    } else {
        console.error("No product data found in localStorage.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Get the filtered products from localStorage
    const products = JSON.parse(localStorage.getItem("searchResults")) || [];

    if (products.length === 0) {
        document.querySelector(".rowForProducts").innerHTML = "<p>No results found.</p>";
        return;
    }

    const resultsPerPage = 6; // Number of items to display per page
    let currentPage = 1;

    function renderPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;

        const paginatedProducts = products.slice(startIndex, endIndex);

        const productContainer = document.querySelector(".rowForProducts");
        productContainer.innerHTML = ""; // Clear existing products

        // Loop through each product and create a card
        paginatedProducts.forEach(product => {
            const productCard = document.createElement("a");
            productCard.href = `product_page.html?product_id=${product.product_id}`;
            productCard.classList.add("product-link");

            productCard.innerHTML = `
                <div class="card">
                    <img class="product-image" src="${product.image_path}" alt="${product.product_name}">
                    <p>${product.product_name}</p>
                    <p>$${product.price}</p>
                </div>
            `;
            productContainer.appendChild(productCard);
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(products.length / resultsPerPage);
        const paginationContainer = document.querySelector(".pagination");

        paginationContainer.innerHTML = ""; // Clear existing pagination

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("pagination-button");
            if (i === currentPage) pageButton.classList.add("active");

            pageButton.addEventListener("click", () => renderPage(i));
            paginationContainer.appendChild(pageButton);
        }
    }

    renderPage(1);
});

function performSearch(event) {
    console.log("abc testing")
    event.preventDefault();  // Prevent the default form submission behavior (page reload)

    const query = document.getElementById("name").value.toLowerCase();
    if (!query) {
        alert("Please enter a search term!");
        return;
    }

    // Fetch the inventory CSV
    fetch("https://raw.githubusercontent.com/chph-xyz/easy-clothes/refs/heads/main/inventory.csv")
        .then(response => response.text())
        .then(csvData => {
            const products = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

            // Filter products based on the search query
            const filteredProducts = products.filter(product =>
                product.product_name.toLowerCase().includes(query)
            );

            // Save the filtered results to localStorage
            localStorage.setItem("searchResults", JSON.stringify(filteredProducts));

            // Redirect to item_browse.html to show the results
            window.location.href = "item_browse.html"; // Ensure that page redirection works
        })
        .catch(error => console.error("Error fetching inventory:", error));
}

document.addEventListener("DOMContentLoaded", function () {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const listOfAddedItems = document.getElementById("listOfAddedItems");

    listOfAddedItems.innerHTML = ""; // Clear existing static content

    if (cartItems.length === 0) {
        listOfAddedItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "itemInCart";

            itemDiv.innerHTML = `
                <div class="itemImageInCart">
                    <img src="${item.imageSrc}" alt="${item.name}" id="itemImage">
                </div>
                <ul id="itemDetailsInCart">
                    <li id="itemName">${item.name}</li>
                    <li id="itemGender">${item.gender}</li><br>
                    <li id="itemPrice">$${item.price.toFixed(2)}</li>
                </ul>
                <div class="removeFromCart">
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            `;

            listOfAddedItems.appendChild(itemDiv);
        });
    }
});

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload(); // Reload the page to update the cart
}

// does not actually validate if anything is in cart, ran out of time...
function purchaseButton() {
    alert("Your purchase has been completed. Thank you!");
}

//calculate all in shopping cart
function calculateAll(subtotal, shipping, tax, total) {
    subtotal = document.getElementById("subtotal").value
    shipping = document.getElementById("shipping").value
    tax = document.getElementById("tax").value
    total = subtotal + shipping + tax

    document.getElementById("subtotal").value = subtotal
    document.getElementById("shipping").value = shipping
    document.getElementById("tax").value = tax
    document.getElementById("total").value = total
}

// AddToCart grabs a product_id from localStorage and uses it to pull data from .csv,
// then uses that data to build an item entry in shoppingCart.html...
