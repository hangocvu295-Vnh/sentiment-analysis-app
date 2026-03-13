const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "Đang phân tích chuyên sâu các tiêu chí...";
    
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
                    { role: "system", content: `Bạn là chuyên gia phân tích khách hàng. Hãy phân tích phản hồi và trả về JSON chuẩn sau:
                    {
                        "muc_do_hai_long": "1-10",
                        "chat_luong_sp": "Đánh giá/10",
                        "trai_nghiem_dv": "Đánh giá/10",
                        "gia_ca": "Đánh giá/10",
                        "van_de": "Mô tả vấn đề chính",
                        "kha_nang_gioi_thieu": "Điểm NPS 0-10",
                        "ket_luan_chung": "Đánh giá ngắn gọn"
                    }` },
                    { role: "user", content: text }
                ],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content);
        
        // Hiển thị chuyên sâu
        res.innerHTML = `
            <div class="result-card">
                <div class="row"><strong>Mức độ hài lòng:</strong> ${obj.muc_do_hai_long}/10</div>
                <div class="row"><strong>Chất lượng SP:</strong> ${obj.chat_luong_sp}/10</div>
                <div class="row"><strong>Trải nghiệm DV:</strong> ${obj.trai_nghiem_dv}/10</div>
                <div class="row"><strong>Giá cả:</strong> ${obj.gia_ca}/10</div>
                <div class="row"><strong>Khả năng giới thiệu:</strong> ${obj.kha_nang_gioi_thieu}/10</div>
                <hr>
                <p><strong>Vấn đề:</strong> ${obj.van_de}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan_chung}</p>
            </div>
        `;
    } catch (e) {
        res.innerHTML = "Lỗi phân tích chuyên sâu. Kiểm tra Console!";
    }
});