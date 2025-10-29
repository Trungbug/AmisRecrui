import { showToast } from './commonFns.js';
import { getCandidatesFromStorage, saveCandidatesToStorage } from './localStorageFns.js';

// Tạo HTML cho social icons
const getSocialIconsHTML = (networks = []) => {
    const icons = {
        facebook: 'fa-facebook-f',
        discord: 'fa-discord',
        line: 'fa-line'
    };
    return networks.map(network => 
        `<i class="fab ${icons[network]}"></i>`
    ).join('');
};

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
            <td class="sticky-left checkbox-column"><input type="checkbox" /></td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar-group">
                        <div class="avatar bg-${candidate.avatarColor || 'info'}">${candidate.avatarInitials || '--'}</div>
                        <div class="social-icons">
                            ${getSocialIconsHTML(candidate.socialNetworks)}
                        </div>
                    </div>
                    <div>
                        ${candidate.fullName}
                        ${candidate.role ? `<div class="sub-text">${candidate.role}</div>` : ''}
                    </div>
                </div>
            </td>
            <td>${candidate.phone || "--"}</td>
            <td>${candidate.email || "--"}</td>
            <td>${candidate.campaign || "--"}</td>
            <td>${candidate.recentWorkplace || "--"}</td>
            <td>${candidate.workplace || "--"}</td>
            <td>${candidate.startTime ? `${candidate.startTime} - ${candidate.endTime || 'Hiện tại'}` : "--"}</td>
            <td>${candidate.position || "--"}</td>
            <td>${candidate.jobDescription || "--"}</td>
            <td class="sticky-right action-column">
                <div class="action-buttons">
                    <button class="edit" data-id="${candidate.id}" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" data-id="${candidate.id}" title="Xóa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
};

// Lấy chữ cái đầu từ tên
const getInitials = (fullName) => {
    return fullName.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Lưu dữ liệu ứng viên
export const saveCandidate = (formData, currentEditId) => {
    const avatarInitials = getInitials(formData.fullName);
    const avatarColor = ['danger', 'info', 'success'][Math.floor(Math.random() * 3)];
    
    const candidateData = {
        id: currentEditId || Date.now(),
        ...formData,
        avatarInitials,
        avatarColor,
        socialNetworks: [], // Mặc định không có mạng xã hội
    };

    let candidates = getCandidatesFromStorage();

    if (currentEditId) {
        // Chế độ Sửa
        const index = candidates.findIndex((c) => c.id === currentEditId);
        if (index !== -1) {
            // Giữ lại các thông tin cũ không có trong form
            candidateData.socialNetworks = candidates[index].socialNetworks || [];
            candidateData.role = candidates[index].role;
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
