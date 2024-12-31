const urlParams = new URLSearchParams(window.location.search);
const id_lokasi = urlParams.get("id");
console.log("ID:", id_lokasi);

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
function showAddListDialog() {
  document.getElementById("addListBarang").style.display = "flex";
}

function closeListDialog() {
  document.getElementById("addListBarang").style.display = "none";
}

// Form submission handler
document.getElementById("listForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    kode_alat: document.getElementById("kodeAlat").value,
    nama_barang: document.getElementById("namaBarang").value,
    id_lokasi: id_lokasi,
  };

  // Here you would typically send this data to a server
  console.log("Form submitted with data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/list-barang/add", {
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
  closeListDialog();

  // Reset the form
  this.reset();
  loadListBarang();
});

document.getElementById("editForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("editId").value;

  const formData = {
    kode_alat: document.getElementById("editKodeAlat").value,
    nama_barang: document.getElementById("editNamaBarang").value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/list-barang/edit/" + id, {
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
  closeEditListDialog();

  // Reset the form
  this.reset();
  loadListBarang();
});

function confirmDeleteList() {
  if (!deleteId) return;

  fetch(`http://localhost:5000/api/list-barang/delete/${deleteId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Data berhasil dihapus");
        loadListBarang(); // Reload data after deletion
      } else {
        alert("Gagal menghapus data");
      }
    })
    .catch((err) => console.error("Error:", err))
    .finally(() => {
      deleteId = null; // Reset the deleteId after deletion
      closeDeleteListDialog();
    });
}

// Close dialog when clicking outside
document.getElementById("addListBarang").addEventListener("click", function (e) {
  if (e.target === this) {
    closeListDialog();
  }
});

// Edit berita
function openEditListBarangDialog(id, kode_alat, nama_barang) {
  document.getElementById("editId").value = id;
  document.getElementById("editKodeAlat").value = kode_alat ?? "";
  document.getElementById("editNamaBarang").value = nama_barang ?? "";

  // Show the dialog
  document.getElementById("editListDialog").style.display = "flex";
}

function closeEditListDialog() {
  document.getElementById("editListDialog").style.display = "none";
}

// delete berita dialog
function openDeleteListBarangDialog(id) {
  deleteId = id;
  document.getElementById("deleteListDialog").style.display = "flex"; // Tampilkan dialog
}

function closeDeleteListDialog() {
  deleteId = null;
  document.getElementById("deleteListDialog").style.display = "none"; // Sembunyikan dialog
}

async function loadListBarang() {
  try {
    const response = await fetch(`http://localhost:5000/api/list-barang/${id_lokasi}`);
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Kosongkan tabel sebelumnya
    console.log(data);
    data.forEach((item) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.kode_alat}</td>
                <td>${item.nama_barang}</td>
                <td>
                    <button onclick="openEditListBarangDialog('${item.id}', '${item.kode_alat}', '${item.nama_barang}')">Edit</button>
                    <button onclick="openDeleteListBarangDialog('${item.id}')">Delete</button>
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
  // check apakah id ada jika tidak maka redirect ke homepage html
  if (!id_lokasi) window.location.href = "homepage.html";
  loadListBarang();
};
