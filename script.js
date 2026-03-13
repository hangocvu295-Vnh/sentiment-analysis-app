const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const userInput = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = userInput.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi của khách hàng!");

    res.innerHTML = "Đang phân tích sâu...";
    
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
                    { role: "system", content: `Bạn là chuyên gia phân tích CSKH. Hãy phân tích phản hồi của khách hàng và trả về đúng 1 đoạn code JSON không kèm giải thích khác:
                    {
                        "sentiment": "Tích cực/Tiêu cực/Trung lập",
                        "score": "Điểm từ 1 đến 10",
                        "reason": "Giải thích ngắn gọn tại sao",
                        "urgency": "Cao/Trung bình/Thấp"
                    }` },
                    { role: "user", content: `Phân tích câu này: "${text}"` }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Chuyển đổi chuỗi JSON trả về thành object JS
        const resultObj = JSON.parse(content);
        
        // Cập nhật giao diện với dữ liệu chuyên nghiệp
        res.innerHTML = `
            <div style="background: #f4f4f9; padding: 15px; border-radius: 8px; border-left: 5px solid ${resultObj.urgency === 'Cao' ? 'red' : 'green'};">
                <p><strong>Tâm trạng:</strong> ${resultObj.sentiment}</p>
                <p><strong>Điểm số:</strong> ${resultObj.score}/10</p>
                <p><strong>Lý do:</strong> ${resultObj.reason}</p>
                <p><strong>Mức độ ưu tiên:</strong> ${resultObj.urgency}</p>
            </div>
        `;
    } catch (e) {
        console.error(e);
        res.innerHTML = "Có lỗi xảy ra trong quá trình phân tích chuyên sâu.";
    }
});