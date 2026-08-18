let form = document.getElementById("form");
let passwordInput = document.getElementById("password");
let emailInput = document.getElementById("email");
let userNameInput = document.getElementById("fullName");


let nameValidation = document.getElementById("nameValidation");
let emailValidation = document.getElementById("emailValidation");
let passValidation = document.getElementById("passValidation");

// رابط الـ API
const API_URL = "http://localhost:3000/users";

// Regex Patterns
const nameRegex = /^[A-Za-z\s]{3,35}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

async function Register(userData) {
    try {
        let response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Registration failed");
        }

        localStorage.setItem("currentUser", JSON.stringify(result.user || userData));
        alert("Account created successfully!");
        form.reset();

    } catch (err) {
        alert(err.message || "Connection error, please try again.");
    }
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    
    nameValidation.textContent = "";
    emailValidation.textContent = "";
    passValidation.textContent = "";

    let userName = userNameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    
    if (!nameRegex.test(userName)) {
        nameValidation.textContent = "Name must contain letters only (3 to 35 characters).";
        return;
    }

   
    if (!emailRegex.test(email)) {
        emailValidation.textContent = "Please enter a valid email address.";
        return;
    }

    // 3. فحص الباسورد
    if (password.length < 8) {
        passValidation.textContent = "Password must be at least 8 characters long.";
        return;
    }

  
    try {
        let response = await fetch(API_URL);
        if (!response.ok) {
            alert("Error fetching users data");
            return;
        }

        let data = await response.json();
        let match = data.find((item) => item.email.toLowerCase() === email.toLowerCase());

        if (match) {
            emailValidation.textContent = "This email is already registered!";
            return;
        }

    } catch (err) {
        alert("Server connection failed!");
        return;
    }

   
    const user = {
        id: Date.now(),
        name: userName,
        email: email,
        password: password
    };
   
    Register(user);
     form.reset();
});