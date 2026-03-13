const API_KEY = "AIzaSyAqimS9-LQb12vAIZ6GCWu3RDfAvr3ShS0"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    res.style.color = "blue";
    
    try {
        // Sử dụng URL đầy đủ, không xuống dòng để tránh lỗi
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Phân tích cảm xúc: "${text}". Trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập.` }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultText = data.candidates[0].content.parts[0].text.trim();
            res.innerHTML = "Kết quả: " + resultText;
            res.style.color = "black";
        } else {
            console.error("API Response:", data);
            res.innerHTML = "Lỗi phản hồi: " + (data.error?.message || "Không xác định");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        res.innerHTML = "Lỗi kết nối API!";
        res.style.color = "red";
    }
});