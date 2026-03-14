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
                messages: [{ role: "system", content: `Bạn là Chuyên gia Tâm lý học hành vi khách hàng. Phân tích 5 tầng:
                1. KPI (0-10): hài_long, quay_lai, gioi_thieu
                2. Trai_nghiem (0-10): giao_dien, toc_do, quy_trinh
                3. Cam_xuc (0-10): tin_tuong, buc_boi, hao_hung
                4. Tam_ly: dong_co (mô tả ngắn), noi_lo (mô tả ngắn), nguong_that_vong (mô tả ngắn)
                5. Insight: 1 phát hiện bất ngờ + 1 hành động ưu tiên.
                Trả về JSON duy nhất.` }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <div class="section-title">1. Chỉ số KPI</div>
            <div class="grid-3">${renderStats(obj.kpi)}</div>
            <div class="section-title">2. Tầng Trải nghiệm</div>
            <div class="grid-3">${renderStats(obj.trai_nghiem)}</div>
            <div class="section-title">3. Tầng Cảm xúc</div>
            <div class="grid-3">${renderStats(obj.cam_xuc)}</div>
            <div class="section-title">4. Phân tích Tâm lý</div>
            <div style="margin-top:10px; font-size:0.95em;">
                <p><strong>🎯 Động cơ:</strong> ${obj.tam_ly.dong_co}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.tam_ly.nguong_that_vong}</p>
            </div>
            <div class="section-title">5. Insight Chuyên gia</div>
            <div class="insight-box">${obj.insight}</div>
        `;
    } catch (e) { res.innerHTML = "❌ Lỗi: Dữ liệu phân tích không đạt chuẩn chuyên gia. Vui lòng thử lại."; }
});

function renderStats(obj) {
    return Object.entries(obj).map(([key, val]) => 
        `<div class="stat-card"><strong>${key.replace('_',' ')}</strong><span style="font-size:1.3em; display:block;">${val}/10</span></div>`
    ).join('');
}