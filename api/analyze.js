export default async function handler(req, res) {
    const { text } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ 
                role: "system", 
                content: `Phân tích CX và trả về JSON chuẩn: {"score_card": {"Sản phẩm": 0, "Dịch vụ": 0, "Giá trị thực tế": 0, "Giao nhận": 0, "CSKH": 0}, "insights": {"tu_khoa": ["..."], "chan_dung": "...", "dong_co_an": "...", "ty_le_trung_thanh": "..."}, "analysis": {"chuyen_sau": "...", "giai_phap": ["..."], "luu_y": "..."}}. Tuyệt đối không thêm text bên ngoài.`
            }, { role: "user", content: text }]
        })
    });
    const data = await response.json();
    res.status(200).json(data);
}