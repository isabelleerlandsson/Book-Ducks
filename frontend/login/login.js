const applyTheme = async () => {
  let response = await axios.get("http://localhost:1337/api/startpage");
  let theme = response.data.data.attributes.theme;
  console.log(theme);

  document.body.classList.add(theme);
};
// REGISTRATION
let username = document.querySelector("#username");
let registerPassword = document.querySelector("#registerPassword");
let email = document.querySelector("#email");

// LOGIN
let identifier = document.querySelector("#identifier");
let loginPassword = document.querySelector("#password");

let register = async () => {
  let response = await axios.post(
    "http://localhost:1337/api/auth/local/register",
    {
      username: username.value,
      email: email.value,
      password: registerPassword.value,
    }
  );
  console.log(response.data);
  alert("Ditt konto har skapats. Du kan nu logga in!");
};

export const login = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: identifier.value,
    password: loginPassword.value,
  });

  sessionStorage.setItem("token", response.data.jwt);
  sessionStorage.setItem("loginId", response.data.user.id);
  console.log(response.data.user.id);
  sessionStorage.setItem("username", response.data.user.username);

  console.log("token", response.data.jwt);
  if (response.status === 200) {
    let displayName = document.getElementById("displayUsername");
    displayName.innerText = `${identifier.value}`;
    window.location.href = `/frontend/profile/profile.html`;
  } else {
    alert("Vänligen kontrollera inloggningsuppgifter!");
  }
};

document.querySelector("#login").addEventListener("click", login);
document.querySelector("#register").addEventListener("click", register);

applyTheme();
