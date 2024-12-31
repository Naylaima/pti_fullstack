deleteId = null; // Store the ID to delete
// Search
document.querySelector(".search-bar input").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? "" : "none";
  });
});

// hover effect table row
const rows = document.querySelectorAll("tbody tr");
rows.forEach((row) => {
  row.addEventListener("mouseover", () => {
    row.style.backgroundColor = "rgba(44, 62, 80, 0.2)";
  });
  row.addEventListener("mouseout", () => {
    row.style.backgroundColor = "";
  });
});

// BERITA ACARA & berita-acara
// Dialog Functions
function showAddBeritaDialog() {
  document.getElementById("addBeritaAcaraDialog").style.display = "flex";
}

function closeBeritaDialog() {
  document.getElementById("addBeritaAcaraDialog").style.display = "none";
}

// Form submission handler
document.getElementById("beritaAcara").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("nomor", document.getElementById("noberita").value);
  formData.append("nama", document.getElementById("namaberita").value);
  formData.append("from_unit", document.getElementById("fromunit").value);
  formData.append("to_unit", document.getElementById("tounit").value);
  formData.append("keterangan", document.getElementById("keterangan").value);
  formData.append("file", file);

  // Here you would typically send this data to a server
  console.log("Form submitted with data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/berita-acara/add", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Data berhasil ditambahkan");
    } else {
      alert("Data gagal ditambahkan");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // Close the dialog
  closeBeritaDialog();

  // Reset the form
  this.reset();
  loadBerita();
});

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const fileInput = document.getElementById("editFile");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("nomor", document.getElementById("editNoBerita").value);
  formData.append("nama", document.getElementById("editNamaBerita").value);
  formData.append("from_unit", document.getElementById("editFromUnit").value);
  formData.append("to_unit", document.getElementById("editToUnit").value);
  formData.append("keterangan", document.getElementById("editKeterangan").value);
  if (file) {
    formData.append("file", file);
  }

  try {
    const response = await fetch("http://localhost:5000/api/berita-acara/edit/" + id, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Data berhasil diupdate");
    } else {
      alert("Data gagal diupdate");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  // Close the dialog
  closeEditBeritaDialog();

  // Reset the form
  this.reset();
  loadBerita();
});

function confirmDeleteBerita() {
  if (!deleteId) return;

  fetch(`http://localhost:5000/api/berita-acara/delete/${deleteId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Data berhasil dihapus");
        loadBerita(); // Reload data after deletion
      } else {
        alert("Gagal menghapus data");
      }
    })
    .catch((err) => console.error("Error:", err))
    .finally(() => {
      deleteId = null; // Reset the deleteId after deletion
      closeDeleteBeritaDialog();
    });
}

// Close dialog when clicking outside
document.getElementById("addBeritaAcaraDialog").addEventListener("click", function (e) {
  if (e.target === this) {
    closeBeritaDialog();
  }
});

// Edit berita
function openEditBeritaDialog(id, noBerita, namaBerita, fromUnit, toUnit, keterangan, tanggal, file) {
  document.getElementById("editId").value = id;
  document.getElementById("editNoBerita").value = noBerita ?? "";
  document.getElementById("editNamaBerita").value = namaBerita ?? "";
  document.getElementById("editFromUnit").value = fromUnit ?? "";
  document.getElementById("editToUnit").value = toUnit ?? "";
  document.getElementById("editKeterangan").value = keterangan ?? "";

  // Set file if applicable (optional: display file name or link)
  if (file) {
    const fileInput = document.getElementById("editFile");
    fileInput.setAttribute("data-existing-file", file); // Store file metadata if needed
  }

  // Show the dialog
  document.getElementById("editBeritaDialog").style.display = "flex";
}

function closeEditBeritaDialog() {
  document.getElementById("editBeritaDialog").style.display = "none";
}

// delete berita dialog
function openDeleteBeritaDialog(id) {
  deleteId = id;
  document.getElementById("deleteBeritaDialog").style.display = "flex"; // Tampilkan dialog
}

function closeDeleteBeritaDialog() {
  deleteId = null;
  document.getElementById("deleteBeritaDialog").style.display = "none"; // Sembunyikan dialog
}

async function loadBerita() {
  try {
    const response = await fetch("http://localhost:5000/api/berita-acara");
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Kosongkan tabel sebelumnya
    console.log(data);
    data.forEach((item) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nomor}</td>
                <td>${item.nama}</td>
                <td>${item.from_unit}</td>
                <td>${item.to_unit}</td>
                <td>${item.keterangan ?? ""}</td>
                <td>
                    <a href="http://localhost:5000/uploads/${item.nama_file}" download>
                        <i class="fas fa-book"></i>
                    </a>
                </td>
                <td>
                    <button onclick="openEditBeritaDialog('${item.id}', '${item.nomor}', '${item.nama}', '${
        item.from_unit
      }', '${item.to_unit}', '${item.keterangan}', '${item.tanggal}', '${item.file}')">Edit</button>
                    <button onclick="openDeleteBeritaDialog('${item.id}')">Delete</button>
                </td>
            `;
      tbody.appendChild(newRow);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal memuat data berita acara.");
  }
}

window.onload = function () {
  loadBerita();
};
