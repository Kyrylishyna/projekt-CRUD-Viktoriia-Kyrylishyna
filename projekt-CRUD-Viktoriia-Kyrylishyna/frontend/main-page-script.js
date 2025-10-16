const API_URL_BOOKS = "http://localhost:3000/api/books";

const booksList = document.getElementById("books_list");
const modal = document.getElementById("book_modal");
const addBookBtn = document.getElementById("add_books_btn");
const cancelBtn = document.getElementById("cancel_btn");
const form = document.getElementById("book_form");
const readersBtn = document.getElementById("button_readers");
const booksBtn = document.getElementById("button_books");
const readerSection = document.getElementById("readers_section");
const booksSection = document.getElementById("books_section");

let editingBookId = null;

// render books
async function renderBooks() {
  booksList.innerHTML = "";
  const res = await fetch(API_URL_BOOKS);
  const books = await res.json();

  books.forEach((book) => {
    const div = document.createElement("div");
    div.className = "book_card";
    div.dataset.id = book.id;
    div.innerHTML = `
      <div class="actions_btn">
        <button class="edit_btn" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 
            0 0 1 .707 0l1.293 1.293zm-1.75 
            2.456-2-2L4.939 9.21a.5.5 0 0 
            0-.121.196l-.805 2.414a.25.25 0 0 
            0 .316.316l2.414-.805a.5.5 0 0 
            0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" 
            d="M1 13.5A1.5 1.5 0 0 0 2.5 
            15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 
            0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 
            0 0 1-.5-.5v-11a.5.5 0 0 
            1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 
            1.5 0 0 0 1 2.5z"/>
          </svg>
        </button>
        <button class="delete_btn" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 
            6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 
            1 .5-.5m2.5 0a.5.5 0 0 1 
            .5.5v6a.5.5 0 0 1-1 
            0V6a.5.5 0 0 1 .5-.5m3 
            .5a.5.5 0 0 0-1 
            0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 
            1-1 1H13v9a2 2 0 0 1-2 
            2H5a2 2 0 0 1-2-2V4h-.5a1 
            1 0 0 1-1-1V2a1 1 0 0 
            1 1-1H6a1 1 0 0 1 1-1h2a1 
            1 0 0 1 1 1h3.5a1 1 0 0 
            1 1 1zM4.118 4 4 
            4.059V13a1 1 0 0 0 1 
            1h6a1 1 0 0 0 1-1V4.059L11.882 
            4zM2.5 3h11V2h-11z"/>
          </svg>
        </button>
      </div>
      <h3>${book.title}</h3>
      <p><b>Author:</b> ${book.author}</p>
      <p><b>Year:</b> ${book.year}</p>
      <p><b>Genre:</b> ${book.genre}</p>
      <p><b>ISBN:</b> ${book.isbn}</p>
    `;
    booksList.appendChild(div);
  });
}

// open modal
addBookBtn.addEventListener("click", () => {
  editingBookId = null;
  form.reset();
  modal.style.display = "flex";
});

// close modal
cancelBtn.addEventListener("click", () => {
  editingBookId = null;
  modal.style.display = "none";
  form.reset();
});

// add or edit books
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    isbn: document.getElementById("isbn").value,
    year: document.getElementById("year").value,
    genre: document.getElementById("genre").value,
  };

  if (!bookData.title || !bookData.author || !bookData.isbn || !bookData.year) {
    alert("Please fill in all fields.");
    return;
  }

  if (editingBookId) {
    await fetch(`${API_URL_BOOKS}/${editingBookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  } else {
    await fetch(API_URL_BOOKS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
  }

  modal.style.display = "none";
  form.reset();
  editingBookId = null;
  await renderBooks();
});

// edit and delete books
booksList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".book_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this book?")) return;
    await fetch(`${API_URL_BOOKS}/${id}`, { method: "DELETE" });
    await renderBooks();
  }

  if (btn.classList.contains("edit_btn")) {
    const res = await fetch(`${API_URL_BOOKS}/${id}`);
    const book = await res.json();

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("isbn").value = book.isbn;
    document.getElementById("year").value = book.year;
    document.getElementById("genre").value = book.genre;
    editingBookId = id;
    modal.style.display = "flex";
  }
});

// close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    editingBookId = null;
    modal.style.display = "none";
    form.reset();
  }
});

//switch sections
readersBtn.addEventListener("click", () => {
  readerSection.classList.remove("hidden");
  booksSection.classList.add("hidden");
  readersBtn.classList.add("active");
  booksBtn.classList.remove("active");
});

booksBtn.addEventListener("click", () => {
  readerSection.classList.add("hidden");
  booksSection.classList.remove("hidden");
  readersBtn.classList.remove("active");
  booksBtn.classList.add("active");
});

renderBooks();



// readers section

const API_URL_READERS = "http://localhost:3000/api/readers";

const readersList = document.getElementById("readers_list");
const readerModal = document.getElementById("reader_modal");
const addReaderBtn = document.getElementById("add_readers_btn");
const cancelReaderBtn = document.getElementById("cancel_reader_btn");
const readerForm = document.getElementById("reader_form");

let editingReaderId = null;


async function renderReaders() {
  readersList.innerHTML = "";
  const res = await fetch(API_URL_READERS);
  const readers = await res.json();

  readers.forEach((reader) => {
    const div = document.createElement("div");
    div.className = "reader_card";
    div.dataset.id = reader.id;
    div.innerHTML = `
      <div class="actions_btn">
        <button class="edit_btn" title="Edit">✏️</button>
        <button class="delete_btn" title="Delete">🗑️</button>
      </div>
      <h3>${reader.name}</h3>
      <p><b>Email:</b> ${reader.email}</p>
      <p><b>Phone:</b> ${reader.phone}</p>
      <p><b>Date of Birth:</b> ${reader.date_of_birth}</p>
    `;
    readersList.appendChild(div);
  });
}

addReaderBtn.addEventListener("click", () => {
  editingReaderId = null;
  readerForm.reset();
  readerModal.style.display = "flex";
});

cancelReaderBtn.addEventListener("click", () => {
  editingReaderId = null;
  readerModal.style.display = "none";
  readerForm.reset();
});

//add or edit readers
readerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newReader = {
    name: document.getElementById("reader_name").value,
    email: document.getElementById("reader_email").value,
    phone: document.getElementById("reader_phone").value,
    date_of_birth: document.getElementById("reader_dob").value,
  };

  if (!newReader.name || !newReader.email || !newReader.phone) {
    alert("Please fill in all fields!");
    return;
  }

  if (editingReaderId) {
    await fetch(`${API_URL_READERS}/${editingReaderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReader),
    });
  } else {
    await fetch(API_URL_READERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReader),
    });
  }

  readerModal.style.display = "none";
  readerForm.reset();
  editingReaderId = null;
  await renderReaders();
});
//edit and delete readers
readersList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const card = btn.closest(".reader_card");
  const id = card.dataset.id;

  if (btn.classList.contains("delete_btn")) {
    if (!confirm("Delete this reader?")) return;
    await fetch(`${API_URL_READERS}/${id}`, { method: "DELETE" });
    await renderReaders();
  }

  if (btn.classList.contains("edit_btn")) {
    const res = await fetch(`${API_URL_READERS}/${id}`);
    const reader = await res.json();

    document.getElementById("reader_name").value = reader.name;
    document.getElementById("reader_email").value = reader.email;
    document.getElementById("reader_phone").value = reader.phone;
    document.getElementById("reader_dob").value = reader.date_of_birth;
    editingReaderId = id;
    readerModal.style.display = "flex";
  }
});

readerModal.addEventListener("click", (e) => {
  if (e.target === readerModal) {
    editingReaderId = null;
    readerModal.style.display = "none";
    readerForm.reset();
  }
});

renderReaders();

