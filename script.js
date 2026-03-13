const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: `Bạn là chuyên gia CSKH. Trả về đúng 1 đoạn JSON: {"sentiment": "...", "score": "...", "reason": "...", "urgency": "..."}` },
                    { role: "user", content: text }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content);
        
        const color = obj.urgency === 'Cao' ? '#e74c3c' : '#27ae60';
        
        res.innerHTML = `
            <div class="result-card" style="border-left-color: ${color};">
                <div class="row"><strong>Tâm trạng:</strong> ${obj.sentiment}</div>
                <div class="row"><strong>Điểm số:</strong> ${obj.score}/10</div>
                <div class="row"><strong>Độ ưu tiên:</strong> ${obj.urgency}</div>
                <hr>
                <p style="font-size: 13px; color: #555;"><strong>Lý do:</strong> ${obj.reason}</p>
            </div>
        `;
    } catch (e) {
        res.innerHTML = "Lỗi kết nối. Hãy thử lại!";
    }
});