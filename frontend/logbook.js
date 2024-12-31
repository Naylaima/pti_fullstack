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
function showAddLogbookDialog() {
  document.getElementById("addLogbookDialog").style.display = "flex";
}

function closeLogbookDialog() {
  document.getElementById("addLogbookDialog").style.display = "none";
}

// Form submission handler
document.getElementById("LogbookForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    kegiatan: document.getElementById("kegiatan").value,
    tanggal: document.getElementById("tanggal").value,
  };

  // Here you would typically send this data to a server
  console.log("Form submitted with data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/logbook/add", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
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
  closeLogbookDialog();

  // Reset the form
  this.reset();
  loadLoggbook();
});

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const formData = {
    kegiatan: document.getElementById("editKegiatan").value,
    tanggal: document.getElementById("editTanggal").value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/logbook/edit/" + id, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
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
  closeEditLogbookDialog();

  // Reset the form
  this.reset();
  loadLoggbook();
});

function confirmDeleteLogbook() {
  if (!deleteId) return;

  fetch(`http://localhost:5000/api/logbook/delete/${deleteId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Data berhasil dihapus");
        loadLoggbook(); // Reload data after deletion
      } else {
        alert("Gagal menghapus data");
      }
    })
    .catch((err) => console.error("Error:", err))
    .finally(() => {
      deleteId = null; // Reset the deleteId after deletion
      closeDeleteLogbookDialog();
    });
}

// Close dialog when clicking outside
document.getElementById("addLogbookDialog").addEventListener("click", function (e) {
  if (e.target === this) {
    closeLogbookDialog();
  }
});

// Edit berita
function openEditLogbookDialog(id, kegiatan, tanggal) {
  document.getElementById("editId").value = id;
  document.getElementById("editKegiatan").value = kegiatan ?? "";
  document.getElementById("editTanggal").value = tanggal ?? "";

  // Show the dialog
  document.getElementById("editLogbookDialog").style.display = "flex";
}

function closeEditLogbookDialog() {
  document.getElementById("editLogbookDialog").style.display = "none";
}

// delete berita dialog
function openDeleteLogbookDialog(id) {
  deleteId = id;
  document.getElementById("deleteLogbookDialog").style.display = "flex"; // Tampilkan dialog
}

function closeDeleteLogbookDialog() {
  deleteId = null;
  document.getElementById("deleteLogbookDialog").style.display = "none"; // Sembunyikan dialog
}

async function loadLoggbook() {
  try {
    const response = await fetch(`http://localhost:5000/api/logbook`);
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Kosongkan tabel sebelumnya
    console.log(data);
    data.forEach((item) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.kegiatan}</td>
                <td>${item.tanggal}</td>
                <td>
                    <button class="action-button"
                        onclick="openEditLogbookDialog('${item.id}', '${item.kegiatan}', '${item.tanggal}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-button" onclick="openDeleteLogbookDialog(${item.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
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
  loadLoggbook();
};
