// Hằng số cho localStorage keys
export const STORAGE_KEYS = {
    CANDIDATES: 'candidates',
    SIDEBAR: 'sidebarCollapsed'
};

// Lấy danh sách ứng viên từ localStorage
export const getCandidatesFromStorage = () => {
    const candidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    // Nếu có dữ liệu, chuyển từ chuỗi JSON về mảng. Nếu không, trả về mảng rỗng.
    return candidates ? JSON.parse(candidates) : [];
};

// Lưu danh sách ứng viên vào localStorage
export const saveCandidatesToStorage = (candidates) => {
    // Chuyển mảng/object thành chuỗi JSON để lưu trữ
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
};

// Lưu trạng thái sidebar
export const saveSidebarState = (isCollapsed) => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, isCollapsed);
};

// Lấy trạng thái sidebar
export const getSidebarState = () => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR) === "true";
};
