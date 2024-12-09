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
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        
        e.preventDefault(); //prevent redirection => search by status feature
        // console.log(e.target.elements.keyword.value);
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
