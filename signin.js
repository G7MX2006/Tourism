let loginForm = document.getElementById("loginForm");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let errorMsg = document.getElementById("errorMsg");


const API_URL = "http://localhost:3000/users";

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
            alert(`Welcome back, ${matchedUser.name}!`);
            window.location.href = "index.html";
        } else {
          
            errorMsg.textContent = "Invalid email or password!";
        }

    } catch (err) {
        errorMsg.textContent = "Connection error, make sure server is running!";
    }
});