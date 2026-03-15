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
    res.innerHTML = `
        <div class="card"><h3>Điểm cảm xúc</h3><p>${obj.sentiment_score}/10</p></div>
        <div class="card"><h3>Nguyên nhân gốc</h3><p>${obj.root_cause}</p></div>
        <div class="card"><h3>Nguy cơ rời bỏ</h3><p>${obj.churn_risk}</p></div>
        <div class="card"><h3>Giải pháp</h3><p>${obj.action_plan}</p></div>`;
});