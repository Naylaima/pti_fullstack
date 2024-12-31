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

// INVENTORY HANDLING

// Dialog Add Functions
function showAddInventoryDialog() {
  document.getElementById("addInventoryDialog").style.display = "flex";
}

function closeInventoryDialog() {
  document.getElementById("addInventoryDialog").style.display = "none";
}

// Form submission handler for adding data
document.getElementById("inventoryForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    id: document.getElementById("id").value,
    unit: document.getElementById("unit").value,
    kodeAlat: document.getElementById("kodeAlat").value,
    fasilitas: document.getElementById("fasilitas").value,
    namaPeralatan: document.getElementById("namaPeralatan").value,
    cabang: document.getElementById("cabang").value,
    tanggal: document.getElementById("tanggal").value,
  };

  try {
    const response = await fetch("http://localhost:5000/api/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json(); // Parse response

    if (response.ok) {
      alert("Data berhasil ditambahkan");
      closeInventoryDialog();
      this.reset();
      loadInventoryData(); // Reload inventory data after adding
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal menambahkan data");
  }
});

// Load inventory data from the server
async function loadInventoryData() {
  try {
    const response = await fetch("http://localhost:5000/api/inventory");
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Clear current table rows

    data.forEach((item) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.kodeAlat}</td>
                <td>${item.cabang}</td>
                <td>${item.unit}</td>
                <td>${item.fasilitas}</td>
                <td>${item.namaPeralatan}</td>
                <td>${item.tanggal}</td>
                <td>
                    <button onclick="openEditInventoryDialog('${item.id}')">Edit</button>
                    <button onclick="openDeleteInventoryDialog('${item.id}')">Delete</button>
                </td>
            `;
      tbody.appendChild(newRow);
    });
  } catch (err) {
    console.error("Error:", err);
    alert("Gagal memuat data inventory.");
  }
}

// Call the function to load data on page load
document.addEventListener("DOMContentLoaded", loadInventoryData);

// Edit Inventory Dialog Functions
// Fungsi membuka dialog edit dengan memuat data sebelumnya
function openEditInventoryDialog(id) {
  // Tampilkan dialog edit
  document.getElementById("editInventoryDialog").style.display = "flex";

  // Ambil data berdasarkan ID dari server
  fetch(`/api/inventory/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat data untuk ID: ${id}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data diterima untuk editing:", data); // Debugging

      // Isi form dengan data yang diterima
      document.getElementById("editId").value = data.id || ""; // Hidden field untuk ID
      document.getElementById("editKodeAlat").value = data.kodeAlat || "";
      document.getElementById("editNamaPeralatan").value = data.namaPeralatan || "";
      document.getElementById("editUnit").value = data.unit || "";
      document.getElementById("editFasilitas").value = data.fasilitas || "";
      document.getElementById("editCabang").value = data.cabang || "";
      document.getElementById("editTanggal").value = data.tanggal || "";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal memuat data untuk diedit.");
    });
}

// Menutup dialog edit
function closeEditInventoryDialog() {
  document.getElementById("editInventoryDialog").style.display = "none";
}

// Fungsi mengirim data yang diperbarui ke server
async function editInventory() {
  const id = document.getElementById("editId").value;
  const updatedData = {
    kodeAlat: document.getElementById("editKodeAlat").value,
    namaPeralatan: document.getElementById("editNamaPeralatan").value,
    unit: document.getElementById("editUnit").value,
    fasilitas: document.getElementById("editFasilitas").value,
    cabang: document.getElementById("editCabang").value,
    tanggal: document.getElementById("editTanggal").value,
  };

  try {
    // Kirim data ke server
    const response = await fetch(`http://localhost:5000/api/inventory/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    console.log("Respons edit:", result); // Debugging

    if (response.ok) {
      alert("Data berhasil diperbarui");
      closeEditInventoryDialog();
      loadInventoryEditData(); // Muat ulang data setelah diperbarui
    } else {
      alert(`Gagal memperbarui data: ${result.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal memperbarui data");
  }
}

// Fungsi untuk memuat data inventory ke tabel
async function loadInventoryEditData() {
  try {
    const response = await fetch("http://localhost:5000/api/inventory");
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Kosongkan tabel sebelumnya

    data.forEach((item) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
                <td>${item.id}</td>
                <td>${item.kodeAlat}</td>
                <td>${item.namaPeralatan}</td>
                <td>${item.unit}</td>
                <td>${item.fasilitas}</td>
                <td>${item.cabang}</td>
                <td>${item.tanggal}</td>
                <td>
                    <button onclick="openEditInventoryDialog('${item.id}')">Edit</button>
                    <button onclick="openDeleteInventoryDialog('${item.id}')">Delete</button>
                </td>
            `;
      tbody.appendChild(newRow);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal memuat data inventory.");
  }
}

// Panggil fungsi untuk memuat data saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadInventoryEditData);

// Tambahkan event listener untuk form edit
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  editInventory();
});

// Delete Inventory Dialog Functions
let deleteId = null;
function openDeleteInventoryDialog(id) {
  deleteId = id; // Store the ID to delete
  document.getElementById("deleteDialog").style.display = "flex";
}

function closeDeleteInventoryDialog() {
  document.getElementById("deleteDialog").style.display = "none";
}

function confirmDeleteInventory() {
  if (!deleteId) return;

  fetch(`http://localhost:5000/api/inventory/delete/${deleteId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        alert("Data berhasil dihapus");
        closeDeleteInventoryDialog();
        loadInventoryData(); // Reload data after deletion
      } else {
        alert("Gagal menghapus data");
      }
    })
    .catch((err) => console.error("Error:", err));
}

// BERITA ACARA & SERAH TERIMA
// Dialog Functions
function showAddBeritaDialog() {
  document.getElementById("addBeritaAcaraDialog").style.display = "flex";
}

function closeBeritaDialog() {
  document.getElementById("addBeritaAcaraDialog").style.display = "none";
}

// Form submission handler
document.getElementById("beritaAcaraForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get all form values
  const formData = {
    id: document.getElementById("id").value,
    kodeAlat: document.getElementById("noberita").value,
    namaPeralatan: document.getElementById("namaberita").value,
    unit: document.getElementById("fromunit").value,
    fasilitas: document.getElementById("tounit").value,
    cabang: document.getElementById("keterangan").value,
  };

  // Here you would typically send this data to a server
  console.log("Form submitted with data:", formData);

  // Close the dialog
  closeBeritaDialog();

  // Reset the form
  this.reset();
});

// Close dialog when clicking outside
document.getElementById("addBeritaAcaraDialog").addEventListener("click", function (e) {
  if (e.target === this) {
    closeBeritaDialog();
  }
});

// Edit berita
function openEditBeritaDialog(id, noBerita, namaBerita, fromUnit, toUnit, keterangan, tanggal, file) {
  document.getElementById("editId").value = id;
  document.getElementById("editNoBerita").value = noBerita;
  document.getElementById("editNamaBerita").value = namaBerita;
  document.getElementById("editFromUnit").value = fromUnit;
  document.getElementById("editToUnit").value = toUnit;
  document.getElementById("editKeterangan").value = keterangan;

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
function openDeleteBeritaDialog() {
  document.getElementById("deleteBeritaDialog").style.display = "flex"; // Tampilkan dialog
}

function closeDeleteBeritaDialog() {
  document.getElementById("deleteBeritaDialog").style.display = "none"; // Sembunyikan dialog
}

function confirmDeleteBerita() {
  // Tambahkan logika penghapusan data di sini
  alert("Data berhasil dihapus!");
  closeDeleteBeritaDialog(); // Tutup dialog setelah menghapus
}

// Close dialog when clicking outside
document.getElementById("addLogbook").addEventListener("click", function (e) {
  if (e.target === this) {
    closeLogbookDialog();
  }
});

//edit list dialog
function openEditLogbookDialog(no, kegiatan, tanggal) {
  document.getElementById("editNo").value = no;
  document.getElementById("editKegiatan").value = kegiatan;
  document.getElementById("editTanggal").value = tanggal;

  document.getElementById("editLogbookDialog").style.display = "flex";
}

function closeEditLogbookDialog() {
  document.getElementById("editLogbookDialog").style.display = "none";
}

// delete inventory dialog
function openDeleteLogbookDialog() {
  document.getElementById("deleteLogbookDialog").style.display = "flex"; // Tampilkan dialog
}

function closeDeleteLogbookDialog() {
  document.getElementById("deleteLogbookDialog").style.display = "none"; // Sembunyikan dialog
}

function confirmDeleteLogbook() {
  // Tambahkan logika penghapusan data di sini
  alert("Data berhasil dihapus!");
  closeDeleteLogbookDialog(); // Tutup dialog setelah menghapus
}

//konfigurasi backend
// fetch('http://localhost:5000/api/inventory')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('tbody');
//         tableBody.innerHTML = '';
//         data.forEach(item => {
//             tableBody.innerHTML += `
//                 <tr>
//                     <td>${item.id}</td>
//                     <td>${item.kodeAlat}</td>
//                     <td>${item.cabang}</td>
//                     <td>${item.unit}</td>
//                     <td>${item.fasilitas}</td>
//                     <td>${item.namaPeralatan}</td>
//                     <td>${item.tanggal}</td>
//                     <td>
//                         <button onclick="editItem('${item.id}')">Edit</button>
//                         <button onclick="deleteItem('${item.id}')">Delete</button>
//                     </td>
//                 </tr>
//             `;
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));
