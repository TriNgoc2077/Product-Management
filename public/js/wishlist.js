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

//  form(action=`/cart/add/${item.product_id}` method="POST")
