const GROQ_API_KEY = "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";

document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const userInput = document.getElementById("userInput").value;
    const res = document.getElementById("result");

    if (!userInput.trim()) return alert("Nhập nội dung đi bạn!");

    res.innerHTML = "Đang phân tích...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: `Phân tích cảm xúc của câu này: "${userInput}". Chỉ trả lời Tích cực, Tiêu cực hoặc Trung lập.` }]
            })
        });

        if (!response.ok) {
            throw new Error(`Lỗi server: ${response.status}`);
        }

        const data = await response.json();
        res.innerHTML = "Kết quả: " + data.choices[0].message.content;
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        res.innerHTML = "Lỗi: " + error.message;
    }
});