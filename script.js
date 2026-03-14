const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập phản hồi!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích chuyên sâu...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là Chuyên gia Tâm lý khách hàng. Phân tích và trả về DUY NHẤT 1 chuỗi JSON phẳng (không lồng nhau) với đúng các khóa sau: 
                    "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai", 
                    "tin_tuong", "buc_boi", "hao_hung", "dong_co", "nguong_that_vong", "insight". 
                    Giá trị số từ 0-10, văn bản ngắn gọn.` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        const cleanJson = rawContent.substring(rawContent.indexOf('{'), rawContent.lastIndexOf('}') + 1);
        const obj = JSON.parse(cleanJson);
        
        // --- XỬ LÝ DỮ LIỆU ĐỂ LOẠI BỎ UNDEFINED ---
        // Hàm lấy giá trị an toàn
        const val = (v) => (v !== undefined ? v : "N/A");
        
        res.innerHTML = `
            <div class="section-title">📊 6 Tiêu chí gốc</div>
            <div class="grid-3">
                ${statBox("Hài lòng", val(obj.hai_long))}
                ${statBox("Sản phẩm", val(obj.san_pham))}
                ${statBox("Trải nghiệm", val(obj.trai_nghiem))}
                ${statBox("Hỗ trợ", val(obj.ho_tro))}
                ${statBox("Giá trị", val(obj.gia_tri))}
                ${statBox("Quay lại", val(obj.quay_lai))}
            </div>
            
            <div class="section-title">🧠 Phân tích tâm lý</div>
            <div class="grid-3">
                ${statBox("Tin tưởng", val(obj.tin_tuong))}
                ${statBox("Bực bội", val(obj.buc_boi))}
                ${statBox("Hào hứng", val(obj.hao_hung))}
            </div>
            
            <div style="margin-top:15px; font-size:0.95em;">
                <p><strong>🎯 Động cơ:</strong> ${val(obj.dong_co)}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${val(obj.nguong_that_vong)}</p>
            </div>
            
            <div class="section-title">💡 Insight chuyên gia</div>
            <div class="insight-box">${val(obj.insight)}</div>
        `;
    } catch (e) { 
        res.innerHTML = "❌ Lỗi hệ thống: Dữ liệu AI trả về bị sai cấu trúc. Hãy thử lại!";
        console.error("Chi tiết lỗi:", e);
    }
});

function statBox(label, value) {
    return `<div class="stat-card"><strong>${label}</strong><span style="font-size:1.3em; display:block;">${value}/10</span></div>`;
}