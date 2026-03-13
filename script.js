const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

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
                    { role: "system", content: "Chỉ trả về JSON thuần, KHÔNG Markdown, KHÔNG giải thích. Format: {\"hai_long\": 5, \"chat_luong\": 5, \"dich_vu\": 5, \"gia_ca\": 5, \"van_de\": \"...\", \"gioi_thieu\": 5, \"ket_luan\": \"...\"}" },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        
        // --- BỘ LỌC CỨNG ---
        // Tìm đoạn có chứa { và } để trích xuất JSON
        const start = rawContent.indexOf('{');
        const end = rawContent.lastIndexOf('}');
        const jsonStr = rawContent.substring(start, end + 1);
        
        const obj = JSON.parse(jsonStr);
        
        res.innerHTML = `
            <div class="result-card">
                <p><strong>Hài lòng:</strong> ${obj.hai_long}/10 | <strong>SP:</strong> ${obj.chat_luong}/10</p>
                <p><strong>Dịch vụ:</strong> ${obj.dich_vu}/10 | <strong>Giá:</strong> ${obj.gia_ca}/10</p>
                <p><strong>Khả năng giới thiệu:</strong> ${obj.gioi_thieu}/10</p>
                <hr>
                <p><strong>Vấn đề:</strong> ${obj.van_de}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi xử lý. Hãy nhấn F12, chọn tab Console để xem AI đã trả về dữ liệu gì.";
    }
});