const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang chẩn đoán tâm lý khách hàng...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là Chuyên gia Tâm lý khách hàng. Phân tích:
                    1. 6 tiêu chí (0-10): hai_long, san_pham, trai_nghiem, ho_tro, gia_tri, quay_lai
                    2. Tâm lý (mô tả ngắn): dong_co, noi_lo, nguong_that_vong
                    3. Cảm xúc (0-10): tin_tuong, buc_boi, hao_hung
                    4. Insight: 1 phát hiện bất ngờ + 1 hành động ưu tiên.
                    TRẢ VỀ DUY NHẤT MỘT CHUỖI JSON HỢP LỆ, KHÔNG CHỮ THỪA.` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        
        // --- BƯỚC LỌC JSON SIÊU CẤP ---
        const jsonStartIndex = rawContent.indexOf('{');
        const jsonEndIndex = rawContent.lastIndexOf('}');
        const cleanJson = rawContent.substring(jsonStartIndex, jsonEndIndex + 1);
        const obj = JSON.parse(cleanJson);
        // ------------------------------

        res.innerHTML = `
            <div class="section-title">📊 6 Tiêu chí gốc</div>
            <div class="grid-3">${renderStats({Hài_lòng: obj.hai_long, SP: obj.san_pham, Trải_nghiệm: obj.trai_nghiem, Hỗ_trợ: obj.ho_tro, Giá_trị: obj.gia_tri, Quay_lại: obj.quay_lai})}</div>
            
            <div class="section-title">🧠 Phân tích tâm lý chuyên sâu</div>
            <div class="grid-3">${renderStats({Tin_tưởng: obj.tin_tuong, Bực_bội: obj.buc_boi, Hào_hứng: obj.hao_hung})}</div>
            
            <div style="margin-top:15px; font-size:0.95em;">
                <p><strong>🎯 Động cơ:</strong> ${obj.dong_co}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong}</p>
            </div>
            
            <div class="section-title">💡 Insight chuyên gia</div>
            <div class="insight-box">${obj.insight}</div>
        `;
    } catch (e) { 
        console.error("Lỗi parse:", e);
        res.innerHTML = "❌ Lỗi hệ thống: AI trả về định dạng lạ. Hãy thử lại!"; 
    }
});

function renderStats(obj) {
    return Object.entries(obj).map(([key, val]) => 
        `<div class="stat-card"><strong>${key.replace('_',' ')}</strong><span style="font-size:1.3em; display:block;">${val}/10</span></div>`
    ).join('');
}