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
    const userId = dataUserAccept.getAttribute("data-user-accept");
    if (userId == data.userId) {
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
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
});