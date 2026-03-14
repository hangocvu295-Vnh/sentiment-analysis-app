const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích chuyên sâu 5 tầng...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là chuyên gia CX. Phân tích phản hồi khách hàng theo 5 tầng. Trả về JSON PHẲNG với các key: 
                    "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai", 
                    "chan_dung", "dong_co_an", "chi_so_trung_thanh", "hanh_dong_1", "hanh_dong_2", "hanh_dong_3". 
                    "dong_co_an" phải phân tích được nguyên nhân sâu xa (VD: muốn kiểm soát, muốn được tôn trọng...). "chan_dung" phải là insight hành vi. JSON duy nhất.` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <h3 style="border-bottom: 2px solid #4a90e2; padding-bottom: 10px;">📊 BÁO CÁO CHUYÊN GIA</h3>
            <div class="grid-2">
                ${createMetric("Hài lòng", obj.hai_long)}
                ${createMetric("Hỗ trợ", obj.ho_tro)}
                ${createMetric("Sản phẩm", obj.san_pham)}
                ${createMetric("Giá trị", obj.gia_tri)}
                ${createMetric("Trải nghiệm", obj.trai_nghiem)}
                ${createMetric("Quay lại", obj.quay_lai)}
            </div>
            <div class="psych-box">
                <h4>🧠 Phân tích tâm lý chuyên sâu:</h4>
                <p><strong>👥 Chân dung:</strong> ${obj.chan_dung}</p>
                <p><strong>🎯 Động cơ ẩn:</strong> ${obj.dong_co_an}</p>
                <p><strong>📈 Chỉ số trung thành:</strong> ${obj.chi_so_trung_thanh}/10</p>
            </div>
            <div class="action-steps">
                <h4>🚀 Hướng giải quyết chuyên gia:</h4>
                <div class="step">1. ${obj.hanh_dong_1}</div>
                <div class="step">2. ${obj.hanh_dong_2}</div>
                <div class="step">3. ${obj.hanh_dong_3}</div>
            </div>
        `;
    } catch (e) { res.innerHTML = "❌ Lỗi hệ thống: Vui lòng thử lại."; }
});

function createMetric(label, val) {
    return `<div class="metric">
        <div style="display:flex; justify-content:space-between"><span>${label}</span><strong>${val}/10</strong></div>
        <div class="bar"><div class="fill" style="width:${val*10}%"></div></div>
    </div>`;
}