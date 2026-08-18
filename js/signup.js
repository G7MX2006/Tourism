document.addEventListener("DOMContentLoaded", () => {
    let signupForm = document.getElementById("signupform");
    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("pass");
    let confirmPasswordInput = document.getElementById("cpass");
    let errorMsg = document.createElement("p");
    errorMsg.id = "errorMsg";
    errorMsg.style.color = "#ff6b6b";
    errorMsg.style.fontSize = "0.85rem";
    errorMsg.style.marginTop = "10px";
    errorMsg.style.textAlign = "center";
    if (signupForm) signupForm.appendChild(errorMsg);
    const API_URL = "http://localhost:3000/users";
    if (!signupForm) return;
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        errorMsg.textContent = "";

        let name = nameInput.value.trim();
        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();
        let confirmPassword = confirmPasswordInput.value.trim();

        if (password !== confirmPassword) {
            errorMsg.textContent = "Passwords do not match!";
            return;
        }
        try {
            let checkResponse = await fetch(API_URL);
            if (checkResponse.ok) {
                let users = await checkResponse.json();
                let emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
                
                if (emailExists) {
                    errorMsg.textContent = "Email is already registered!";
                    return;
                }
            }

            let newUser = { name, email, password };
            let response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "signin.html";
            } else {
                errorMsg.textContent = "Failed to create account. Try again!";
            }

        } catch (err) {
            errorMsg.textContent = "Connection error, make sure server is running!";
        }
    });
});