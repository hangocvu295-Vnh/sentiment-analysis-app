const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    if (!text.trim()) return alert("Nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "Bạn là chuyên gia phân tích cảm xúc." },
                    { role: "user", content: `Phân tích cảm xúc của câu này: "${text}". Trả lời Tích cực, Tiêu cực hoặc Trung lập.` }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            res.innerHTML = "Lỗi Groq: " + data.error.message;
        } else {
            res.innerHTML = "Kết quả: " + data.choices[0].message.content;
        }
    } catch (e) {
        res.innerHTML = "Lỗi kết nối mạng.";
    }
});