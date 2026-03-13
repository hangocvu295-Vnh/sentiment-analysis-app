// KHÔNG ĐỂ API KEY TẠI ĐÂY
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập!");
    res.innerHTML = "Đang phân tích...";
    
    // Tạm thời để trống KEY hoặc dùng biến môi trường
    const KEY = "DUMMY_KEY"; 
    
    // ... phần còn lại giữ nguyên ...
});