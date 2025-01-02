import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat-input .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        if (content) {
            socket.emit("CLIENT_SEND_MESSAGE", content);
            e.target.elements.content.value = "";
        }
    });
}

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const body = document.querySelector(".chat .chat-messages");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");

    const div = document.createElement("div");
    div.classList.add("message");
    let fullName = "";
    if (myId == data.userId) {
        div.innerHTML = `
            <div class="sent">
                <div class="message-wrapper">
                    <div class="avatar">
                        <img src="https://via.placeholder.com/30" alt="User avatar">
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">${data.content}</div>
                        <div class="message-time">10:30 AM</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="received">
                <div class="message-wrapper">
                    <div class="avatar">
                        <img src="https://via.placeholder.com/30" alt="User avatar">
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">${data.content}</div>
                        <div class="message-time">10:30 AM</div>
                    </div>
                </div>
            </div>
        `;
        fullName = data.fullName;
    }
    
    const divName = document.createElement("div");
    divName.classList.add("inner-name");
    divName.innerHTML = `${fullName}`;
    body.appendChild(divName);
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
});


//scroll chat to bottom 
const bodyChat = document.querySelector(".chat-messages");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;

}

//emoji click
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    document.body.addEventListener("click", (e) => {
        if (tooltip.classList.contains("shown")) {
            tooltip.classList.remove("shown");
        }
    });
    buttonIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        tooltip.classList.toggle("shown");
    });
}
const emojiPicker = document.querySelector('emoji-picker');

if (emojiPicker) {
    const inputChat = document.querySelector(".chat .chat-input input[name='content']");

    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        console.log(icon);
        if (inputChat) {
            inputChat.value = inputChat.value + icon;
        }
    });
    
}
