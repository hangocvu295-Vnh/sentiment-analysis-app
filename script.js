const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const userInput = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung cần phân tích!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // Sử dụng model mới nhất đang hoạt động tốt
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Bạn là chuyên gia phân tích cảm xúc." },
                    { role: "user", content: `Phân tích cảm xúc của câu này: "${text}". Trả lời Tích cực, Tiêu cực, hoặc Trung lập.` }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();

        if (data.error) {
            res.innerHTML = "Lỗi API: " + data.error.message;
        } else if (data.choices && data.choices[0]) {
            res.innerHTML = "Kết quả: " + data.choices[0].message.content.trim();
        } else {
            res.innerHTML = "Lỗi hệ thống: Không nhận được phản hồi.";
        }
    } catch (e) {
        console.error(e);
        res.innerHTML = "Lỗi kết nối mạng hoặc CORS. Vui lòng kiểm tra Console.";
    }
});