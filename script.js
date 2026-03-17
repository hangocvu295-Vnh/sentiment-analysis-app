const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = document.getElementById("result");
    if (!text) return alert("Vui lòng dán nội dung phản hồi!");
    res.innerHTML = "Đang phân tích...";

    try {
        // Sửa API: Gọi trực tiếp Groq thay vì endpoint local
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: `Bạn là CX Analyst chuyên nghiệp. Phân tích feedback và trả về JSON duy nhất.
                    Cấu trúc JSON bắt buộc:
                    {
                      "score_card": { "Sản phẩm": 0, "Dịch vụ": 0, "Giá trị thực tế": 0, "Giao nhận": 0, "CSKH": 0 },
                      "insights": { "tu_khoa": [], "chan_dung": "", "dong_co_an": "", "ty_le_trung_thanh": "" },
                      "analysis": { "chuyen_sau": "", "giai_phap": [], "luu_y": "" }
                    }`
                }, {
                    role: "user",
                    content: text
                }],
                temperature: 0.2,
                response_format: { "type": "json_object" }
            })
        });

        const data = await response.json();
        if (!data.choices || !data.choices[0]) throw new Error("API không trả về dữ liệu");

        const obj = JSON.parse(data.choices[0].message.content);

        // --- GIỮ NGUYÊN TOÀN BỘ LOGIC HIỂN THỊ CŨ ---
        const colors = {
            "Sản phẩm": "#3b82f6", 
            "Dịch vụ": "#8b5cf6", 
            "Giá trị thực tế": "#f59e0b", 
            "Giao nhận": "#ec4899", 
            "CSKH": "#06b6d4"
        };

        function getMeaning(s) {
            if (s <= 2) return "Rất tiêu cực";
            if (s <= 4) return "Tiêu cực";
            if (s == 5) return "Trung lập";
            if (s <= 7) return "Khá tích cực";
            return "Rất tích cực";
        }

        function renderBar(s, label) {
            let score = Math.max(0, Math.min(10, Number(s) || 0));
            return `
                <div style="margin-bottom: 25px;">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom: 10px;">
                        <span>${label}:</span> 
                        <span>${score}/10 (${getMeaning(score)})</span>
                    </div>
                    <div style="background:#0f172a; height:12px; border-radius:6px;">
                        <div style="width:${score * 10}%; height:100%; background:${colors[label] || '#3b82f6'}; border-radius:6px;"></div>
                    </div>
                </div>`;
        }

        res.innerHTML = `
            <div class="card">
                <h3>Phần 1: Chỉ số CX</h3>
                ${Object.entries(obj.score_card).map(([k,v]) => renderBar(v, k)).join('')}
            </div>

            <div class="card">
                <h3>Phần 2: Insight Khách hàng</h3>
                <p><strong>Từ khóa:</strong> ${Array.isArray(obj.insights.tu_khoa) ? obj.insights.tu_khoa.join(', ') : obj.insights.tu_khoa}</p>
                <p><strong>Chân dung:</strong> ${obj.insights.chan_dung}</p>
                <p><strong>Động cơ ẩn:</strong> ${obj.insights.dong_co_an}</p>
                <p><strong>Tỷ lệ trung thành:</strong> ${obj.insights.ty_le_trung_thanh}</p>
            </div>

            <div class="card" style="grid-column: span 2;">
                <h3>Phần 3: Phân tích chiến lược & Giải pháp (CX Analyst View)</h3>
                <p style="margin-bottom: 15px;"><strong>Nhận định chuyên gia:</strong> ${obj.analysis.chuyen_sau}</p>
                
                <div style="background: #0f172a; padding: 15px; border-radius: 10px; border-left: 4px solid #60a5fa;">
                    <p style="margin-top: 0; font-weight: bold;">Lộ trình khắc phục (Action Plan):</p>
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        ${Array.isArray(obj.analysis.giai_phap) ? obj.analysis.giai_phap.map(g => `<li>${g}</li>`).join('') : `<li>${obj.analysis.giai_phap}</li>`}
                    </ul>
                </div>
                
                <p style="margin-top: 15px; font-style: italic; color: #94a3b8;">
                    <strong>💡 Lưu ý chiến lược:</strong> ${obj.analysis.luu_y}
                </p>
            </div>
        `;
    } catch (e) {
        console.error(e);
        res.innerHTML = "Lỗi hiển thị dữ liệu. Vui lòng kiểm tra lại phản hồi từ API.";
    }
});