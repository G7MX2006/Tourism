document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("pass");    
    let errorMsg = document.getElementById("errorMsg");
    if (!errorMsg && loginForm) {
        errorMsg = document.createElement("p");
        errorMsg.id = "errorMsg";
        errorMsg.style.color = "#ff6b6b";
        errorMsg.style.fontSize = "0.85rem";
        errorMsg.style.marginTop = "10px";
        errorMsg.style.textAlign = "center";
        loginForm.appendChild(errorMsg);
    }
    const API_URL = "http://localhost:3000/users";
    if (!loginForm) return;
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        errorMsg.textContent = "";
        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();
        try {
            let response = await fetch(API_URL);
            if (!response.ok) {
                errorMsg.textContent = "Server error, please try again later!";
                return;
            }
            let users = await response.json();
            let matchedUser = users.find(
                (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
            );
            if (matchedUser) {
                localStorage.setItem("currentUser", JSON.stringify(matchedUser));
                const rememberMe = document.getElementById("rem");
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem("rememberedEmail", email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }
                window.location.href = "index.html";
            } else {
                errorMsg.textContent = "Invalid email or password!";
            }
        } catch (err) {
            errorMsg.textContent = "Connection error, make sure server is running!";
        }
    });
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        const rememberMe = document.getElementById("rem");
        if (rememberMe) rememberMe.checked = true;
    }
});