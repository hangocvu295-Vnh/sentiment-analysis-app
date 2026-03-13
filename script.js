const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

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
                    { 
                        role: "system", 
                        content: `Bạn là chuyên gia phân tích CSKH. Trả về JSON thuần.
                        QUY TẮC ĐÁNH GIÁ (BẮT BUỘC):
                        - Điểm 8-10: Khách hàng hài lòng, khen ngợi, vui vẻ.
                        - Điểm 5-7: Khách hàng trung lập, góp ý nhẹ nhàng.
                        - Điểm 1-4: Khách hàng tiêu cực, phàn nàn, khó chịu.
                        CẤU TRÚC JSON: {"hai_long": number, "chat_luong": number, "dich_vu": number, "gia_ca": number, "gioi_thieu": number, "tu_khoa": "string", "rui_ro": "Có/Không", "goi_y": "string", "ket_luan": "string"}` 
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        let rawContent = data.choices[0].message.content;
        
        // Cơ chế trích xuất JSON "sắt đá"
        const start = rawContent.indexOf('{');
        const end = rawContent.lastIndexOf('}');
        const jsonStr = rawContent.substring(start, end + 1);
        const obj = JSON.parse(jsonStr);
        
        // Hiển thị kết quả
        res.innerHTML = `
            <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom:10px;">
                    <p><strong>Hài lòng:</strong> ${obj.hai_long}/10</p>
                    <p><strong>SP:</strong> ${obj.chat_luong}/10</p>
                    <p><strong>DV:</strong> ${obj.dich_vu}/10</p>
                    <p><strong>Giá:</strong> ${obj.gia_ca}/10</p>
                    <p><strong>GT:</strong> ${obj.gioi_thieu}/10</p>
                </div>
                <hr>
                <p><strong>Từ khóa:</strong> <span style="color: ${obj.hai_long < 5 ? 'red' : 'green'}">${obj.tu_khoa}</span></p>
                <p><strong>Rủi ro rời bỏ:</strong> <b>${obj.rui_ro}</b></p>
                <p><strong>Gợi ý xử lý:</strong> ${obj.goi_y}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi dữ liệu. Hãy kiểm tra tab Console (F12).";
    }
});