export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { text } = req.body;
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
                content: "Bạn là chuyên gia CX. Trả về JSON: {'noi_dau': '', 'tam_ly': '', 'gia_tri_cai_tien': '', 'phan_hoi_goi_y': ''}" 
            }, { role: "user", content: text }]
        })
    });
    const data = await response.json();
    res.status(200).json(data);
}