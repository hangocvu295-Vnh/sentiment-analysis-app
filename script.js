const GROQ_API_KEY = "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"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        // ĐƯỜNG DẪN MỚI NÀY LÀ CỦA GROQ, KHÔNG PHẢI CỦA GOOGLE
        const url = "https://api.groq.com/openai/v1/chat/completions";
        
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ 
                    role: "user", 
                    content: `Phân tích cảm xúc: "${text}". Chỉ trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập.` 
                }]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0].message) {
            res.innerHTML = "Kết quả: " + data.choices[0].message.content.trim();
        } else {
            console.error("Lỗi:", data);
            res.innerHTML = "Lỗi hệ thống, vui lòng thử lại!";
        }
    } catch (e) {
        res.innerHTML = "Lỗi kết nối!";
        console.error(e);
    }
});