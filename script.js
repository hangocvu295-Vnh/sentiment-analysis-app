// Dùng biến giả để không bị GitHub chặn
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        // Gửi yêu cầu qua API trung gian (Backend Vercel)
        // Lưu ý: Đổi link thành /api/analyze nếu bạn muốn bảo mật tuyệt đối
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: `Phân tích cảm xúc: "${text}". Trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập.` }]
            })
        });

        const data = await response.json();
        res.innerHTML = "Kết quả: " + data.choices[0].message.content.trim();
    } catch (e) {
        res.innerHTML = "Lỗi kết nối!";
    }
});