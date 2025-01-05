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
            socket.emit("CLIENT_SEND_TYPING", "hidden");

        }
    });
}

//SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const bodyChat = document.querySelector(".chat-messages");
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const boxTyping = document.querySelector(".inner-list-typing");

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
    bodyChat.insertBefore(divName, boxTyping);
    bodyChat.insertBefore(div, boxTyping);
    bodyChat.scrollTop = bodyChat.scrollHeight;
});


//scroll chat to bottom 
const bodyChat = document.querySelector(".chat-messages");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;

}
//Show Typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
        // keyup 1 => clearTimeout in queue, but it's empty, then setTimeOut 1 is include queue(start countdown)
        //key up 2 => clearTimeout -> clear setTimeout 1, then setTimeOut 2 is include queue
        //continue while user stop typing
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }, 1000);
};


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

//insert emoji
const emojiPicker = document.querySelector('emoji-picker');

if (emojiPicker) {
    const inputChat = document.querySelector(".chat .chat-input input[name='content']");

    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        console.log(icon);
        if (inputChat) {
            const start = inputChat.selectionStart;
            const end = inputChat.selectionEnd;

            const textBefore = inputChat.value.substring(0, start);
            const textAfter = inputChat.value.substring(end);

            inputChat.value = textBefore + icon + textAfter;

            const newCursorPosition = start + icon.length;
            inputChat.setSelectionRange(newCursorPosition, newCursorPosition);
            
            inputChat.focus();

            showTyping();
        }
    });
    var timeOut;
    inputChat.addEventListener("keyup", () => {
        showTyping();
    });

}

//SERVER_RETURN_TYPING
const listElementTyping = document.querySelector(".chat .inner-list-typing");
if (listElementTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = listElementTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                    <div class="inner-list-typing">
                        <div class="box-typing">
                            <div class="inner-name">${data.fullName}</div>
                            <div class="inner-dots">
                                <span> </span>
                                <span> </span>
                                <span></span>
                            </div>
                        </div>
                    </div> 
                `;
                listElementTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingToRemove = listElementTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingToRemove) {
                listElementTyping.removeChild(boxTypingToRemove);
            }
        }
        
    });
}
