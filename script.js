function updateUI() {
    document.getElementById("pNameDisplay").innerText = document.getElementById("pName").value || "Tên sản phẩm";
}

function loadImg() {
    const code = document.getElementById("pCode").value;
    document.getElementById("productImg").src = `images/${code}.jpg`;
    document.getElementById("pCodeDisplay").innerText = "Mã: " + code;
}

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = document.getElementById("result");
    res.innerHTML = "🔍 Đang phân tích dữ liệu...";

    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await response.json();
    const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

    res.innerHTML = `
        <div class="card"><h3><i class="fas fa-smile"></i> Điểm cảm xúc</h3><p>${obj.sentiment_score}/10</p></div>
        <div class="card"><h3><i class="fas fa-search"></i> Nguyên nhân gốc</h3><p>${obj.root_cause}</p></div>
        <div class="card"><h3><i class="fas fa-user-times"></i> Nguy cơ rời bỏ</h3><p>${obj.churn_risk}</p></div>
        <div class="card"><h3><i class="fas fa-lightbulb"></i> Giải pháp</h3><p>${obj.action_plan}</p></div>
    `;
});