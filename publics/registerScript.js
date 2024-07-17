const form = document.getElementById("registerForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let username = document.getElementById("username").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.message == "User successfully added") {
        window.location.href = "/login";
      } else if (data.message == "User already exist") {
        console.log(data.message);
      }
    })
    .catch((err) => console.log(err));
});
