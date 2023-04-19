const applyTheme = async () => {
  let response = await axios.get("http://localhost:1337/api/startpage");
  let theme = response.data.data.attributes.theme;
  console.log(theme);

  document.body.classList.add(theme);
};

// Hämta användarens namn och skriv ut
const { data } = await axios.get(`http://localhost:1337/api/users?populate=*`, {
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
const userList = document.getElementById("displayUsername");
data.forEach((user) => {
  const username = user.username;
  userList.textContent = `${sessionStorage.getItem("username")}`;
});

console.log("token", data);

const renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/books?populate=*");
  let bookList = document.querySelector("#bookList");

  console.log(response.data);
  if (response.data) {
    let books = response.data.data;
    books.forEach((book) => {
      let div = document.createElement("div");
      let { title, writer, pages, date, description } = book.attributes;
      let averageGrade = countGrade(book.attributes.ratings.data);
      console.log(book.attributes.ratings.data);
      div.innerHTML += `
      <img src="http://localhost:1337${book.attributes.cover.data[0].attributes.url}"/>
      Titel: ${title}
      Författare: ${writer}
      Antal sidor: ${pages}
      Utgivningsdatum: ${date} 
      Beskrivning: ${description}
      <select> 
      <option>Ge omdöme</option> 
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
        <option>6</option>
        <option>7</option>
        <option>8</option>
        <option>9</option>
        <option>10</option>
        </select>
    Snittbetyg: ${averageGrade}
        `;
      console.log(book.attributes.cover.data[0].attributes);
      let button = document.createElement("button");
      button.innerText = "Spara omdöme";
      let likeBtn = document.createElement("button");
      likeBtn.innerText = "Lägg till i favoriter";
      div.append(button, likeBtn);
      bookList.append(div);

      button.addEventListener("click", (e) => {
        let ratingValue = e.target.parentNode.querySelector("select").value;
        submitRating(ratingValue, book.id);
      });

      likeBtn.addEventListener("click", () => {
        console.log("like");
        favorites(book.id);
      });
    });

    let submitRating = async (value, bookId) => {
      console.log(sessionStorage.getItem("loginId"));
      let response = await axios.post(
        "http://localhost:1337/api/ratings",
        {
          data: {
            rate: value,
            users_permissions_user: sessionStorage.getItem("loginId"),
            book: bookId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      return response;
    };

    let favorites = async (bookId) => {
      console.log(sessionStorage.getItem("loginId"));
      let response = await axios.get(
        `http://localhost:1337/api/users/${sessionStorage.getItem(
          "loginId"
        )}?populate=*`
      );
      let savedBooks = [];
      response.data.books.forEach((book) => {
        savedBooks.push(book.id);
      });
      savedBooks.push(bookId);
      function removeDuplicates(arr) {
        return [...new Set(arr)];
      }
      addSavedBook(removeDuplicates(savedBooks));
    };
    let addSavedBook = async (id) => {
      let response = await axios.put(
        `http://localhost:1337/api/users/${sessionStorage.getItem("loginId")}`,
        {
          books: id,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
    };
  }
};

let countGrade = (ratings) => {
  let count = 0;
  ratings.forEach((rating) => {
    count += rating.attributes.rate;
    console.log(rating.attributes.rate);
  });
  if ((count = Math.round(count / ratings.length))) {
    return count;
  } else {
    return "";
  }
};
applyTheme();
renderPage();

const logout = () => {
  console.log("clicked");
  sessionStorage.removeItem("token", data.jwt);
  window.location.href = `/frontend/login/login.html`;
  alert("Du är nu utloggad");
};

document.querySelector("#logout").addEventListener("click", logout);
