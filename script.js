const GROQ_API_KEY = "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";

// Xem trước ảnh
document.getElementById("imageInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const preview = document.getElementById("imagePreview");
            preview.src = reader.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    const pName = document.getElementById("pName").value || "Sản phẩm";
    const pCode = document.getElementById("pCode").value || "N/A";
    const stars = document.getElementById("pStars").value;
    const pImg = document.getElementById("imagePreview").src;

    if (!text) return alert("Vui lòng dán bình luận của khách!");
    
    const res = document.getElementById("result");
    res.innerHTML = "<p style='text-align:center;'>⏳ Hệ thống đang phân tích chuyên sâu...</p>";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là CX Analyst chuyên sâu. Hãy phân tích phản hồi về sản phẩm [${pName}] (Mã: ${pCode}) đánh giá [${stars} sao]. 
                    Trả về JSON PHẲNG với các key: "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai", "tin_tuong", "buc_boi", "hao_hung" (số 0-10), "dong_co", "nguong_that_vong", "insight_chien_luoc".` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });

        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <div class="res-header">
                ${pImg ? `<img src="${pImg}">` : ''}
                <div>
                    <h2 style="margin:0">${pName}</h2>
                    <small>Mã: ${pCode}</small>
                    <div class="stars">${"★".repeat(stars)}${"☆".repeat(5-stars)}</div>
                </div>
            </div>

            <div class="metric-grid">
                ${card("Hài lòng", obj.hai_long)} ${card("Sản phẩm", obj.san_pham)} ${card("Trải nghiệm", obj.trai_nghiem)}
                ${card("Hỗ trợ", obj.ho_tro)} ${card("Giá trị", obj.gia_tri)} ${card("Quay lại", obj.quay_lai)}
                ${card("Tin tưởng", obj.tin_tuong)} ${card("Bực bội", obj.buc_boi)} ${card("Hào hứng", obj.hao_hung)}
            </div>

            <div class="insight-box">
                <p><strong>🎯 Động cơ tâm lý:</strong> ${obj.dong_co || 'N/A'}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${obj.nguong_that_vong || 'N/A'}</p>
                <p><strong>💡 Chiến lược chuyên gia:</strong> ${obj.insight_chien_luoc || 'N/A'}</p>
            </div>
        `;
    } catch (e) {
        res.innerHTML = "<p style='color:red'>❌ Lỗi: Không thể phân tích dữ liệu. Vui lòng thử lại!</p>";
    }
});

function card(label, value) {
    const v = value !== undefined ? value : 0;
    return `<div class="card"><span>${label}</span><b>${v}/10</b></div>`;
}