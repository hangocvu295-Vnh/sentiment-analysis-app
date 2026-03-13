const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

// Hàm bảo vệ, chuyển mọi thứ không phải số về 0
const formatVal = (val) => {
    const num = Number(val);
    return isNaN(num) || val === null ? 0 : num;
};

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
                    { 
                        role: "system", 
                        content: `Bạn là chuyên gia phân tích CSKH. Trả về JSON thuần.
                        QUY TẮC: Luôn trả về số (0-10) cho các trường điểm số, không trả về null hay chuỗi.
                        CẤU TRÚC JSON: {"hai_long": 0, "chat_luong": 0, "dich_vu": 0, "gia_ca": 0, "gioi_thieu": 0, "tu_khoa": "...", "rui_ro": "...", "goi_y": "...", "ket_luan": "..."}` 
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        let rawContent = data.choices[0].message.content;
        
        const start = rawContent.indexOf('{');
        const end = rawContent.lastIndexOf('}');
        const jsonStr = rawContent.substring(start, end + 1);
        const obj = JSON.parse(jsonStr);
        
        res.innerHTML = `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong>Hài lòng:</strong> ${formatVal(obj.hai_long)}/10</p>
                    <p><strong>SP:</strong> ${formatVal(obj.chat_luong)}/10</p>
                    <p><strong>DV:</strong> ${formatVal(obj.dich_vu)}/10</p>
                    <p><strong>Giá:</strong> ${formatVal(obj.gia_ca)}/10</p>
                    <p><strong>GT:</strong> ${formatVal(obj.gioi_thieu)}/10</p>
                </div>
                <hr>
                <p><strong>Từ khóa:</strong> ${obj.tu_khoa || 'Không có'}</p>
                <p><strong>Rủi ro:</strong> ${obj.rui_ro || 'Không'}</p>
                <p><strong>Gợi ý:</strong> ${obj.goi_y || 'Chưa có'}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan || 'Không có'}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi xử lý dữ liệu. Hãy kiểm tra tab Console (F12).";
    }
});