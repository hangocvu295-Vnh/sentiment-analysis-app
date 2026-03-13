const GROQ_API_KEY = "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";

const btn = document.getElementById("analyzeBtn");
const res = document.getElementById("result");
const input = document.getElementById("userInput");

// Hàm làm sạch chuỗi JSON cực mạnh
function cleanJSON(str) {
    // 1. Lấy phần nội dung giữa { và }
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    let json = str.substring(start, end + 1);
    // 2. Loại bỏ ký tự xuống dòng và tab để JSON.parse không báo lỗi
    return json.replace(/[\n\r\t]/g, " ");
}

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Chỉ trả về JSON thuần. Format: {\"hai_long\": 5, \"chat_luong\": 5, \"dich_vu\": 5, \"gia_ca\": 5, \"van_de\": \"ngan gon\", \"gioi_thieu\": 5, \"ket_luan\": \"ngan gon\"}" },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        
        const cleanStr = cleanJSON(rawContent);
        if (!cleanStr) throw new Error("Không tìm thấy JSON hợp lệ");
        
        const obj = JSON.parse(cleanStr); // Đây là bước quan trọng nhất
        
        res.innerHTML = `
            <div class="result-card">
                <p><strong>Hài lòng:</strong> ${obj.hai_long}/10 | <strong>Chất lượng:</strong> ${obj.chat_luong}/10</p>
                <p><strong>Dịch vụ:</strong> ${obj.dich_vu}/10 | <strong>Giá:</strong> ${obj.gia_ca}/10</p>
                <p><strong>Giới thiệu:</strong> ${obj.gioi_thieu}/10</p>
                <hr>
                <p><strong>Vấn đề:</strong> ${obj.van_de}</p>
                <p><strong>Kết luận:</strong> ${obj.ket_luan}</p>
            </div>
        `;
    } catch (e) {
        console.error("Lỗi chi tiết:", e);
        res.innerHTML = "Lỗi xử lý. Vui lòng thử lại!";
    }
});