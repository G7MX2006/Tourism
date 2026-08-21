let loginForm = document.getElementById("loginForm");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("pass");
let rememberMe = document.getElementById("checkme") || document.getElementById("rem");

let errorMsg = document.createElement("p");
errorMsg.id = "errorMsg";
errorMsg.style.color = "#ff6b6b";
errorMsg.style.fontSize = "0.85rem";
errorMsg.style.marginTop = "10px";
errorMsg.style.textAlign = "center";

loginForm.appendChild(errorMsg);

const API_URL = "http://localhost:3000/users";

const savedEmail = localStorage.getItem("rememberedEmail");
if (savedEmail) {
    emailInput.value = savedEmail;
    if (rememberMe) rememberMe.checked = true;
}

async function Login(email, password) {
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

        if (!matchedUser) {
            errorMsg.textContent = "Invalid email or password!";
            return;
        }

     
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));

       
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        alert("Logged in successfully!");

       
        const previousPage = sessionStorage.getItem("returnUrl") || "../index.html";
        sessionStorage.removeItem("returnUrl");
        window.location.href = previousPage;

    } catch (err) {
        errorMsg.textContent = "Connection error, make sure server is running!";
    }
}

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorMsg.textContent = "";

    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    if (!email || !password) {
        errorMsg.textContent = "Please fill in all fields.";
        return;
    }

    await Login(email, password);
});
