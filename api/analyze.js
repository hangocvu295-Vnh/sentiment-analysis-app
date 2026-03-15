// File: api/analyze.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ chấp nhận POST' });

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
                messages: [{ role: "user", content: text }]
            })
        });
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}