console.log("ok123");

// update price 
const quantity = document.querySelector("#quantity");
const currentPrice = document.querySelector("#currentPrice");
const newPrice = document.querySelector("#newPrice");
if (quantity){
    quantity.addEventListener("change", (e) => {
        // console.log(parseInt(newPrice.textContent.slice(1)));
        currentPrice.textContent = (quantity.value * parseInt(newPrice.textContent.slice(1))).toFixed(1);
    });
}


// show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]")
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// end show alert

//display pass
const inputPassword = document.querySelector("#password");
if (inputPassword) {
    const span = document.querySelector(".display-password");
    if (span) {
        span.addEventListener("click", (e) => {
            const eye = span.querySelector("i");
            if (eye.classList.contains("fa-eye")) {
                eye.classList.remove("fa-eye");
                eye.classList.add("fa-eye-slash");
                inputPassword.setAttribute("type", "password");
            } else {
                eye.classList.remove("fa-eye-slash");
                eye.classList.add("fa-eye");
                inputPassword.setAttribute("type", "text");

            }
        });
    }
}

//end display pass

// Preview image upload
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    
    uploadImageInput.addEventListener("change", e => {
        console.log(e);
        const [file] = e.target.files;
        if (file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End preview image upload

//cancel order
const buttonCancelOrder = document.querySelectorAll("[button-cancel-order]");
if (buttonCancelOrder) {
    buttonCancelOrder.forEach(button => {
        button.addEventListener("click", async (e) => {
            const order = button.closest("[order-id]");
            console.log(order);
            if (order) {
                const orderId = order.getAttribute("order-id");
                const id = prompt("\nAre you sure cancel this order ?\n\nPlease enter id of order to confirm: ");
                if (id === orderId) {
                    try {
                        await fetch(`/user/orders/cancel/${orderId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                        });
                        console.log("Reloading page...");
                        window.location.reload();
                    } catch(error) {
                        console.log("new error:", error);
                    }
                }
            }
        });
    });
}
//end cancel order


//link to detail with "tr"
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('[data-href]');
    rows.forEach(row => {
      row.addEventListener('click', function(e) {
        if (!e.target.closest('.not-click')) {
          window.location.href = this.dataset.href;
        }
      });
    });
});

//resend otp
const resendButton = document.querySelector("[resend-code-button]");
if (resendButton) {
    resendButton.addEventListener("click", (e) => {
        const form = resendButton.closest("form");
        if (form) {
            form.submit();
        }
    });
}


//wishlist

// State to manage dialog
let shareDialog = null;
function shareProduct(productSlug) {
  // Initialize dialog if not already done
  ShareProductDialog.init();
  // Open dialog with product slug
  ShareProductDialog.open(productSlug);
}

//remove product when click
const buttonAddToCart = document.querySelectorAll("[add-to-cart]");
if (buttonAddToCart) {
  buttonAddToCart.forEach(button => {
    button.addEventListener("click", async (e) => {
      const product = button.closest("[product-item]");
      const productId = product.getAttribute("product-item");

      try {
        await fetch(`/cart/add/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { quantity: 1 },
        });

        await fetch(`/wishlist/remove/${productId}?_method=DELETE`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        window.location.href = "/wishlist";
      } catch (error) {
        console.error(error);
      }
    })
  });
}
//end wishlist

// //quick button add product to cart, wishlist
// const quickButtonWishlist = document.querySelectorAll("[quick-button-add-wishlist]");
// if (quickButtonWishlist) {
//     quickButtonWishlist.forEach(button => {
//         button.addEventListener("click", async (e) => {
//             const id = button.getAttribute("quick-button-add-wishlist");
//             try{
//                 await fetch(`/wishlist/add/${id}`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" }
//                 })
//                 window.location.reload();
//             } catch(error) {
//                 console.log("new error: ", error);
//             }
//         });
//     });
// }
// const quickButtonCart = document.querySelectorAll("[quick-button-add-cart]");
// if (quickButtonCart) {
//     quickButtonCart.forEach(button => {
//         button.addEventListener("click", async (e) => {
//             const id = button.getAttribute("quick-button-add-cart");
//             try{
//                 await fetch(`/cart/add/${id}`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" }
//                 })
//                 window.location.reload();
//             } catch(error) {
//                 console.log("new error: ", error);
//             }
//         });
//     });
// }