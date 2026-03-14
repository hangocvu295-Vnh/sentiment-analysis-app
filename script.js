document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return;
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là chuyên gia phân tích CX. Trả về JSON PHẲNG. Các key bắt buộc: 
                    hai_long, ho_tro, san_pham, gia_tri, trai_nghiem, quay_lai (số 0-10). 
                    chan_dung (insight hành vi sắc bén), dong_co_an (động cơ tâm lý sâu xa), chi_so_trung_thanh (số 0-10), 
                    giai_phap_1, giai_phap_2, giai_phap_3 (hành động cụ thể).` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <h3>📊 BÁO CÁO CHUYÊN GIA</h3>
            <div class="metric-box">
                ${renderMetric("Hài lòng", obj.hai_long)} ${renderMetric("Hỗ trợ", obj.ho_tro)}
                ${renderMetric("Sản phẩm", obj.san_pham)} ${renderMetric("Giá trị", obj.gia_tri)}
                ${renderMetric("Trải nghiệm", obj.trai_nghiem)} ${renderMetric("Quay lại", obj.quay_lai)}
            </div>
            <div class="insight-section">
                <div class="insight-item">
                    <span class="insight-label">👥 Chân dung tâm lý:</span> ${obj.chan_dung}
                </div>
                <div class="insight-item">
                    <span class="insight-label">🎯 Động cơ ẩn:</span> ${obj.dong_co_an}
                </div>
                <div class="insight-item">
                    <span class="insight-label">📈 Chỉ số trung thành:</span> ${obj.chi_so_trung_thanh}/10
                </div>
            </div>
            <div class="insight-section" style="margin-top:15px; border-left-color: #f39c12;">
                <span class="insight-label">🚀 Hướng giải quyết chuyên gia:</span>
                <p>1. ${obj.giai_phap_1}</p>
                <p>2. ${obj.giai_phap_2}</p>
                <p>3. ${obj.giai_phap_3}</p>
            </div>
        `;
    } catch (e) { res.innerHTML = "❌ Lỗi hệ thống. Thử lại!"; }
});

function renderMetric(label, val) {
    const v = val || 0;
    return `<div class="metric-item">
        <div style="display:flex; justify-content:space-between"><span>${label}</span><strong>${v}/10</strong></div>
        <div class="bar-container"><div class="bar-fill" style="width:${v*10}%"></div></div>
    </div>`;
}