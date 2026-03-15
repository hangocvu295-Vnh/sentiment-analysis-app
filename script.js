document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập bình luận!");
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích chiến lược...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: `Bạn là CX Strategist. Trả về JSON PHẲNG. "tu_khoa_nong" phải là 1 mảng các từ. "ngan_han", "dai_han", "bai_hoc" phải là chuỗi văn bản.` }, 
                { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        // XỬ LÝ DỮ LIỆU CẨN THẬN ĐỂ KHÔNG BỊ LỖI [object Object]
        const tagsHtml = Array.isArray(obj.tu_khoa_nong) ? obj.tu_khoa_nong.map(t => `<span class="tag">${t}</span>`).join(' ') : obj.tu_khoa_nong;
        const nganHan = Array.isArray(obj.ngan_han) ? obj.ngan_han.join('. ') : obj.ngan_han;
        const daiHan = Array.isArray(obj.dai_han) ? obj.dai_han.join('. ') : obj.dai_han;

        res.innerHTML = `
            <div class="metric-grid">
                ${card("Hài lòng", obj.hai_long)} ${card("Sản phẩm", obj.san_pham)} ${card("Trải nghiệm", obj.trai_nghiem)}
                ${card("Hỗ trợ", obj.ho_tro)} ${card("Giá trị", obj.gia_tri)} ${card("Quay lại", obj.quay_lai)}
            </div>
            
            <div class="insight-box">
                <p><strong>🎯 Động cơ:</strong> ${obj.dong_co_tam_ly}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong}</p>
                <p><strong>🔥 Từ khóa nóng:</strong> ${tagsHtml}</p>
                <hr style="margin:15px 0;">
                <p><strong>🚀 Ngắn hạn:</strong> ${nganHan}</p>
                <p><strong>📅 Dài hạn:</strong> ${daiHan}</p>
                <p><strong>💡 Bài học:</strong> <em>${obj.bai_hoc}</em></p>
            </div>
        `;
    } catch (e) { 
        res.innerHTML = "❌ Lỗi: Dữ liệu bị sai cấu trúc. Nhấn lại Phân tích!"; 
    }
});

function card(l, v) { return `<div class="card">${l}<br><b>${v}/10</b></div>`; }