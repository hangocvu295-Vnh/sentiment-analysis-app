const API_KEY = "AIzaSyAqimS9-LQb12vAIZ6GCWu3RDfAvr3ShS0"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        // Cú pháp chuẩn mới nhất của Google cho 1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{ "text": "Phân tích cảm xúc: " + text + ". Trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập." }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            res.innerHTML = "Kết quả: " + data.candidates[0].content.parts[0].text.trim();
        } else {
            // Hiển thị chi tiết lỗi để chúng ta biết nó đang bị chặn cái gì
            console.error("Full error:", data);
            res.innerHTML = "Lỗi: " + (data.error?.message || "Không thể lấy dữ liệu");
        }
    } catch (e) {
        res.innerHTML = "Lỗi kết nối!";
    }
});