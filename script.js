const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

// Hàm tạo thanh đo chuyên nghiệp
const createBar = (label, value) => {
    const num = Math.min(Number(value) || 0, 10);
    let color = num < 5 ? "#e74c3c" : (num < 8 ? "#f39c12" : "#27ae60");
    return `
        <div class="metric-bar">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.9em; margin-bottom:5px;">
                <span>${label}</span><span>${num}/10</span>
            </div>
            <div class="bar-bg"><div class="bar-fill" style="width: ${num * 10}%; background-color: ${color};"></div></div>
        </div>
    `;
};

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "🚀 Đang phân tích chuyên sâu...";
    
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
                        content: `Bạn là Chuyên gia CX. Trả về JSON duy nhất. 
                        Cấu trúc: {"hai_long": 0, "chat_luong": 0, "trai_nghiem": 0, "ho_tro": 0, "gia_tri": 0, "quay_lai": 0, "insight": "Ngắn gọn", "tu_khoa": "...", "rui_ro": "Thấp", "hanh_dong": "...", "ket_luan": "..."}` 
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        
        // --- XỬ LÝ LỖI DỮ LIỆU "CỨNG" ---
        let rawContent = data.choices[0].message.content;
        const match = rawContent.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Dữ liệu trả về không phải JSON");
        
        const obj = JSON.parse(match[0]);
        
        // Đảm bảo không bị lỗi nếu AI quên trả về trường nào đó
        const safe = (val, fallback = "Không có thông tin") => val || fallback;

        res.innerHTML = `
            <div class="dashboard">
                <h2 style="border-bottom: 2px solid #3498db; padding-bottom: 10px;">📊 BÁO CÁO PHÂN TÍCH</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>${createBar("Hài lòng", obj.hai_long)}${createBar("Sản phẩm", obj.chat_luong)}${createBar("Trải nghiệm", obj.trai_nghiem)}</div>
                    <div>${createBar("Hỗ trợ", obj.ho_tro)}${createBar("Giá trị", obj.gia_tri)}${createBar("Quay lại", obj.quay_lai)}</div>
                </div>
                <div class="insight-box" style="margin-top:20px;">💡 <strong>Insight:</strong> ${safe(obj.insight)}</div>
                <div style="margin-top:15px;"><strong>🚩 Rủi ro:</strong> ${safe(obj.rui_ro)} | <strong>🔑 Từ khóa:</strong> ${safe(obj.tu_khoa)}</div>
                <div style="margin-top:10px; background:#fff5f5; padding:10px; border-radius:8px;"><strong>🛠 Hành động:</strong> ${safe(obj.hanh_dong)}</div>
            </div>
        `;
    } catch (e) {
        console.error(e);
        res.innerHTML = `<div style="color:red;">❌ Lỗi phân tích: ${e.message}. Vui lòng thử lại!</div>`;
    }
});