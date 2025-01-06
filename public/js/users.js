//send request
const listButtonAddFriend = document.querySelectorAll("[button-add-friend]");
if (listButtonAddFriend.length > 0) {
    listButtonAddFriend.forEach((button) => {
        button.addEventListener("click", (e) => {
            
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("button-add-friend");
            console.log(userId);

            socket.emit("CLIENT_ADD_FRIEND", userId);
        }); 
    }); 
}

//cancel friend
const listButtonCancelFriend = document.querySelectorAll("[button-cancel-friend]");
if (listButtonCancelFriend.length > 0) {
    listButtonCancelFriend.forEach((button) => {
        button.addEventListener("click", (e) => {
            
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("button-cancel-friend");
            console.log(userId);
            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        }); 
    }); 
}