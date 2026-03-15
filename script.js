document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = document.getElementById("result");
    if (!text) return alert("Vui lòng dán nội dung phản hồi!");
    res.innerHTML = "Đang phân tích...";

    try {
        // Đảm bảo fetch đúng đường dẫn API /api/analyze
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        
        // Kiểm tra dữ liệu trả về để tránh lỗi null
        if (!data.choices || !data.choices[0]) throw new Error("API không trả về dữ liệu");

        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        const colors = {
            "Sản phẩm": "#3b82f6", 
            "Dịch vụ": "#8b5cf6", 
            "Giá trị thực tế": "#f59e0b", 
            "Giao nhận": "#ec4899", 
            "CSKH": "#06b6d4"
        };

        // Ý nghĩa điểm theo ảnh bạn cung cấp
        function getMeaning(s) {
            if (s <= 2) return "Rất tiêu cực";
            if (s <= 4) return "Tiêu cực";
            if (s == 5) return "Trung lập";
            if (s <= 7) return "Khá tích cực";
            return "Rất tích cực";
        }

        // Render thanh điểm: Đã giữ nguyên logic, sửa hiển thị
        function renderBar(s, label) {
            let score = Math.max(0, Math.min(10, Number(s) || 0));

            return `
                <div style="margin-bottom: 25px;">
                    <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom: 10px;">
                        <span>${label}:</span> 
                        <span>${score}/10 (${getMeaning(score)})</span>
                    </div>

                    <div style="background:#0f172a; height:12px; border-radius:6px;">
                        <div style="
                            width:${score * 10}%;
                            height:100%;
                            background:${colors[label] || '#3b82f6'};
                            border-radius:6px;
                        "></div>
                    </div>
                </div>`;
        }

        res.innerHTML = `
            <div class="card">
                <h3>Phần 1: Chỉ số CX</h3>
                ${Object.entries(obj.score_card).map(([k,v]) => renderBar(v, k)).join('')}
            </div>

            <div class="card">
                <h3>Phần 2: Insight Khách hàng</h3>
                <p><strong>Từ khóa:</strong> ${obj.insights.tu_khoa.join(', ')}</p>
                <p><strong>Chân dung:</strong> ${obj.insights.chan_dung}</p>
                <p><strong>Động cơ ẩn:</strong> ${obj.insights.dong_co_an}</p>
                <p><strong>Tỷ lệ trung thành:</strong> ${obj.insights.ty_le_trung_thanh}</p>
            </div>

            <div class="card" style="grid-column: span 2;">
                <h3>Phần 3: Phân tích & Giải pháp</h3>
                <p>${obj.analysis.chuyen_sau}</p>
                <ul style="padding-left: 20px;">
                    ${obj.analysis.giai_phap.map(g => `<li>${g}</li>`).join('')}
                </ul>
                <p><i>Lưu ý: ${obj.analysis.luu_y}</i></p>
            </div>
        `;

    } catch (e) {
        console.error("Lỗi:", e);
        res.innerHTML = "Lỗi hiển thị dữ liệu. Vui lòng kiểm tra API.";
    }
});