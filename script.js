const API_KEY = "AIzaSyAqimS9-LQb12vAIZ6GCWu3RDfAvr3ShS0"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        // Đảm bảo URL này chính xác và không bị xuống dòng
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Phân tích cảm xúc: "${text}". Trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập.` }] }]
            })
        });

        const data = await response.json();

        // Kiểm tra xem API có trả về lỗi không
        if (data.error) {
            console.error("API Error:", data.error);
            res.innerHTML = "Lỗi API: " + data.error.message;
        } else if (data.candidates && data.candidates[0].content) {
            const resultText = data.candidates[0].content.parts[0].text;
            res.innerHTML = "Kết quả: " + resultText;
        } else {
            res.innerHTML = "Không nhận được phản hồi từ AI.";
        }
    } catch (error) {
        console.error(error);
        res.innerHTML = "Lỗi kết nối!";
    }
});