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
                    { role: "system", content: `Bạn là chuyên gia CSKH. Phân tích phản hồi và trả về JSON chuẩn, không Markdown, không giải thích. Định dạng:
                    {
                        "hai_long": 0, "chat_luong": 0, "dich_vu": 0, "gia_ca": 0, "gioi_thieu": 0,
                        "tu_khoa": "Liệt kê các từ khóa tiêu cực/tích cực",
                        "rui_ro": "Có hoặc Không",
                        "goi_y": "CSKH liên hệ lại + hướng dẫn chi tiết",
                        "ket_luan": "Đánh giá chung"
                    }` },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        let rawContent = data.choices[0].message.content;
        
        // Làm sạch JSON
        const start = rawContent.indexOf('{');
        const end = rawContent.lastIndexOf('}');
        const jsonStr = rawContent.substring(start, end + 1);
        const obj = JSON.parse(jsonStr);
        
        // Hiển thị đầy đủ 8 mục yêu cầu
        res.innerHTML = `
            <div class="result-card" style="padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong>Hài lòng:</strong> ${obj.hai_long}/10</p>
                    <p><strong>SP:</strong> ${obj.chat_luong}/10</p>
                    <p><strong>DV:</strong> ${obj.dich_vu}/10</p>
                    <p><strong>Giá:</strong> ${obj.gia_ca}/10</p>
                    <p><strong>GT:</strong> ${obj.gioi_thieu}/10</p>
                </div>
                <hr>
                <p><strong>Từ khóa:</strong> <span style="color: #d9534f;">${obj.tu_khoa}</span></p>
                <p><strong>Rủi ro rời bỏ:</strong> <b>${obj.rui_ro}</b></p>
                <p><strong>Gợi ý xử lý:</strong> ${obj.goi_y}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi xử lý dữ liệu. Hãy kiểm tra tab Console (F12).";
    }
});