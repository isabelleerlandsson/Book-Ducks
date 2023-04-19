const applyTheme = async () => {
  let response = await axios.get("http://localhost:1337/api/startpage");
  let theme = response.data.data.attributes.theme;
  console.log(theme);

  document.body.classList.add(theme);
};

const renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/books?populate=*");
  let bookList = document.querySelector("#Startpage-bookList");

  console.log(response.data);
  if (response.data) {
    let books = response.data.data;
    books.forEach((book) => {
      let div = document.createElement("div");
      let { title, writer, pages, date } = book.attributes;
      div.innerHTML += `
      <img src="http://localhost:1337${book.attributes.cover.data[0].attributes.url}"
      height="150"/>
      Titel: ${title}
      Författare: ${writer}
      Antal sidor: ${pages}
      Utgivningsdatum: ${date}`;
      bookList.append(div);
    });
  }
};

applyTheme();
renderPage();
