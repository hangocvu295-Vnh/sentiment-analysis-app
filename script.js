document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = document.getElementById("result");
    res.innerHTML = "Đang phân tích...";

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        // Kiểm tra xem AI có trả về JSON đúng không
        const obj = typeof data.choices[0].message.content === 'string' 
            ? JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0])
            : data.choices[0].message.content;

        function renderBar(s) {
            let color = s <= 3 ? '#ef4444' : (s < 7 ? '#f59e0b' : '#10b981');
            return `<div style="background:#0f172a;height:8px;border-radius:4px;margin:5px 0;"><div style="width:${s*10}%;height:100%;background:${color};border-radius:4px;"></div></div>`;
        }

        res.innerHTML = `
            <div class="card"><h3>Phần 1: Chỉ số CX</h3>
                ${Object.entries(obj.score_card).map(([k,v]) => `<div>${k}: ${v}/10 ${renderBar(v)}</div>`).join('')}
            </div>
            <div class="card"><h3>Phần 2: Insight</h3>
                <p><strong>Từ khóa:</strong> ${obj.insights.tu_khoa.join(', ')}</p>
                <p><strong>Chân dung:</strong> ${obj.insights.chan_dung}</p>
                <p><strong>Động cơ ẩn:</strong> ${obj.insights.dong_co_an}</p>
                <p><strong>Tỷ lệ trung thành:</strong> ${obj.insights.ty_le_trung_thanh}</p>
            </div>
            <div class="card" style="grid-column: span 2;"><h3>Phần 3: Phân tích sâu & Giải pháp</h3>
                <p>${obj.analysis.chuyen_sau}</p>
                <ul>${obj.analysis.giai_phap.map(g => `<li>${g}</li>`).join('')}</ul>
                <p><strong>Lưu ý:</strong> ${obj.analysis.luu_y}</p>
            </div>`;
    } catch (e) {
        res.innerHTML = "Lỗi hiển thị. Kiểm tra lại dữ liệu AI trả về trong Console (F12).";
    }
});