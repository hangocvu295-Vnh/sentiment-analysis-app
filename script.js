const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang thực hiện phân tích chuyên sâu 5 tầng...";
    
    // Prompt tư duy chuyên gia
    const promptChuyenGia = `Bạn là chuyên gia phân tích dữ liệu trải nghiệm khách hàng (CX Analyst). Phân tích phản hồi theo 5 tầng sau:
    1. Tổng thể (0-10): hai_long, quay_lai, gioi_thieu
    2. Trải nghiệm (0-10): giao_dien, toc_do, quy_trinh_mua, thanh_toan
    3. Cảm xúc (0-10): tin_tuong, thoai_mai, buc_boi, hao_hung
    4. Tâm lý (mô tả ngắn): dong_co, noi_lo, ky_vong, nguong_that_vong
    5. Insight: 1 insight bất ngờ và 1 hành động ưu tiên.
    Trả về JSON PHẲNG, duy nhất.`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: promptChuyenGia }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        const cleanJson = rawContent.substring(rawContent.indexOf('{'), rawContent.lastIndexOf('}') + 1);
        const obj = JSON.parse(cleanJson);

        res.innerHTML = `
            <div class="section-title">1. Đánh giá tổng thể</div>
            <div class="grid-4">${renderStats({Hài_lòng: obj.hai_long, Quay_lại: obj.quay_lai, Giới_thiệu: obj.gioi_thieu})}</div>
            
            <div class="section-title">2. Chi tiết trải nghiệm</div>
            <div class="grid-4">${renderStats({Giao_diện: obj.giao_dien, Tốc_độ: obj.toc_do, Quy_trình: obj.quy_trinh_mua, Thanh_toán: obj.thanh_toan})}</div>
            
            <div class="section-title">3. Tầng cảm xúc</div>
            <div class="grid-4">${renderStats({Tin_tưởng: obj.tin_tuong, Thoải_mái: obj.thoai_mai, Bực_bội: obj.buc_boi, Hào_hứng: obj.hao_hung})}</div>
            
            <div class="section-title">4. Phân tích tâm lý chuyên sâu</div>
            <div class="insight-box">
                <p><strong>🎯 Động cơ:</strong> ${obj.dong_co}</p>
                <p><strong>🛡️ Nỗi lo:</strong> ${obj.noi_lo}</p>
                <p><strong>✨ Kỳ vọng:</strong> ${obj.ky_vong}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong}</p>
            </div>
            
            <div class="section-title">5. Insight bất ngờ từ chuyên gia</div>
            <div class="insight-box" style="background:#fff3cd; border-left-color:#ffc107;">${obj.insight}</div>
        `;
    } catch (e) { 
        res.innerHTML = "❌ Lỗi hệ thống: Dữ liệu phân tích bị gián đoạn. Thử lại nhé!";
        console.error(e);
    }
});

function renderStats(obj) {
    return Object.entries(obj).map(([key, val]) => 
        `<div class="stat-card"><strong>${key.replace(/_/g, ' ')}</strong><span style="font-size:1.2em; display:block;">${val}/10</span></div>`
    ).join('');
}