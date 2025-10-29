import "localStorageFns.js";
const renderTable = () => {
  const candidates = getCandidatesFromStorage();
  tableBody.innerHTML = ""; // Xóa toàn bộ nội dung cũ của bảng

  if (candidates.length === 0) {
    // Hiển thị thông báo nếu không có ứng viên nào
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">Chưa có ứng viên nào.</td></tr>`;
    return;
  }

  // Lặp qua từng ứng viên và tạo một hàng (<tr>) cho mỗi người
  candidates.forEach((candidate) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="checkbox" /></td>
        <td>
          <div class="user-info">
            <div class="name">${candidate.fullName}</div>
          </div>
        </td>
        <td>${candidate.phone || "--"}</td>
        <td>${candidate.email || "--"}</td>
        <td>${candidate.position || "--"}</td>
        
        <td class="text-center">
          <div class="action-buttons">
            <button class="edit" data-id="${
              candidate.id
            }" title="Sửa"><i class="fa-solid fa-pencil"></i></button>
            <button class="delete" data-id="${
              candidate.id
            }" title="Xóa"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;
    tableBody.appendChild(tr);
  });
};
//cac ham modal
const openModal = (mode = "add", candidateId = null) => {
  candidateForm.reset(); // Xóa dữ liệu cũ trên form
  //them
  if (mode === "add") {
    modalTitle.textContent = "Thêm ứng viên";
    currentEditId = null; // Đảm bảo đang ở chế độ thêm mới
  } else {
    modalTitle.textContent = "Chỉnh sửa thông tin ứng viên";
    currentEditId = candidateId;
    const candidates = getCandidatesFromStorage();
    const candidateToEdit = candidates.find((c) => c.id === candidateId);
    //sua
    // Điền (bind) dữ liệu của ứng viên vào form
    if (candidateToEdit) {
      document.getElementById("candidateId").value = candidateToEdit.id;
      document.getElementById("fullName").value = candidateToEdit.fullName;
      document.getElementById("phone").value = candidateToEdit.phone;
      document.getElementById("email").value = candidateToEdit.email;
      document.getElementById("position").value = candidateToEdit.position;
    }
  }
  modal.classList.add("active"); // Hiển thị popup
};

const closeModal = () => {
  modal.classList.remove("active"); // Ẩn popup
};

//ham mo popup khi them ung vien
addBtn.addEventListener("click", () => openModal("add"));
//ham dong khi an close, cacel
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
//ham dong khi click ra ngoai
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
//Xử lý sự kiện nút thêm lưu nhân viên  (cho cả Thêm và Sửa)
saveBtn.addEventListener("click", (e) => {
  if (!fullName.trim()) {
    showToast("Họ và tên là trường bắt buộc.", "error");
    return;
  }
  const candidateData = {
    id: currentEditId || Date.now(), // Nếu là sửa thì dùng id cũ, nếu thêm mới thì tạo id bằng timestamp
    fullName: fullName,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    position: document.getElementById("position").value,
  };
  let candidates = getCandidatesFromStorage();
  if (currentEditId) {
    const index = candidates.findIndex((c) => c.id === currentEditId);
    if (index !== -1) {
      candidates[index] = candidateData; // Cập nhật ứng viên tại vị trí đã tìm thấy
      showToast("Cập nhật ứng viên thành công!");
    } else {
      showToast("Lỗi: Không tìm thấy ứng viên.", "error");
      return;
    }
  }
  else {
      // --- Chế độ Thêm mới ---
      candidates.unshift(candidateData); // Thêm ứng viên mới vào đầu danh sách
      showToast("Thêm mới ứng viên thành công!");
    }

    saveCandidatesToStorage(candidates); // Lưu lại vào localStorage
    renderTable(); // Vẽ lại bảng
    closeModal(); // Đóng popup
});
