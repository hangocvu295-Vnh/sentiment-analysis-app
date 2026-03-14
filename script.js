const GEMINI_API_KEY = "AIzaSyBJWQwx8z-Sq6_UxJp5SPsfWm38t8WQOAw"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

// Hàm bảo vệ: Ép mọi giá trị không phải số về 0
const formatVal = (val) => {
    const num = Number(val);
    return isNaN(num) || val === null ? 0 : num;
};

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "Đang phân tích với Google AI...";
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là chuyên gia phân tích CSKH. Hãy chấm điểm 0-10 cho các mục sau dựa trên phản hồi của khách hàng: "${text}"
                        1. hai_long: Trải nghiệm tổng thể.
                        2. chat_luong: Đúng mô tả, độ ổn định, lỗi.
                        3. trai_nghiem: Tốc độ web/app, dễ dùng.
                        4. ho_tro: Thái độ, tốc độ phản hồi CSKH.
                        5. gia_tri: Đáng tiền hay quá đắt.
                        6. quay_lai: Khả năng giới thiệu hoặc mua lại.
                        7. tu_khoa: Các từ tiêu cực (lỗi nhỏ, khó chịu...).
                        8. rui_ro: Có hoặc Không.
                        9. goi_y: CSKH liên hệ lại + hướng dẫn chi tiết.
                        10. ket_luan: Đánh giá tổng quát.
                        
                        Chỉ trả về JSON thuần.`
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        
        // Kiểm tra lỗi từ phía Google (như sai Key hoặc hết hạn)
        if (data.error) throw new Error(data.error.message);

        const rawContent = data.candidates[0].content.parts[0].text;
        const obj = JSON.parse(rawContent);
        
        res.innerHTML = `
            <div style="border: 2px solid #4285F4; padding: 15px; border-radius: 8px; background: #fff; font-family: Arial, sans-serif;">
                <h3 style="color:#4285F4; margin-top:0;">⚡ Kết quả từ Google Gemini AI</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <p><strong>1. Hài lòng:</strong> ${formatVal(obj.hai_long)}/10</p>
                    <p><strong>2. Chất lượng:</strong> ${formatVal(obj.chat_luong)}/10</p>
                    <p><strong>3. Trải nghiệm:</strong> ${formatVal(obj.trai_nghiem)}/10</p>
                    <p><strong>4. Hỗ trợ:</strong> ${formatVal(obj.ho_tro)}/10</p>
                    <p><strong>5. Giá trị:</strong> ${formatVal(obj.gia_tri)}/10</p>
                    <p><strong>6. Quay lại:</strong> ${formatVal(obj.quay_lai)}/10</p>
                </div>
                <hr style="border: 0.5px solid #eee;">
                <p><strong>Từ khóa:</strong> <span style="color:red;">${obj.tu_khoa || 'Không'}</span></p>
                <p><strong>Rủi ro rời bỏ:</strong> <b>${obj.rui_ro || 'Không'}</b></p>
                <p><strong>Gợi ý xử lý:</strong> ${obj.goi_y || 'Chưa có'}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan || 'Không có'}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = `Lỗi: ${e.message}. Vui lòng kiểm tra lại API Key hoặc mạng.`;
    }
});