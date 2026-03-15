const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    if (!text) return alert("Vui lòng nhập bình luận!");
    
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích dữ liệu...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là chuyên gia phân tích CX. Phân tích feedback. 
                    Trả về JSON PHẲNG duy nhất, KHÔNG ĐƯỢC THAY ĐỔI TÊN KEY: 
                    "hai_long", "san_pham", "trai_nghiem", "ho_tro", "gia_tri", "quay_lai" (số 0-10);
                    "dong_co_tam_ly", "nguong_that_vong", "ngan_han", "dai_han", "bai_hoc", "tu_khoa_nong" (mảng).` 
                }, { role: "user", content: text }],
                temperature: 0.2
            })
        });
        
        const data = await response.json();
        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        // Hàm kiểm tra an toàn dữ liệu để không hiển thị undefined
        const getVal = (v) => (v !== undefined ? v : 0);
        const getStr = (s) => (s || "Chưa có thông tin");

        res.innerHTML = `
            <div class="metric-grid">
                ${card("Hài lòng", getVal(obj.hai_long))} 
                ${card("Sản phẩm", getVal(obj.san_pham))} 
                ${card("Trải nghiệm", getVal(obj.trai_nghiem))}
                ${card("Hỗ trợ", getVal(obj.ho_tro))} 
                ${card("Giá trị", getVal(obj.gia_tri))} 
                ${card("Quay lại", getVal(obj.quay_lai))}
            </div>
            <div class="insight-box">
                <p><strong>🎯 Động cơ tâm lý:</strong> ${getStr(obj.dong_co_tam_ly)}</p>
                <p><strong>⚠️ Ngưỡng thất vọng:</strong> ${getStr(obj.nguong_that_vong)}</p>
                <p><strong>🔥 Từ khóa nóng:</strong> ${Array.isArray(obj.tu_khoa_nong) ? obj.tu_khoa_nong.map(t => `<span class="tag">${t}</span>`).join('') : 'N/A'}</p>
                <hr>
                <p><strong>🚀 Ngắn hạn:</strong> ${getStr(obj.ngan_han)}</p>
                <p><strong>📅 Dài hạn:</strong> ${getStr(obj.dai_han)}</p>
                <p><strong>💡 Bài học:</strong> <em>${getStr(obj.bai_hoc)}</em></p>
            </div>
        `;
    } catch (e) { 
        res.innerHTML = "❌ Lỗi: Dữ liệu trả về không đúng định dạng. Hãy thử lại!"; 
        console.error(e);
    }
});

function card(l, v) { 
    return `<div class="card">${l}<br><b>${v}/10</b></div>`; 
}