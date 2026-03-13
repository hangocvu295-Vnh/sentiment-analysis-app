const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
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
                    { role: "system", content: "Bạn là chuyên gia phân tích CSKH. Hãy trả về ĐÚNG 1 ĐOẠN JSON duy nhất, không thêm bất kỳ chữ nào khác. Format chuẩn: {\"hai_long\": 0, \"chat_luong\": 0, \"dich_vu\": 0, \"gia_ca\": 0, \"van_de\": \"...\", \"gioi_thieu\": 0, \"ket_luan\": \"...\"}" },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        
        // --- BỘ LỌC DỮ LIỆU ĐỂ TRÁNH LỖI JSON ---
        let rawContent = data.choices[0].message.content;
        
        // Tìm vị trí của '{' đầu tiên và '}' cuối cùng
        const start = rawContent.indexOf('{');
        const end = rawContent.lastIndexOf('}');
        
        if (start === -1 || end === -1) {
            throw new Error("Không tìm thấy cấu trúc JSON hợp lệ trong phản hồi");
        }
        
        const jsonStr = rawContent.substring(start, end + 1);
        const obj = JSON.parse(jsonStr); // Bây giờ nó chắc chắn là JSON sạch
        
        // Hiển thị kết quả
        res.innerHTML = `
            <div class="result-card">
                <div class="row"><span>Mức độ hài lòng:</span> <b>${obj.hai_long}/10</b></div>
                <div class="row"><span>Chất lượng SP:</span> <b>${obj.chat_luong}/10</b></div>
                <div class="row"><span>Trải nghiệm DV:</span> <b>${obj.dich_vu}/10</b></div>
                <div class="row"><span>Giá cả:</span> <b>${obj.gia_ca}/10</b></div>
                <div class="row"><span>Khả năng giới thiệu:</span> <b>${obj.gioi_thieu}/10</b></div>
                <hr>
                <p><strong>Vấn đề chính:</strong> ${obj.van_de}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi xử lý dữ liệu. Vui lòng thử lại.";
    }
});