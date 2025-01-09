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

//refuse friend
const listButtonRefuseFriend = document.querySelectorAll("[button-refuse-friend]");
if (listButtonRefuseFriend.length > 0) {
    listButtonRefuseFriend.forEach((button) => {
        button.addEventListener("click", (e) => {

            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("button-refuse-friend");
            console.log(userId);
            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        }); 
    }); 
}


//accept friend
const listButtonAcceptFriend = document.querySelectorAll("[button-accept-friend]");
if (listButtonAcceptFriend.length > 0) {
    listButtonAcceptFriend.forEach((button) => {
        button.addEventListener("click", (e) => {

            button.closest(".box-user").classList.add("accepted");
            const userId = button.getAttribute("button-accept-friend");
            console.log(userId);
            socket.emit("CLIENT_ACCEPT_FRIEND", userId);
        }); 
    }); 
}


//SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const badgeUsersAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUsersAccept.getAttribute("badge-users-accept");
    if (userId == data.userId) {
        badgeUsersAccept.innerHTML = data.lengthAcceptFriend;
    }
});