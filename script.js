document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = document.getElementById("result");
    res.innerHTML = "Đang phân tích...";

    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await response.json();
    const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

    function renderBar(s) {
        let color = s <= 3 ? '#ef4444' : (s < 7 ? '#f59e0b' : '#10b981');
        return `<div style="background:#0f172a;height:8px;border-radius:4px;margin:5px 0;"><div style="width:${s*10}%;height:100%;background:${color};border-radius:4px;"></div></div>`;
    }

    res.innerHTML = `
        <div class="card"><h3>Phần 1: Chỉ số cảm xúc</h3>
            ${Object.entries(obj.score_card).map(([k,v]) => `<div>${k}: ${v}/10 ${renderBar(v)}</div>`).join('')}
        </div>
        <div class="card"><h3>Phần 2: Insight khách hàng</h3>
            <p>Từ khóa: ${obj.insights.tu_khoa.join(', ')}</p>
            <p>Chân dung: ${obj.insights.chan_dung}</p>
            <p>Động cơ ẩn: ${obj.insights.dong_co_an}</p>
            <p>Tỷ lệ trung thành: ${obj.insights.ty_le_trung_thanh}</p>
        </div>
        <div class="card full-width"><h3>Phần 3: Phân tích sâu & Giải pháp</h3>
            <p>${obj.analysis.chuyen_sau}</p>
            <ul>${obj.analysis.giai_phap.map(g => `<li>${g}</li>`).join('')}</ul>
            <p><i>Lưu ý: ${obj.analysis.luu_y}</i></p>
        </div>`;
});