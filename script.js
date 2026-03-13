// Mã API Key đã được cập nhật
const API_KEY = "AIzaSyBYmtlAu2Xi_aAN9eB40Zk-H-9p9ooKh_g"; 

const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) {
        alert("Vui lòng nhập nội dung!");
        return;
    }

    res.innerHTML = "Đang phân tích...";
    res.style.color = "black";
    
    try {
        // Gọi API Gemini 1.5 Flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Phân tích cảm xúc đoạn văn sau, chỉ trả về 1 từ: Tích cực, Tiêu cực hoặc Trung lập. Đoạn văn: "${text}"` }] 
                }]
            })
        });

        const data = await response.json();

        // Kiểm tra lỗi từ phía API
        if (data.error) {
            throw new Error(data.error.message);
        }

        const resultText = data.candidates[0].content.parts[0].text.trim();
        res.innerHTML = `Kết quả: ${resultText}`;
        
        // Đổi màu kết quả
        if (resultText.includes("Tích cực")) {
            res.style.color = "green";
        } else if (resultText.includes("Tiêu cực")) {
            res.style.color = "red";
        } else {
            res.style.color = "orange";
        }

    } catch (error) {
        console.error("Lỗi:", error);
        res.innerHTML = "Lỗi kết nối API! Vui lòng thử lại.";
        res.style.color = "red";
    }
});