const express = require('express');
const fetch = require('node-fetch-commonjs'); // If using node < 18 or specific fetch requirement
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static UI files (index.html, script.js, style.css) from the same directory
app.use(express.static(path.join(__dirname)));

app.post('/api/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Thiếu nội dung phản hồi" });
    }

    try {
        // Groq API call logic migrated from api/analyze.js
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" }, // Ensures valid JSON returned
                messages: [{ 
                    role: "system", 
                    content: `Bạn là chuyên gia phân tích CX. Hãy phân tích phản hồi khách hàng và chấm điểm thực tế từ 0-10. 
                    Trả về JSON duy nhất với cấu trúc: 
                    {
                        "score_card": {"Sản phẩm": 0, "Dịch vụ": 0, "Giá trị thực tế": 0, "Giao nhận": 0, "CSKH": 0},
                        "insights": {"tu_khoa": [], "chan_dung": "", "dong_co_an": "", "ty_le_trung_thanh": ""},
                        "analysis": {"chuyen_sau": "...", "giai_phap": ["...", "...", "..."], "luu_y": "..."}
                    }. 
                    Yêu cầu: "chuyen_sau" phải là góc nhìn chuyên gia phân tích CX. "giai_phap" phải là 3 hành động thực tế. Tuyệt đối không thêm text bên ngoài JSON.`
                }, { role: "user", content: text }]
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
           console.error("Groq API Error:", data);
           return res.status(response.status).json({ error: "Lỗi từ API LLM", details: data });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Server Error parsing request:", error);
        res.status(500).json({ error: "Lỗi kết nối API trên Server" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server khởi chạy tại http://localhost:${PORT}`);
});
