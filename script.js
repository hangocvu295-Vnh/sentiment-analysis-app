// Cấu hình API Key
const API_KEY = "AIzaSyBYmtlAu2Xi_aAN9eB40Zk-H-9p9ooKh_g"; 

// Lấy các phần tử từ DOM
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

// Hàm xử lý sự kiện
btn.addEventListener("click", async () => {
    const text = input.value.trim();
    
    // Kiểm tra đầu vào
    if (!text) {
        alert("Vui lòng nhập nội dung phản hồi!");
        return;
    }

    // Hiển thị trạng thái
    res.innerHTML = "Đang kết nối AI...";
    res.style.color = "blue";
    
    try {
        // Gọi API Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Phân tích cảm xúc của câu sau, chỉ trả lời 1 trong 3 từ: Tích cực, Tiêu cực, hoặc Trung lập. Câu là: "${text}"` }] 
                }]
            })
        });

        const data = await response.json();

        // Xử lý dữ liệu trả về
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultText = data.candidates[0].content.parts[0].text.trim();
            res.innerHTML = `Kết quả: ${resultText}`;
            
            // Đổi màu theo kết quả
            if (resultText.includes("Tích cực")) res.style.color = "green";
            else if (resultText.includes("Tiêu cực")) res.style.color = "red";
            else res.style.color = "orange";
        } else {
            throw new Error("Dữ liệu phản hồi không hợp lệ.");
        }
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        res.innerHTML = "Lỗi: Không thể kết nối Gemini API. Hãy kiểm tra Console (F12).";
        res.style.color = "red";
    }
});