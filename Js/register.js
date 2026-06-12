const baseURL = "http://localhost:3010";

let registerForm = document.getElementById("registerForm");
let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

const registerUser = (e) => {
    e.preventDefault();

    let nameValue = name.value;
    let emailValue = email.value;
    let passwordValue = password.value;
    let confirmPasswordValue = confirmPassword.value;

    if (passwordValue !== confirmPasswordValue) {
        alert("Passwords do not match.");
        return;
    }

    const newUser = {
        name: nameValue,
        email: emailValue,
        password: passwordValue
    };

    fetch(`${baseURL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then((response) => response.json())
   .then((createdUser) => {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(createdUser)
    );

    window.location.href = "dashboard.html";
})
    .catch((error) => {
        console.error("Error:", error);
    });
};




registerForm.addEventListener("submit", registerUser);


