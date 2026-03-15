export default async function handler(req, res) {
    const { text } = req.body;
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ 
                    role: "system", 
                    content: `Bạn là chuyên gia phân tích CX. Hãy phân tích phản hồi của khách hàng và chấm điểm thực tế từ 0 đến 10 cho các tiêu chí: "Sản phẩm", "Dịch vụ", "Giá trị thực tế", "Giao nhận", "CSKH". Trả về JSON chuẩn duy nhất: {"score_card": {"Sản phẩm": number, "Dịch vụ": number, "Giá trị thực tế": number, "Giao nhận": number, "CSKH": number}, "insights": {"tu_khoa": [], "chan_dung": "", "dong_co_an": "", "ty_le_trung_thanh": ""}, "analysis": {"chuyen_sau": "", "giai_phap": [], "luu_y": ""}}. Không thêm ký tự bên ngoài JSON.`
                }, { role: "user", content: text }]
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Lỗi kết nối API" });
    }
}