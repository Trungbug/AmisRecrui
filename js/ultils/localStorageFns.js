// Hằng số cho localStorage keys
export const STORAGE_KEYS = {
    CANDIDATES: 'candidates',
    SIDEBAR: 'sidebarCollapsed'
};

// Dữ liệu mẫu
const sampleCandidates = [
    {
        id: 1,
        fullName: "Tạ Long Khánh",
        avatarInitials: "TK",
        avatarColor: "danger",
        role: "Nhân viên",
        phone: "",
        email: "trangthu.tester@gmail.com",
        campaign: "",
        position: "QC /Tester/Kiểm thử",
        socialNetworks: ["facebook"]
    },
    {
        id: 2,
        fullName: "Lê Mạnh Hùng",
        avatarInitials: "LH",
        avatarColor: "info",
        phone: "",
        email: "",
        campaign: "",
        position: "",
        socialNetworks: ["discord"]
    },
    {
        id: 3,
        fullName: "Lê Mạnh Hùng",
        avatarInitials: "LH",
        avatarColor: "info",
        phone: "",
        email: "",
        campaign: "",
        position: "",
        socialNetworks: ["line"]
    },
    {
        id: 4,
        fullName: "Nguyễn Minh Phong",
        avatarInitials: "NP",
        avatarColor: "success",
        role: "Nhân viên",
        phone: "",
        email: "dtthao.test02@gmail.com",
        campaign: "",
        position: "QC /Tester/Kiểm thử",
        socialNetworks: ["facebook"]
    },
    {
        id: 5,
        fullName: "Lại Cẩm Linh",
        avatarInitials: "LL",
        avatarColor: "danger",
        role: "Nhân viên",
        phone: "0982 970 918",
        email: "camlinh.lai27@gmail.com",
        campaign: "",
        position: "QC /Tester/Kiểm thử",
        socialNetworks: ["discord"]
    },
    {
        id: 6,
        fullName: "Bùi Mỹ Uyên",
        avatarInitials: "BU",
        avatarColor: "info",
        phone: "0331 256 963",
        email: "uyenbt.work@gmail.com",
        campaign: "",
        position: "Nhân viên kinh doanh",
        socialNetworks: ["discord", "facebook"]
    }
];

// Lấy danh sách ứng viên từ localStorage
export const getCandidatesFromStorage = () => {
    const candidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
    // Nếu có dữ liệu, chuyển từ chuỗi JSON về mảng. Nếu không, trả về dữ liệu mẫu.
    return candidates ? JSON.parse(candidates) : sampleCandidates;
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
