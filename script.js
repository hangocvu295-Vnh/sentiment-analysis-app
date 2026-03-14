const GEMINI_API_KEY = "AIzaSyBJWQwx8z-Sq6_UxJp5SPsfWm38t8WQOAw"; // Key bạn vừa gửi
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

    res.innerHTML = "Đang kết nối Google AI để phân tích...";
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Bạn là chuyên gia phân tích CSKH. Hãy đọc phản hồi sau và chấm điểm 0-10 cho 6 mục. 
                        Trả về DUY NHẤT một khối JSON thuần túy, không dùng markdown, không giải thích gì thêm.
                        
                        Các mục chấm điểm:
                        1. hai_long: Trải nghiệm tổng thể.
                        2. chat_luong: Đúng mô tả, độ ổn định, lỗi.
                        3. trai_nghiem: Tốc độ, dễ dùng, rõ ràng.
                        4. ho_tro: Thái độ, tốc độ phản hồi.
                        5. gia_tri: Đáng tiền hay không.
                        6. quay_lai: Khả năng giới thiệu/quay lại.

                        Dữ liệu cần thêm: tu_khoa (tiêu cực), rui_ro (Có/Không), goi_y (xử lý cụ thể), ket_luan.
                        
                        Phản hồi của khách: "${text}"`
                    }]
                }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        const rawContent = data.candidates[0].content.parts[0].text;
        const obj = JSON.parse(rawContent);
        
        res.innerHTML = `
            <div style="border: 2px solid #4285F4; padding: 15px; border-radius: 8px; background: #fff;">
                <h3 style="color:#4285F4; margin-top:0;">Kết quả từ Google AI</h3>
                <p><strong>1. Hài lòng chung:</strong> ${formatVal(obj.hai_long)}/10</p>
                <p><strong>2. Chất lượng SP:</strong> ${formatVal(obj.chat_luong)}/10</p>
                <p><strong>3. Trải nghiệm SD:</strong> ${formatVal(obj.trai_nghiem)}/10</p>
                <p><strong>4. Hỗ trợ CSKH:</strong> ${formatVal(obj.ho_tro)}/10</p>
                <p><strong>5. Giá trị/Tiền:</strong> ${formatVal(obj.gia_tri)}/10</p>
                <p><strong>6. Quay lại/GT:</strong> ${formatVal(obj.quay_lai)}/10</p>
                <hr>
                <p><strong>Từ khóa tiêu cực:</strong> <span style="color:red;">${obj.tu_khoa || 'Không'}</span></p>
                <p><strong>Rủi ro rời bỏ:</strong> <b>${obj.rui_ro || 'Không'}</b></p>
                <p><strong>Gợi ý xử lý:</strong> ${obj.goi_y || 'Chưa có'}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan || 'Không có'}</p>
            </div>
        `;
    } catch (e) {
        console.error(e);
        res.innerHTML = "Lỗi kết nối Google AI Studio. Vui lòng kiểm tra lại API Key hoặc mạng.";
    }
});