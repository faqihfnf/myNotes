const addBox = document.querySelector(".add-box");
popupBox = document.querySelector(".popup-box");
popupTitle = popupBox.querySelector("header p");
closeIcon = popupBox.querySelector("header i");
titleTag = popupBox.querySelector("input");
descTag = popupBox.querySelector("textarea");
addBtn = popupBox.querySelector("button");

const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juli", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
  updateId;

//* function untuk membuka popup
addBox.addEventListener("click", () => {
  titleTag.focus();
  popupBox.classList.add("show");
});

//* function untuk menutup pop up
closeIcon.addEventListener("click", () => {
  isUpdate = false;
  titleTag.value = "";
  descTag.value = "";
  addBtn.innerText = "Add Note";
  popupTitle.innerText = "Add New Note";
  popupBox.classList.remove("show");
});

function showNotes() {
  document.querySelectorAll(".note").forEach((note) => note.remove());
  notes.forEach((note, index) => {
    let liTag = `<li class="note">
            <div class="details">
                <p>${note.title}</p>
                <textarea class="note-text" rows="8" cols="40" readonly>${note.description ? decodeURIComponent(note.description) : ""}</textarea>
            </div>
            <div class="bottom-content">
                <span>${note.date}</span>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="menu">
                      <li onclick="updateNote(${index}, '${escape(note.title)}', '${escape(note.description)}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
                    </ul>
                </div>
            </div>
        </li>`;
    addBox.insertAdjacentHTML("afterend", liTag);
  });
}
showNotes();

//* function untuk menampilkan menu (edit dan delete)
function showMenu(element) {
  element.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    //* function untuk menutup menu (edit dan delete)
    if (e.target.tagName != "I" || e.target != element) {
      element.parentElement.classList.remove("show");
    }
  });
}

//* function untuk menghapus note
function deleteNote(noteId) {
  let confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;
  notes.splice(noteId, 1);
  localStorage.setItem("notes", JSON.stringify(notes)); //todo menghapus note dari local storage
  showNotes();
}

//* function untuk update note
function updateNote(noteId, title, description) {
  isUpdate = true;
  updateId = noteId;
  addBox.click();
  titleTag.value = unescape(title);
  descTag.value = unescape(description);
  popupTitle.innerText = "Update a Note";
  addBtn.innerText = "Update Note";
  //   console.log(noteId, title, description);
}

//* function untuk menambahkan note
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let noteTitle = titleTag.value,
    noteDesc = descTag.value;

  if (noteTitle || noteDesc) {
    //? mendapatkan tanggal realtime
    let dateObj = new Date();
    day = dateObj.getDate();
    month = months[dateObj.getMonth()];
    year = dateObj.getFullYear();

    let noteInfo = {
      title: noteTitle,
      description: noteDesc,
      date: `${day} ${month} ${year}`,
    };

    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    localStorage.setItem("notes", JSON.stringify(notes)); //todo menyimpan note ke dalam local storage
    showNotes();
    closeIcon.click();
  }
});

//* function dark mode
let toggleBtn = document.querySelector("#toggle");
let darkMode = localStorage.getItem("dark-mode");
const body = document.body;

const enableDarkMode = () => {
  toggleBtn.classList.replace("uil-sun", "uil-moon");
  body.classList.add("dark");
  localStorage.setItem("dark-mode", "enabled");
};

const disableDarkMode = () => {
  toggleBtn.classList.replace("uil-moon", "uil-sun");
  body.classList.remove("dark");
  localStorage.setItem("dark-mode", "disabled");
};

if (darkMode === "enabled") {
  enableDarkMode();
}

toggleBtn.onclick = (e) => {
  let darkMode = localStorage.getItem("dark-mode");
  if (darkMode === "disabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
};
