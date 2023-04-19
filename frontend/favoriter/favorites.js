const applyTheme = async () => {
  let response = await axios.get("http://localhost:1337/api/startpage");
  let theme = response.data.data.attributes.theme;
  console.log(theme);

  document.body.classList.add(theme);
};

const { data } = await axios.get(`http://localhost:1337/api/users`, {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
const userList = document.getElementById("displayUsername");
data.forEach((user) => {
  const username = user.username;
  console.log(username);
  userList.textContent = `${sessionStorage.getItem("username")}`;
});

console.log("token", data);

const renderLikedBooks = async () => {
  const { data } = await axios.get(
    `http://localhost:1337/api/users/${sessionStorage.getItem(
      "loginId"
    )}?populate=deep,3`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  console.log(data); // Träffar användaren

  const likedBooks = data.books;
  console.log(likedBooks); // Träffar sparade boken
  const bookList = document.querySelector("#favorite-bookList");
  if (likedBooks.length > 0) {
    bookList.innerHTML = ""; // Clear the list before adding new items
    likedBooks.forEach((book) => {
      let div = document.createElement("div");
      const { title, writer, pages, date } = book;
      div.innerHTML += `
      <img src="http://localhost:1337${book.cover[0].url}"
      height="150"/>
      Titel: ${title}
      Författare: ${writer}
      Antal sidor: ${pages}
      Utgivningsdatum: ${date}`;
      let removeBtn = document.createElement("button");
      removeBtn.innerText = "Ta bort från favoriter";
      div.append(removeBtn);
      bookList.append(div);
    });
  } else {
    bookList.innerHTML = "Du har för tillfället inga sparade böcker";
  }
};

applyTheme();
renderLikedBooks();
