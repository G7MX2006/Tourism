let signupForm = document.getElementById("signupform");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("pass");
let confirmPasswordInput = document.getElementById("cpass");
let rememberMe = document.getElementById("rem");

let errorMsg = document.createElement("p");
errorMsg.id = "errorMsg";
errorMsg.style.color = "#ff6b6b";
errorMsg.style.fontSize = "0.85rem";
errorMsg.style.marginTop = "10px";
errorMsg.style.textAlign = "center";

signupForm.appendChild(errorMsg);

const API_URL = "http://localhost:3000/users";
const nameRegex = /^[A-Za-z\u0600-\u06FF]{3,}(?:\s+[A-Za-z\u0600-\u06FF]{3,})+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

async function Register(userData) {
    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            errorMsg.textContent = "Failed to create account. Try again!";
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(userData));

        if (rememberMe && rememberMe.checked) {
            localStorage.setItem("rememberedEmail", userData.email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }


        window.location.href = window.location.origin + "/index.html";

    } catch (err) {
        errorMsg.textContent = "Connection error, make sure server is running!";
    }
}
signupForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorMsg.textContent = "";

    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();
    let confirmPassword = confirmPasswordInput.value.trim();

    if (!nameRegex.test(name)) {
        errorMsg.textContent = "Name must contain letters only (at least 3 characters).";
        return;
    }

    if (!emailRegex.test(email)) {
        errorMsg.textContent = "Please enter a valid email address.";
        return;
    }

    if (password.length < 8) {
        errorMsg.textContent = "Password must be at least 8 characters long.";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match!";
        return;
    }

    try {
        let checkResponse = await fetch(API_URL);
        if (!checkResponse.ok) {
            errorMsg.textContent = "Error fetching users data";
            return;
        }

        let users = await checkResponse.json();
        let match = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

        if (match) {
            errorMsg.textContent = "Email is already registered!";
            return;
        }

    } catch (err) {
        errorMsg.textContent = "Connection error, make sure server is running!";
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password
    };

    await Register(newUser);

});
