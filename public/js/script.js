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