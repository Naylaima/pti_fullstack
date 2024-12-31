// Dialog Functions
function showAddLokasiDialog() {
  document.getElementById("addLokasiDialog").style.display = "flex";
}

function closeLokasiDialog() {
  document.getElementById("addLokasiDialog").style.display = "none";
}

// Form submission handler
document.getElementById("lokasiForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    nama_lokasi: document.getElementById("nama_lokasi").value,
  };

  console.log("Form submitted with data:", formData);

  try {
    const response = await fetch("http://localhost:5000/api/lokasi/add", {
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
  closeLokasiDialog();

  // Reset the form
  this.reset();
  loadLokasi();
});

async function loadLokasi() {
  try {
    const response = await fetch("http://localhost:5000/api/lokasi");
    if (!response.ok) throw new Error("Gagal memuat data");

    const data = await response.json();
    const menuGrid = document.querySelector("#menuGrid");
    menuGrid.innerHTML = ""; // Kosongkan tabel sebelumnya

    data.forEach((item) => {
      const newRow = document.createElement("div");
      newRow.classList.add("menu-item");
      newRow.onclick = () => {
        window.location.href = `listbarang.html?id=${item.id}`;
      };
      newRow.innerHTML = `
                <i class="fas fa-location-dot"></i>
                <span>${item.nama_lokasi}</span>
    `;
      menuGrid.appendChild(newRow);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal memuat data berita acara.");
  }
}

window.onload = function () {
  loadLokasi();
};
