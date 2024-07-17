const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "email=" +
      encodeURIComponent(email) +
      "&password=" +
      encodeURIComponent(password),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        fetch("/users", {
          method: "GET",
          headers: {
            "Content-Type": "text/html",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            return response.text();
          })
          .then((html) => {
            document.body.innerHTML = html;
          });
      } else {
        console.log("Token does not exist");
      }
    })
    .catch((err) => console.log(err));
});
