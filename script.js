const GEMINI_API_KEY = "AIzaSyBJWQwx8z-Sq6_UxJp5SPsfWm38t8WQOAw";
// Sử dụng model gemini-1.5-flash vì nó nhanh và phù hợp cho phân tích văn bản
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

// Hàm lọc giá trị để không bị lỗi hiển thị
const formatVal = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "Đang phân tích với Google Gemini...";
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Phân tích phản hồi khách hàng: "${text}". 
                        Hãy chấm điểm 0-10 cho: 
                        1. hai_long (Tổng thể)
                        2. chat_luong (Sản phẩm)
                        3. trai_nghiem (Sử dụng web/app)
                        4. ho_tro (CSKH)
                        5. gia_tri (Đáng tiền)
                        6. quay_lai (Khả năng giới thiệu)
                        Kèm theo: tu_khoa (tiêu cực), rui_ro (Có/Không), goi_y (hành động cụ thể), ket_luan.
                        Chỉ trả về JSON.`
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        
        // Kiểm tra nếu Google báo lỗi API Key
        if (data.error) {
            throw new Error(data.error.message);
        }

        const rawContent = data.candidates[0].content.parts[0].text;
        const obj = JSON.parse(rawContent);
        
        res.innerHTML = `
            <div style="border: 2px solid #4285F4; padding: 15px; border-radius: 8px; background: #fff; font-family: sans-serif;">
                <h3 style="color:#4285F4; margin-top:0;">⚡ Phân tích bởi Gemini AI</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <p><strong>1. Hài lòng:</strong> ${formatVal(obj.hai_long)}/10</p>
                    <p><strong>2. Chất lượng:</strong> ${formatVal(obj.chat_luong)}/10</p>
                    <p><strong>3. Trải nghiệm:</strong> ${formatVal(obj.trai_nghiem)}/10</p>
                    <p><strong>4. Hỗ trợ:</strong> ${formatVal(obj.ho_tro)}/10</p>
                    <p><strong>5. Giá trị:</strong> ${formatVal(obj.gia_tri)}/10</p>
                    <p><strong>6. Quay lại:</strong> ${formatVal(obj.quay_lai)}/10</p>
                </div>
                <hr style="border: 0.5px solid #eee;">
                <p><strong>Từ khóa tiêu cực:</strong> <span style="color:red;">${obj.tu_khoa || 'Không'}</span></p>
                <p><strong>Rủi ro rời bỏ:</strong> <span style="font-weight:bold; color: ${obj.rui_ro === 'Có' ? 'orange' : 'green'}">${obj.rui_ro}</span></p>
                <p><strong>Gợi ý:</strong> ${obj.goi_y}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi chi tiết:", e);
        res.innerHTML = `Lỗi: ${e.message}. Kiểm tra lại API Key hoặc VPN (nếu có).`;
    }
});