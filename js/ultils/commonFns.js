 //ham chuc nang toast
 const showToast = (message, type = "success") => {
    toast.textContent = message;
    toast.className = ""; // Xóa các class cũ
    toast.classList.add("show", type); // Thêm class 'show' và 'success'/'error'

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };