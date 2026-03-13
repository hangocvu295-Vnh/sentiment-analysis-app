const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

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
                        content: `Bạn là chuyên gia phân tích CSKH. Hãy chấm điểm 0-10 cho từng mục dựa trên ngữ cảnh:
                        1. Hai_long_chung: Dựa trên trải nghiệm tổng thể.
                        2. Chat_luong_sp: Mô tả, lỗi, độ ổn định.
                        3. Trai_nghiem_sd: Dễ dùng, tốc độ, rõ ràng.
                        4. Ho_tro_cskh: Phản hồi, thái độ, giải quyết vấn đề.
                        5. Gia_tri_gia_tien: Đáng tiền hay đắt.
                        6. Quay_lai_gt: Khả năng giới thiệu, sử dụng tiếp.
                        JSON bắt buộc: {"hai_long":0, "chat_luong":0, "trai_nghiem":0, "ho_tro":0, "gia_tri":0, "quay_lai":0, "tu_khoa":"...", "rui_ro":"...", "goi_y":"...", "ket_luan":"..."}` 
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{.*\}/s)[0]);
        
        res.innerHTML = `
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff;">
                <p><strong>1. Hài lòng chung:</strong> ${formatVal(obj.hai_long)}/10</p>
                <p><strong>2. Chất lượng SP:</strong> ${formatVal(obj.chat_luong)}/10</p>
                <p><strong>3. Trải nghiệm SD:</strong> ${formatVal(obj.trai_nghiem)}/10</p>
                <p><strong>4. Hỗ trợ CSKH:</strong> ${formatVal(obj.ho_tro)}/10</p>
                <p><strong>5. Giá trị/Tiền:</strong> ${formatVal(obj.gia_tri)}/10</p>
                <p><strong>6. Quay lại/GT:</strong> ${formatVal(obj.quay_lai)}/10</p>
                <hr>
                <p><strong>Từ khóa:</strong> ${obj.tu_khoa || 'Không'}</p>
                <p><strong>Rủi ro:</strong> ${obj.rui_ro || 'Không'}</p>
                <p><strong>Gợi ý:</strong> ${obj.goi_y || 'Chưa có'}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan || 'Không có'}</p>
            </div>
        `;
    } catch (e) {
        res.innerHTML = "Lỗi dữ liệu. Hãy nhấn F12 để kiểm tra.";
    }
});