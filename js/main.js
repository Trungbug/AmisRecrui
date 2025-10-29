import { showToast, initializeSidebar } from './ultils/commonFns.js';
import { renderTable, saveCandidate, deleteCandidate, getCandidateById } from './ultils/dataFns.js';
import { saveSidebarState, getSidebarState } from './ultils/localStorageFns.js';

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        modal: document.getElementById("modalOverlay"),
        modalTitle: document.getElementById("modalTitle"),
        addBtn: document.getElementById("addCandidateBtn"),
        closeBtn: document.getElementById("closeModalBtn"),
        cancelBtn: document.getElementById("cancelBtn"),
        saveBtn: document.getElementById("saveBtn"),
        candidateForm: document.getElementById("candidateForm"),
        tableBody: document.getElementById("candidateTableBody"),
        collapseBtn: document.getElementById("collapseBtn"),
        sidebar: document.querySelector(".sidebar")
    };

    let currentEditId = null;

    const openModal = (mode = "add", candidateId = null) => {
        elements.candidateForm.reset();

        if (mode === "add") {
            elements.modalTitle.textContent = "Thêm ứng viên";
            currentEditId = null;
        } else {
            elements.modalTitle.textContent = "Chỉnh sửa thông tin ứng viên";
            currentEditId = candidateId;
            const candidateToEdit = getCandidateById(candidateId);

            if (candidateToEdit) {
                // Bind dữ liệu cho tất cả các trường
                document.getElementById("candidateId").value = candidateToEdit.id;
                document.getElementById("fullName").value = candidateToEdit.fullName;
                document.getElementById("dob").value = candidateToEdit.dob || "";
                document.getElementById("gender").value = candidateToEdit.gender || "";
                document.getElementById("area").value = candidateToEdit.area || "";
                document.getElementById("phone").value = candidateToEdit.phone || "";
                document.getElementById("email").value = candidateToEdit.email || "";
                document.getElementById("address").value = candidateToEdit.address || "";
                
                // Bind thông tin học vấn nếu có
                if (document.querySelector('input[placeholder="Nhập trình độ đào tạo"]')) {
                    document.querySelector('input[placeholder="Nhập trình độ đào tạo"]').value = candidateToEdit.education || "";
                }
                if (document.querySelector('input[placeholder="Nhập nơi đào tạo"]')) {
                    document.querySelector('input[placeholder="Nhập nơi đào tạo"]').value = candidateToEdit.educationPlace || "";
                }
                
                // Bind thông tin kinh nghiệm làm việc
                if (document.querySelector('input[placeholder="Nhập nơi làm việc gần đây"]')) {
                    document.querySelector('input[placeholder="Nhập nơi làm việc gần đây"]').value = candidateToEdit.recentWorkplace || "";
                }
                if (document.querySelector('input[placeholder="Nhập nơi làm việc"]')) {
                    document.querySelector('input[placeholder="Nhập nơi làm việc"]').value = candidateToEdit.workplace || "";
                }
                
                // Bind thời gian làm việc
                const timeInputs = document.querySelectorAll('input[placeholder="MM/yyyy"]');
                if (timeInputs.length >= 2) {
                    timeInputs[0].value = candidateToEdit.startTime || "";
                    timeInputs[1].value = candidateToEdit.endTime || "";
                }
                
                if (document.querySelector('input[placeholder="Nhập vị trí công việc"]')) {
                    document.querySelector('input[placeholder="Nhập vị trí công việc"]').value = candidateToEdit.position || "";
                }
                if (document.querySelector('textarea[placeholder="Nhập mô tả công việc"]')) {
                    document.querySelector('textarea[placeholder="Nhập mô tả công việc"]').value = candidateToEdit.jobDescription || "";
                }
            }
        }
        elements.modal.classList.add("active");
    };

    const closeModal = () => {
        elements.modal.classList.remove("active");
    };

    // Event Listeners
    elements.addBtn.addEventListener("click", () => openModal("add"));
    elements.closeBtn.addEventListener("click", closeModal);
    elements.cancelBtn.addEventListener("click", closeModal);
    elements.modal.addEventListener("click", (e) => {
        if (e.target === elements.modal) {
            closeModal();
        }
    });

    elements.saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;

        if (!fullName.trim()) {
            showToast("Họ và tên là trường bắt buộc.", "error");
            return;
        }

        const formData = {
            fullName: fullName,
            dob: document.getElementById("dob").value,
            gender: document.getElementById("gender").value,
            area: document.getElementById("area").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            
            // Thông tin học vấn
            education: document.querySelector('input[placeholder="Nhập trình độ đào tạo"]')?.value,
            educationPlace: document.querySelector('input[placeholder="Nhập nơi đào tạo"]')?.value,
            
            // Thông tin kinh nghiệm làm việc
            recentWorkplace: document.querySelector('input[placeholder="Nhập nơi làm việc gần đây"]')?.value,
            workplace: document.querySelector('input[placeholder="Nhập nơi làm việc"]')?.value,
            
            // Thời gian làm việc
            startTime: document.querySelector('input[placeholder="MM/yyyy"]')?.value,
            endTime: document.querySelectorAll('input[placeholder="MM/yyyy"]')[1]?.value,
            
            position: document.querySelector('input[placeholder="Nhập vị trí công việc"]')?.value,
            jobDescription: document.querySelector('textarea[placeholder="Nhập mô tả công việc"]')?.value
        };

        if (saveCandidate(formData, currentEditId)) {
            renderTable(elements.tableBody);
            closeModal();
        }
    });

    elements.tableBody.addEventListener("click", (e) => {
        const editButton = e.target.closest("button.edit");
        const deleteButton = e.target.closest("button.delete");

        if (editButton) {
            const candidateId = Number(editButton.dataset.id);
            openModal("edit", candidateId);
        }

        if (deleteButton) {
            const candidateId = Number(deleteButton.dataset.id);
            if (confirm("Bạn có chắc chắn muốn xóa ứng viên này?")) {
                if (deleteCandidate(candidateId)) {
                    renderTable(elements.tableBody);
                }
            }
        }
    });

    // Xử lý Sidebar
    if (elements.collapseBtn && elements.sidebar) {
        const sidebarCollapsed = getSidebarState();
        initializeSidebar(elements.sidebar, elements.collapseBtn, sidebarCollapsed);
        
        elements.collapseBtn.addEventListener("click", () => {
            const newState = elements.sidebar.classList.contains("collapsed");
            saveSidebarState(newState);
        });
    }

    // Khởi tạo ban đầu
    renderTable(elements.tableBody);
});