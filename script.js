const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: `Bạn là chuyên gia CX. Trả về JSON PHẲNG với đúng các key: 
                "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai" (số 0-10), 
                "tin_tuong", "buc_boi", "hao_hung" (số 0-10), 
                "dong_co", "nguong_that_vong" (mô tả), "insight" (phân tích sâu). 
                KHÔNG ĐƯỢC THAY ĐỔI TÊN KEY.` }, 
                { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <div class="section-title">📊 6 TIÊU CHÍ GỐC</div>
            <div class="metric-grid">
                ${renderMetric("Hài lòng", obj.hai_long)} ${renderMetric("SP", obj.san_pham)} ${renderMetric("Trải nghiệm", obj.trai_nghiem)}
                ${renderMetric("Hỗ trợ", obj.ho_tro)} ${renderMetric("Giá trị", obj.gia_tri)} ${renderMetric("Quay lại", obj.quay_lai)}
            </div>
            <div class="section-title">🧠 PHÂN TÍCH TÂM LÝ CHUYÊN SÂU</div>
            <div class="metric-grid">
                ${renderMetric("Tin tưởng", obj.tin_tuong)} ${renderMetric("Bực bội", obj.buc_boi)} ${renderMetric("Hào hứng", obj.hao_hung)}
            </div>
            <div style="margin-top:15px;">
                <p><strong>🎯 Động cơ:</strong> ${obj.dong_co || 'N/A'}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong || 'N/A'}</p>
            </div>
            <div class="section-title">💡 INSIGHT CHUYÊN GIA</div>
            <div class="insight-box">${obj.insight || 'N/A'}</div>
        `;
    } catch (e) { res.innerHTML = "❌ Lỗi: Dữ liệu bị sai cấu trúc."; }
});

function renderMetric(l, v) { return `<div class="metric-card"><small>${l}</small><strong>${v || 0}/10</strong></div>`; }