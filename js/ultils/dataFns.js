import { showToast } from './commonFns.js';
import { getCandidatesFromStorage, saveCandidatesToStorage } from './localStorageFns.js';

// Render bảng dữ liệu
export const renderTable = (tableBody) => {
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
                    <button class="edit" data-id="${candidate.id}" title="Sửa">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="delete" data-id="${candidate.id}" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
};

// Lưu dữ liệu ứng viên
export const saveCandidate = (formData, currentEditId) => {
    const candidateData = {
        id: currentEditId || Date.now(),
        ...formData
    };

    let candidates = getCandidatesFromStorage();

    if (currentEditId) {
        // Chế độ Sửa
        const index = candidates.findIndex((c) => c.id === currentEditId);
        if (index !== -1) {
            candidates[index] = candidateData;
            showToast("Cập nhật ứng viên thành công!");
        } else {
            showToast("Lỗi: Không tìm thấy ứng viên.", "error");
            return false;
        }
    } else {
        // Chế độ Thêm mới
        candidates.unshift(candidateData);
        showToast("Thêm mới ứng viên thành công!");
    }

    saveCandidatesToStorage(candidates);
    return true;
};

// Xóa ứng viên
export const deleteCandidate = (candidateId) => {
    let candidates = getCandidatesFromStorage();
    candidates = candidates.filter((c) => c.id !== candidateId);
    saveCandidatesToStorage(candidates);
    showToast("Xóa ứng viên thành công!");
    return true;
};

// Lấy thông tin ứng viên theo ID
export const getCandidateById = (candidateId) => {
    const candidates = getCandidatesFromStorage();
    return candidates.find((c) => c.id === candidateId);
};
