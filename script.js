const API_KEY = "AIzaSyAqimS9-LQb12vAIZ6GCWu3RDfAvr3ShS0"; 
const btn = document.getElementById("analyzeBtn");
const input = document.getElementById("userInput");
const res = document.getElementById("result");

btn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return alert("Vui lòng nhập nội dung!");

    res.innerHTML = "Đang phân tích...";
    
    try {
        // Sử dụng Proxy để vượt rào cản từ Google Cloud
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(proxyUrl + targetUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest" // Bắt buộc cho proxy
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Phân tích cảm xúc: "${text}". Trả lời 1 từ: Tích cực, Tiêu cực, hoặc Trung lập.` }] }]
            })
        });

        const data = await response.json();

        if (data.candidates) {
            res.innerHTML = "Kết quả: " + data.candidates[0].content.parts[0].text.trim();
        } else {
            res.innerHTML = "Lỗi phản hồi: " + JSON.stringify(data.error?.message);
        }
    } catch (e) {
        console.error(e);
        res.innerHTML = "Lỗi kết nối qua Proxy!";
    }
});