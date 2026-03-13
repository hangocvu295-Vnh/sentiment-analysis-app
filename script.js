const API_KEY = "AIzaSyDEeFxFSkSNYkRsI2eOhB1Vc5uNtO2B6pw"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung phản hồi!");

    res.innerHTML = "Đang phân tích...";
    res.style.color = "black";
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Phân tích cảm xúc đoạn văn bản sau, chỉ trả về một trong ba từ: Tích cực, Tiêu cực, hoặc Trung lập. Đoạn văn bản là: "${text}"` }] 
                }]
            })
        });

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text.trim();
        
        // Hiển thị kết quả và đổi màu sắc theo cảm xúc
        res.innerHTML = `Kết quả: ${resultText}`;
        
        if (resultText.includes("Tích cực")) {
            res.style.color = "green";
        } else if (resultText.includes("Tiêu cực")) {
            res.style.color = "red";
        } else {
            res.style.color = "orange";
        }

    } catch (error) {
        res.innerHTML = "Lỗi kết nối API! Vui lòng kiểm tra lại.";
        res.style.color = "red";
        console.error("Lỗi:", error);
    }
});