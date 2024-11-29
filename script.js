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
    let currentQuantity = document.getElementById("item_quantity").innerText;
    currentQuantity = parseInt(currentQuantity);
    currentQuantity++;
    document.getElementById("item_quantity").innerText = currentQuantity;
    if (currentQuantity >= 1) {
        itemPriceMultiplier();
    }
}

function decrease_quantity() {
    let currentQuantity = document.getElementById("item_quantity").innerText;
    currentQuantity = parseInt(currentQuantity);
    currentQuantity--;
    document.getElementById("item_quantity").innerText = currentQuantity;
    if (currentQuantity >= 1) {
        itemPriceMultiplier();
    } else {
        document.getElementById("item_quantity").innerText = 0;
    }
}

// original price should come from .csv export
// ie. product_id 000101 has product_price $29.99
function itemPriceMultiplier(original_price) {
    let a = document.getElementById("product_price").innerText;
    let b = document.getElementById("item_quantity").innerText;
    // b = parseInt(b);

    let total =  a * b
    document.getElementById("product_price").innerText = total;
}