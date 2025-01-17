const resendButton = document.querySelector("[resend-code-button]");
if (resendButton) {
    resendButton.addEventListener("click", (e) => {
        const form = resendButton.closest("form");
        if (form) {
            form.submit();
        }
    });
}