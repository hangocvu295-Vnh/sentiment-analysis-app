const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "Đang phân tích chuyên sâu...";
    
    try {
        const response = await fetch("[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: `Bạn là chuyên gia CSKH. Phân tích phản hồi và trả về JSON chuẩn, không Markdown, không giải thích: {"hai_long": 0, "chat_luong": 0, "dich_vu": 0, "gia_ca": 0, "van_de": "...", "gioi_thieu": 0, "ket_luan": "..."}` },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        
        // Bước xử lý quan trọng: Loại bỏ Markdown bẩn
        let rawContent = data.choices[0].message.content;
        rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const obj = JSON.parse(rawContent);
        
        res.innerHTML = `
            <div class="result-card">
                <p><strong>Mức độ hài lòng:</strong> ${obj.hai_long}/10</p>
                <p><strong>Chất lượng SP:</strong> ${obj.chat_luong}/10</p>
                <p><strong>Trải nghiệm DV:</strong> ${obj.dich_vu}/10</p>
                <p><strong>Giá cả:</strong> ${obj.gia_ca}/10</p>
                <p><strong>Khả năng giới thiệu:</strong> ${obj.gioi_thieu}/10</p>
                <hr>
                <p><strong>Vấn đề:</strong> ${obj.van_de}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi xử lý dữ liệu. Vui lòng kiểm tra lại cấu trúc JSON của AI.";
    }
});