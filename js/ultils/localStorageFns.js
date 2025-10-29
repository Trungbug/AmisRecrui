//lay danh sach ung vien
const getCandidatesFromStorage = () => {
  const candidates = localStorage.getItem("candidates");

  return candidates ? JSON.parse(candidates) : [];
};
//Luu vao localstorage
const saveCandidateFromStorage = (candidates) => {
  localStorage.setItem("candidates", JSON.stringify(candidates));
}
getCandidatesFromStorage();
saveCandidateFromStorage();
