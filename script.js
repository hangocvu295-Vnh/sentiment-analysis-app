const GROQ_API_KEY = "YOUR_API_KEY";

const imageInput = document.getElementById("imageUpload");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        preview.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
    };
    reader.readAsDataURL(file);
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {

    const text = document.getElementById("userInput").value.trim();
    const productName = document.getElementById("productName").value;
    const productCode = document.getElementById("productCode").value;
    const rating = document.getElementById("rating").value;

    if (!text) return alert("Vui lòng nhập phản hồi!");

    const res = document.getElementById("result");

    res.innerHTML = "🔍 Đang phân tích...";

    try {

        const prompt = `
Sản phẩm: ${productName}
Mã: ${productCode}
Đánh giá sao: ${rating}

Phản hồi khách:
${text}
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Bạn là chuyên gia CX. Trả JSON với các key:
                        hai_long,san_pham,trai_nghiem,ho_tro,gia_tri,quay_lai,
                        tin_tuong,buc_boi,hao_hung (0-10),
                        dong_co,nguong_that_vong,insight`
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        const obj = JSON.parse(data.choices[0].message.content.match(/\{[\s\S]*\}/)[0]);

        res.innerHTML = `
        <h2>📦 ${productName}</h2>
        <p>Mã sản phẩm: ${productCode}</p>
        <p>⭐ Đánh giá khách: ${rating}/5</p>

        <h3>📊 Chỉ số</h3>

        <div class="metric-grid">
        ${card("Hài lòng", obj.hai_long)}
        ${card("Sản phẩm", obj.san_pham)}
        ${card("Trải nghiệm", obj.trai_nghiem)}
        ${card("Hỗ trợ", obj.ho_tro)}
        ${card("Giá trị", obj.gia_tri)}
        ${card("Quay lại", obj.quay_lai)}
        </div>

        <div class="insight-section">
        <p><b>Động cơ:</b> ${obj.dong_co}</p>
        <p><b>Ngưỡng thất vọng:</b> ${obj.nguong_that_vong}</p>
        <p><b>Insight:</b> ${obj.insight}</p>
        </div>
        `;

    } catch (e) {

        res.innerHTML = "❌ Lỗi phân tích";
    }

});

function card(l, v) {
    return `
    <div class="metric-card">
        <span class="metric-label">${l}</span>
        <span class="metric-value">${v || 0}/10</span>
    </div>
    `;
}