export default async function handler(req, res) {
    const { text } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "system", content: "Bạn là chuyên gia phân tích CX. Trả về JSON: {\"sentiment_score\": \"1-10\", \"root_cause\": \"...\", \"churn_risk\": \"...\", \"action_plan\": \"...\"}" }, { role: "user", content: text }]
        })
    });
    const data = await response.json();
    res.status(200).json(data);
}