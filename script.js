const API_KEY = "AIzaSyDEeFxFSkSNYkRsI2eOhB1Vc5uNtO2B6pw"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Phân tích cảm xúc đoạn văn bản sau, chỉ trả về 1 từ (Tích cực/Tiêu cực/Trung lập): "${text}"` }] }]
            })
        });

        const data = await response.json();
        
        // Kiểm tra xem phản hồi có lỗi không
        if (data.error) {
            console.error("API Error:", data.error);
            res.innerHTML = "Lỗi API: " + data.error.message;
        } else {
            const resultText = data.candidates[0].content.parts[0].text;
            res.innerHTML = "Kết quả: " + resultText;
        }
    } catch (error) {
        res.innerHTML = "Lỗi kết nối API!";
        console.error(error);
    }
});