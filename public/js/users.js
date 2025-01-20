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

// SERVER_RETURN_INFOR_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFOR_ACCEPT_FRIEND", (data) => {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    //page request friend
    if (dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-user-accept");
        if (userId == data.userId) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.inforRequester._id);
            //img dont have source
            const html = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img alt="avatar">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.inforRequester.fullName}</div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-3" button-accept-friend=${data.inforRequester._id}>Accept</button>
                            <button class="btn btn-sm btn-secondary mr-1" button-refuse-friend=${data.inforRequester._id}>Refuse</button>
                            <button class="btn btn-sm btn-secondary mr-1" button-deleted-friend=${data.inforRequester._id} disabled="disabled">Deleted</button>
                            <button class="btn btn-sm btn-primary mr-1" button-accepted-friend=${data.inforRequester._id} disabled="disabled">Accepted</button>
                        </div>
                    </div>
                </div>
            `;
            newBoxUser.innerHTML = html;
            dataUserAccept.appendChild(newBoxUser);
            //add listener for button refuse 
            const buttonRefuseFriend = newBoxUser.querySelector("[button-refuse-friend]");
            if (buttonRefuseFriend) {
                buttonRefuseFriend.addEventListener("click", (e) => {
                    buttonRefuseFriend.closest(".box-user").classList.add("refuse");
                    const userId = buttonRefuseFriend.getAttribute("button-refuse-friend");
                    socket.emit("CLIENT_REFUSE_FRIEND", userId);
                });
            }
            //add listener for button accept
            const buttonAcceptFriend = newBoxUser.querySelector("[button-accept-friend]");
            if (buttonAcceptFriend) {
                buttonAcceptFriend.addEventListener("click", (e) => {
    
                    buttonAcceptFriend.closest(".box-user").classList.add("accepted");
                    const userId = buttonAcceptFriend.getAttribute("button-accept-friend");
                    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
                });
            }
        }
    }
    //page list user
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
        if (userId == data.userId) {
            const boxRequester = dataUserNotFriend.querySelector(`[user-id="${data.inforRequester._id}"]`);
            if (boxRequester) {
                dataUserNotFriend.removeChild(boxRequester);
            }
        }
    }
});

//SERVER_RETURN_USER_ID_CANCEL
socket.on("SERVER_RETURN_USER_ID_CANCEL", (data) => {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    //page request friend
    if (dataUserAccept) {
        const userId = dataUserAccept.getAttribute("data-user-accept");
        if (userId == data.idReceiver) {
            //remove requester
            const boxRequester = dataUserAccept.querySelector(`[user-id="${data.idRequester}"]`);
            if (boxRequester) {
                dataUserAccept.removeChild(boxRequester);
            }
        }
    }
    //page list user  
    const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
    if (dataUserNotFriend) {
        const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
        if (userId == data.idReceiver) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.inforRequester._id);
            //img dont have source
            const html = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img alt="avatar">
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.inforRequester.fullName}</div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-3" button-add-friend=${data.inforRequester._id}>Add friend</button>
                            <button class="btn btn-sm btn-secondary mr-1" button-cancel-friend=${data.inforRequester._id}>Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            newBoxUser.innerHTML = html;
            dataUserNotFriend.appendChild(newBoxUser);
            //add listener for button add fr 
            const buttonAddFriend = newBoxUser.querySelector("[button-add-friend]");
            if (buttonAddFriend) {
                buttonAddFriend.addEventListener("click", (e) => {
                    buttonAddFriend.closest(".box-user").classList.add("add");
                    const userId = buttonAddFriend.getAttribute("button-add-friend");        
                    socket.emit("CLIENT_ADD_FRIEND", userId);
                });
            }
            //add listener for button cancel
            const buttonCancelFriend = newBoxUser.querySelector("[button-cancel-friend]");
            if (buttonCancelFriend) {
                buttonCancelFriend.addEventListener("click", (e) => {
                    buttonCancelFriend.closest(".box-user").classList.remove("add");
                    const userId = buttonCancelFriend.getAttribute("button-cancel-friend");
                    socket.emit("CLIENT_CANCEL_FRIEND", userId);
                });
            }
        }
    }

});

const onlineMarkup = (userId, status) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", status);

        }
    }
} 

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    onlineMarkup(userId, "online");
});

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
    onlineMarkup(userId, "offline");
});

// //accept friend
// const listButtonAcceptFriend = document.querySelectorAll("[button-accept-friend]");
// if (listButtonAcceptFriend.length > 0) {
//     listButtonAcceptFriend.forEach((button) => {
//         button.addEventListener("click", (e) => {

//             button.closest(".box-user").classList.add("accepted");
//             const userId = button.getAttribute("button-accept-friend");
//             console.log(userId);
//             socket.emit("CLIENT_ACCEPT_FRIEND", userId);
//         });
//     });
// }

//unfiend
const buttonUnfriend = document.querySelectorAll("[button-unfriend]");
if (buttonUnfriend) {
    buttonUnfriend.forEach(button => {
        button.addEventListener("click", (e) =>{
            const boxUser = button.closest(".box-user");
            boxUser.classList.add("unfriended");
            const userId = boxUser.getAttribute("user-id");
            socket.emit("CLIENT_UNFRIEND", userId);
        });
    })
}