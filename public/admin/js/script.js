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