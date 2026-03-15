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
                    content: `Bạn là chuyên gia phân tích trải nghiệm khách hàng (CX Analyst). Hãy phân tích phản hồi khách hàng:
                    1. "score_card": Chấm điểm thực tế 0-10 cho các tiêu chí.
                    2. "insights": Trích xuất thông tin khách hàng.
                    3. "analysis": Phần 3 gồm "chuyen_sau" (Phân tích nguyên nhân gốc rễ và tác động tâm lý), "giai_phap" (3 hành động cụ thể), "luu_y" (Lời khuyên chiến lược).
                    Trả về JSON chuẩn. Tuyệt đối không thêm text bên ngoài.`
                }, { role: "user", content: text }]
            })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Lỗi kết nối" });
    }
}