const API_KEY = "AIzaSyAqimS9-LQb12vAIZ6GCWu3RDfAvr3ShS0"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    res.style.color = "blue";
    
    try {
        // Sử dụng Proxy để vượt rào CORS và dùng model gemini-1.0-pro (ổn định cho tài khoản Free)
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`;
        
        const response = await fetch(proxyUrl + targetUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest" 
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: `Phân tích cảm xúc của câu sau, trả về 1 trong 3 từ: Tích cực, Tiêu cực, Trung lập. Câu: "${text}"` }] 
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultText = data.candidates[0].content.parts[0].text.trim();
            res.innerHTML = "Kết quả: " + resultText;
            res.style.color = resultText.includes("Tích cực") ? "green" : (resultText.includes("Tiêu cực") ? "red" : "orange");
        } else {
            console.error("API Error:", data);
            res.innerHTML = "Lỗi từ phía AI: " + (data.error?.message || "Không xác định");
            res.style.color = "red";
        }
    } catch (error) {
        console.error("Lỗi:", error);
        res.innerHTML = "Lỗi kết nối proxy!";
        res.style.color = "red";
    }
});