const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi của khách hàng!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích chuyên sâu...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: `Bạn là chuyên gia CX. Trả về JSON PHẲNG với đúng 12 key: "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai", "tin_tuong", "buc_boi", "hao_hung" (số 0-10); "dong_co", "nguong_that_vong", "insight" (mô tả).` }, 
                { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <h3>📊 6 TIÊU CHÍ GỐC</h3>
            <div class="metric-grid">
                ${card("Hài lòng", obj.hai_long)} ${card("Sản phẩm", obj.san_pham)} ${card("Trải nghiệm", obj.trai_nghiem)}
                ${card("Hỗ trợ", obj.ho_tro)} ${card("Giá trị", obj.gia_tri)} ${card("Quay lại", obj.quay_lai)}
            </div>
            <h3>🧠 PHÂN TÍCH TÂM LÝ</h3>
            <div class="metric-grid">
                ${card("Tin tưởng", obj.tin_tuong)} ${card("Bực bội", obj.buc_boi)} ${card("Hào hứng", obj.hao_hung)}
            </div>
            <div class="insight-section">
                <div class="insight-title">💡 Insight & Tâm lý học hành vi</div>
                <p><strong>🎯 Động cơ:</strong> ${obj.dong_co}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong}</p>
                <p><strong>🧠 Phân tích sâu:</strong> ${obj.insight}</p>
            </div>
        `;
    } catch (e) { res.innerHTML = "❌ Lỗi: Hệ thống đang quá tải, thử lại nhé!"; }
});

function card(l, v) { return `<div class="metric-card"><span class="metric-label">${l}</span><span class="metric-value">${v || 0}/10</span></div>`; }