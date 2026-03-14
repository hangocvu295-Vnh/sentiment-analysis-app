const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Nhập phản hồi đi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: `Bạn là CX Analyst. Trả về JSON duy nhất với key: 
                "hai_long", "ho_tro", "san_pham", "gia_tri", "trai_nghiem", "quay_lai" (số 1-10).
                "chan_dung" (insight hành vi sắc bén), "dong_co_an" (động cơ tâm lý sâu xa), "trung_thanh" (số 1-10).
                "giai_phap_1", "giai_phap_2", "giai_phap_3" (hành động cụ thể, không chung chung).` }, 
                { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <h3>📊 BÁO CÁO CHUYÊN GIA</h3>
            <div class="metric-grid">
                ${renderBar("Hài lòng", obj.hai_long)} ${renderBar("Hỗ trợ", obj.ho_tro)}
                ${renderBar("Sản phẩm", obj.san_pham)} ${renderMetric("Giá trị", obj.gia_tri)}
                ${renderMetric("Trải nghiệm", obj.trai_nghiem)} ${renderMetric("Quay lại", obj.quay_lai)}
            </div>
            <div class="psych-box">
                <p><strong>👥 Chân dung:</strong> ${obj.chan_dung}</p>
                <p><strong>🎯 Động cơ ẩn:</strong> ${obj.dong_co_an}</p>
                <p><strong>📈 Chỉ số trung thành:</strong> ${obj.trung_thanh}/10</p>
            </div>
            <div class="action-box">
                <h4>🚀 Hướng giải quyết chuyên gia:</h4>
                <p>1. ${obj.giai_phap_1}</p>
                <p>2. ${obj.giai_phap_2}</p>
                <p>3. ${obj.giai_phap_3}</p>
            </div>
        `;
    } catch (e) { res.innerHTML = "❌ AI bị lỗi dữ liệu, thử lại lần nữa đi bạn!"; }
});

function renderBar(l, v) {
    const val = v || 5;
    return `<div class="metric-item"><div>${l} <strong>${val}/10</strong></div><div class="bar-container"><div class="bar-fill" style="width:${val*10}%"></div></div></div>`;
}
function renderMetric(l, v) { return renderBar(l, v); }