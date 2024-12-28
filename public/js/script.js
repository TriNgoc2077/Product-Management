console.log("ok123");
// update price 
const quantity = document.querySelector("#quantity");
const currentPrice = document.querySelector("#currentPrice");
const newPrice = document.querySelector("#newPrice");
quantity.addEventListener("change", (e) => {
    // console.log(parseInt(newPrice.textContent.slice(1)));
    currentPrice.textContent = (quantity.value * parseInt(newPrice.textContent.slice(1))).toFixed(1);
});

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