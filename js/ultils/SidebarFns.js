import "dataFns.js"
//thu gon sidebar

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
    localStorage.setItem(SIDEBAR_KEY, sidebar.classList.contains("collapsed"));
  });
}

applySidebarState();
 renderTable();
