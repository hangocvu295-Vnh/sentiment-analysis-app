const GROQ_API_KEY = "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";

const createBar = (label, value) => {
    const num = Math.min(Number(value) || 0, 10);
    let color = num < 5 ? "#e74c3c" : (num < 8 ? "#f39c12" : "#27ae60");
    return `<div class="metric-bar">
        <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.9em;"><span>${label}</span><span>${num}/10</span></div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${num * 10}%; background-color: ${color};"></div></div>
    </div>`;
};

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🚀 Đang phân tích quy trình...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: `Bạn là CX Strategist. Phân tích 6 mục (0-10đ). Trả về JSON: {"hai_long":0, "chat_luong":0, "trai_nghiem":0, "ho_tro":0, "gia_tri":0, "quay_lai":0, "insight":"...", "tu_khoa":"...", "rui_ro":"...", "hanh_dong":"bước 1\nbước 2\nbước 3", "ket_luan":"..."}` }, { role: "user", content: text }],
                temperature: 0.1
            })
        });
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `<div class="dashboard">
            <h2 style="border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">📊 BÁO CÁO PHÂN TÍCH</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>${createBar("Hài lòng", obj.hai_long)}${createBar("Sản phẩm", obj.chat_luong)}${createBar("Trải nghiệm", obj.trai_nghiem)}</div>
                <div>${createBar("Hỗ trợ", obj.ho_tro)}${createBar("Giá trị", obj.gia_tri)}${createBar("Quay lại", obj.quay_lai)}</div>
            </div>
            <div style="margin-top:20px;"><strong>💡 Insight:</strong> ${obj.insight}</div>
            <div class="action-steps">
                <h3 style="margin-top:0; color:#856404; font-size:1em;">🚀 Hướng giải quyết:</h3>
                ${obj.hanh_dong.split('\n').map((step, i) => `<div class="action-item"><span class="step-number">${i+1}</span><span>${step}</span></div>`).join('')}
            </div>
        </div>`;
    } catch (e) { res.innerHTML = "❌ Lỗi: " + e.message; }
});