// const { prefixAdmin } = require("../../../config/system");

//process button status and send to url
const buttonStatus = document.querySelectorAll("[button-status]");
console.log(buttonStatus);


if (buttonStatus.length > 0){
    let url = new URL(window.location.href);
    
    buttonStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
        
            if(status){
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
            //redirects to speccified url
        });
    });
}
// End process button 


//form search
const formSearch = document.querySelector("#form-search");
console.log(formSearch);
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); //prevent redirection => search by status feature

        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    }); 
}
//end form search


//pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination) {
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            
            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}
//End pagination

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    //logic of checkall input
    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });
    //logic of check inputs + checkall input
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if (countChecked == inputsId.length){
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }

        });
    });
}

//End Checkbox Multi

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); //prevent page reload(default action)
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );
        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Are you sure delete this products ? ");

            if(!isConfirm) {
                return;
            }
        }

        if (inputChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputChecked.forEach(input => {
                const id = input.value;

                if (typeChange === "change-position") {
                    const position = input
                        .closest("tr") // return "tr" card(parent node)
                        .querySelector("input[name='position']")
                        .value;

                    
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Please select at least one product");
        }
    });
}
//end form change multi

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

//sort
const sort = document.querySelector("[sort]");
if (sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    sortSelect.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        
        window.location.href = url.href;
    });
    //clear sort
    sortClear.addEventListener("click",() => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");   

        window.location.href = url.href;
    });

    //add selected
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        console.log(stringSort);
        optionSelected = sortSelect.querySelector(`option[value=${stringSort}]`);
        console.log(optionSelected);
        optionSelected.selected = true;
    }

}
//end sort


//link to detail with "tr"
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('tr[data-href]');
    rows.forEach(row => {
      row.addEventListener('click', function(e) {
        if (!e.target.closest('.not-click')) {
          window.location.href = this.dataset.href;
        }
      });
    });
  });

//proceed order
const buttonProceed = document.querySelector(".btn-proceed-order");
if (buttonProceed) {
    buttonProceed.addEventListener("click", async (e) => {
        const status = buttonProceed.getAttribute("status");
        const id = buttonProceed.getAttribute("order-id");
        let newStatus;
        if (status == "processing") {
            newStatus = "confirmed";
        } else if (status == "confirmed") {
            newStatus = "shipping";
        } else if (status == "shipping") {
            newStatus = "completed";
        }
        const isConfirm = confirm(`Are you sure move this order to ${newStatus} status ?`);
        if (isConfirm) {
            try {
                await fetch(`/admin/orders/proceed/${id}`, {
                    method: "POST",
                    headers: { "Content-type": "application/json "},
                    body: JSON.stringify({ status: newStatus })
                });
                window.location.reload();
            } catch(error) {
                console.log("new error: ", error);
            }
        }
    });
}

//cancel order
const buttonCancelOrder = document.querySelector(".btn-cancel-order");
if (buttonCancelOrder) {
    buttonCancelOrder.addEventListener("click", async (e) => {
        const id = buttonCancelOrder.getAttribute("order-id");
        const isConfirm = confirm(`Are you sure cancel this order ?`);
        if (isConfirm) {
            try {
                await fetch(`/admin/orders/cancel/${id}`, {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                })
            } catch(error) {
                console.log("new error: ", error);
            }
            window.location.reload();
        }
    });
}
//end cancel order