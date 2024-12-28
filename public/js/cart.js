//change quantity product in cart
const inputQuantity = document.querySelectorAll("input[name='quantity']");
const buttonIncrease = document.querySelectorAll("[btn-quantity-increase]");
const buttonDecrease = document.querySelectorAll("[btn-quantity-decrease]");

if (buttonIncrease.length > 0) {
    buttonIncrease.forEach(button => {
        button.addEventListener("click", (e) => {
            const input = button.parentNode.parentNode.querySelector("[name='quantity']");
            if (parseInt(input.value) < parseInt(input.max)) {
                input.value = parseInt(input.value) + 1;
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

if (buttonDecrease.length > 0) {
    buttonDecrease.forEach(button => {
        button.addEventListener("click", (e) => {
            const input = button.parentNode.parentNode.querySelector("[name='quantity']");
            if (parseInt(input.value) > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("product-id");
            const quantity = input.value;
            if (quantity > 0 && quantity <= parseInt(input.max)) {
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
        });

    });
}
