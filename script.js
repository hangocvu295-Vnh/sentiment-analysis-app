const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "Đang phân tích chuyên sâu...";
    
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
                    { role: "system", content: `Bạn là chuyên gia CSKH. Phân tích phản hồi và trả về JSON:
                    {
                        "sentiment": "Tích cực/Trung lập/Tiêu cực",
                        "score": "Số từ 0-10",
                        "keywords": "Các từ khóa tiêu cực phát hiện",
                        "churn_risk": "Có/Không",
                        "suggestion": "Gợi ý xử lý cụ thể",
                        "details": "Mô tả ngắn gọn"
                    }` },
                    { role: "user", content: `Phân tích câu này: "${text}". Quy tắc: Score 7-10 là Tích cực, 4-6 là Trung lập, 0-3 là Tiêu cực.` }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content);
        
        res.innerHTML = `
            <div class="result-card" style="border-left-color: ${obj.score < 4 ? '#e74c3c' : (obj.score > 6 ? '#27ae60' : '#f1c40f')};">
                <div class="row"><strong>Tâm trạng:</strong> ${obj.sentiment} (${obj.score}/10)</div>
                <div class="row"><strong>Từ khóa tiêu cực:</strong> ${obj.keywords || 'Không'}</div>
                <div class="row"><strong>Rủi ro rời bỏ:</strong> ${obj.churn_risk}</div>
                <p><strong>Gợi ý xử lý:</strong> ${obj.suggestion}</p>
                <hr>
                <p style="font-size: 13px;">${obj.details}</p>
            </div>
        `;
    } catch (e) {
        res.innerHTML = "Lỗi phân tích. Kiểm tra Console!";
    }
});