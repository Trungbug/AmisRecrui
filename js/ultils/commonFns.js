// Hiển thị thông báo toast
export const showToast = (message, type = "success") => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = ""; // Xóa các class cũ
    toast.classList.add("show", type); // Thêm class 'show' và 'success'/'error'

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
};

// Xử lý sidebar collapse
export const initializeSidebar = (sidebar, collapseBtn, isCollapsed) => {
    if (!sidebar || !collapseBtn) return;

    // Áp dụng trạng thái ban đầu
    if (isCollapsed) {
        sidebar.classList.add("collapsed");
    } else {
        sidebar.classList.remove("collapsed");
    }

    // Xử lý sự kiện click
    collapseBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        return sidebar.classList.contains("collapsed");
    });
};
