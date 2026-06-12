const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

 const response = await fetch(
  `http://localhost:3010/users?email=${email}&password=${password}`
);

  const users = await response.json();

  if (users.length > 0) {

    localStorage.setItem(
      "currentUser",
      JSON.stringify(users[0])
    );

    window.location.href = "dashboard.html";

  } else {
    alert("Invalid credentials");
  }
});