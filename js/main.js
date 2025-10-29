document.addEventListener("DOMContentLoaded", () => {
  
  const modal = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const addBtn = document.getElementById("addCandidateBtn");
  const closeBtn = document.getElementById("closeModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const candidateForm = document.getElementById("candidateForm");
  const tableBody = document.getElementById("candidateTableBody");
  const toast = document.getElementById("toast");

  // null: Thêm mới, có giá trị (id): Sửa
  let currentEditId = null;

  // Lấy danh sách ứng viên từ localStorage
  const getCandidatesFromStorage = () => {
    const candidates = localStorage.getItem("candidates");
    // Nếu có dữ liệu, chuyển từ chuỗi JSON về mảng. Nếu không, trả về mảng rỗng.
    return candidates ? JSON.parse(candidates) : [];
  };

  // Lưu danh sách ứng viên vào localStorage
  const saveCandidatesToStorage = (candidates) => {
    // Chuyển mảng/object thành chuỗi JSON để lưu trữ
    localStorage.setItem("candidates", JSON.stringify(candidates));
  };

  // =================================================================
  // == HÀM HIỂN THỊ THÔNG BÁO (TOAST)
  // =================================================================
  const showToast = (message, type = "success") => {
    toast.textContent = message;
    toast.className = ""; // Xóa các class cũ
    toast.classList.add("show", type); // Thêm class 'show' và 'success'/'error'

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };

  // =================================================================
  // == HÀM VẼ LẠI BẢNG DỮ LIỆU (RENDER TABLE)
  // =================================================================
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

//  các hàm popup
  const openModal = (mode = "add", candidateId = null) => {
    candidateForm.reset(); // Xóa dữ liệu cũ trên form

    if (mode === "add") {
      modalTitle.textContent = "Thêm ứng viên";
      currentEditId = null; // Đảm bảo đang ở chế độ thêm mới
    } else {
      modalTitle.textContent = "Chỉnh sửa thông tin ứng viên";
      currentEditId = candidateId;
      const candidates = getCandidatesFromStorage();
      const candidateToEdit = candidates.find((c) => c.id === candidateId);

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

  // == GẮN CÁC SỰ KIỆN (EVENT LISTENERS)


  // 1. Mở popup khi nhấn nút "Thêm ứng viên"
  addBtn.addEventListener("click", () => openModal("add"));

  // 2. Đóng popup khi nhấn nút X, nút Hủy, hoặc click ra ngoài
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // 3. Xử lý sự kiện nhấn nút "Lưu" (cho cả Thêm và Sửa)
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Ngăn form gửi đi theo cách truyền thống
    const fullName = document.getElementById("fullName").value;

    // Kiểm tra dữ liệu bắt buộc
    if (!fullName.trim()) {
      showToast("Họ và tên là trường bắt buộc.", "error");
      return;
    }

    // Lấy dữ liệu từ form
    const candidateData = {
      id: currentEditId || Date.now(), // Nếu là sửa thì dùng id cũ, nếu thêm mới thì tạo id bằng timestamp
      fullName: fullName,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      position: document.getElementById("position").value,
    };

    let candidates = getCandidatesFromStorage();

    if (currentEditId) {
      // --- Chế độ Sửa ---
      const index = candidates.findIndex((c) => c.id === currentEditId);
      if (index !== -1) {
        candidates[index] = candidateData; // Cập nhật ứng viên tại vị trí đã tìm thấy
        showToast("Cập nhật ứng viên thành công!");
      } else {
        showToast("Lỗi: Không tìm thấy ứng viên.", "error");
        return;
      }
    } else {
      // --- Chế độ Thêm mới ---
      candidates.unshift(candidateData); // Thêm ứng viên mới vào đầu danh sách
      showToast("Thêm mới ứng viên thành công!");
    }

    saveCandidatesToStorage(candidates); // Lưu lại vào localStorage
    renderTable(); // Vẽ lại bảng
    closeModal(); // Đóng popup
  });

  // 4. Xử lý sự kiện Sửa và Xóa bằng Event Delegation
  // Lắng nghe sự kiện click trên toàn bộ tbody thay vì từng nút riêng lẻ
  tableBody.addEventListener("click", (e) => {
    const editButton = e.target.closest("button.edit");
    const deleteButton = e.target.closest("button.delete");

    // Nếu click vào nút Sửa (hoặc icon bên trong nó)
    if (editButton) {
      const candidateId = Number(editButton.dataset.id);
      openModal("edit", candidateId);
    }

    // Nếu click vào nút Xóa (hoặc icon bên trong nó)
    if (deleteButton) {
      const candidateId = Number(deleteButton.dataset.id);
      if (confirm("Bạn có chắc chắn muốn xóa ứng viên này?")) {
        let candidates = getCandidatesFromStorage();
        candidates = candidates.filter((c) => c.id !== candidateId); // Lọc ra mảng mới không chứa ứng viên cần xóa
        saveCandidatesToStorage(candidates);
        renderTable();
        showToast("Xóa ứng viên thành công!");
      }
    }
  });


  // == LOGIC CHO CHỨC NĂNG THU GỌN SIDEBAR 

  const collapseBtn = document.getElementById("collapseBtn");
  const sidebar = document.querySelector(".sidebar");
  const SIDEBAR_KEY = "sidebarCollapsed";

  function applySidebarState() {
    const collapsed = localStorage.getItem(SIDEBAR_KEY) === "true";
    if (!sidebar) return;
    if (collapsed) sidebar.classList.add("collapsed");
    else sidebar.classList.remove("collapsed");
  }

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem(
        SIDEBAR_KEY,
        sidebar.classList.contains("collapsed")
      );
    });
  }

  applySidebarState(); // Áp dụng trạng thái thu gọn/mở rộng của sidebar
  renderTable(); // Lần đầu tải trang, vẽ bảng dữ liệu từ localStorage
});

