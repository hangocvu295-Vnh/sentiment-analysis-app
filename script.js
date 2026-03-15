document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value.trim();
    const apiKey = document.getElementById("apiKey").value.trim();
    const res = document.getElementById("result");

    if (!apiKey) return alert("Vui lòng nhập API Key!");
    if (!text) return alert("Vui lòng nhập phản hồi!");

    res.innerHTML = "🔄 Đang phân tích, vui lòng chờ...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${apiKey}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: "Bạn là chuyên gia CX. Phân tích phản hồi dưới dạng JSON thuần túy. Các trường: 'noi_dau', 'tam_ly', 'gia_tri_cai_tien', 'phan_hoi_goi_y'." 
                }, { role: "user", content: text }]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const content = data.choices[0].message.content;
        const obj = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
            <div class="result-card">
                <p><strong>⚠️ Nỗi đau gốc:</strong> ${obj.noi_dau || "..."}</p>
                <p><strong>🧠 Tâm lý:</strong> ${obj.tam_ly || "..."}</p>
                <p><strong>💡 Giá trị cải tiến:</strong> ${obj.gia_tri_cai_tien || "..."}</p>
                <div class="feedback-box"><strong>💬 Phản hồi:</strong> ${obj.phan_hoi_goi_y || "..."}</div>
            </div>`;
    } catch (e) {
        res.innerHTML = "❌ Lỗi: " + e.message;
    }
});