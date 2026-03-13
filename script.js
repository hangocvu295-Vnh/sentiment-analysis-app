const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // Thay bằng key thật của bạn
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value;
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Phân tích cảm xúc đoạn này (Tích cực/Tiêu cực/Trung lập): "${text}"` }] }]
            })
        });
        const data = await response.json();
        res.innerHTML = data.candidates[0].content.parts[0].text;
    } catch (error) {
        res.innerHTML = "Lỗi kết nối API!";
        console.error(error);
    }
});