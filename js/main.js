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
                document.getElementById("candidateId").value = candidateToEdit.id;
                document.getElementById("fullName").value = candidateToEdit.fullName;
                document.getElementById("phone").value = candidateToEdit.phone;
                document.getElementById("email").value = candidateToEdit.email;
                document.getElementById("position").value = candidateToEdit.position;
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
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            position: document.getElementById("position").value,
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