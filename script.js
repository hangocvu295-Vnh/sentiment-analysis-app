document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    const res = document.getElementById("result");
    
    if (!text) return alert("Vui lòng nhập phản hồi!");
    res.innerHTML = "🔍 Đang phân tích, vui lòng chờ...";

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        const content = data.choices[0].message.content;
        const obj = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <div class="result-card">
                <p><strong>⚠️ Nỗi đau gốc:</strong> ${obj.noi_dau || "..."}</p>
                <p><strong>🧠 Tâm lý:</strong> ${obj.tam_ly || "..."}</p>
                <p><strong>💡 Giá trị cải tiến:</strong> ${obj.gia_tri_cai_tien || "..."}</p>
                <p><strong>💬 Phản hồi gợi ý:</strong> ${obj.phan_hoi_goi_y || "..."}</p>
            </div>`;
    } catch (e) {
        res.innerHTML = "❌ Lỗi hệ thống: " + e.message;
    }
});