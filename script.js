document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userInput").value;
    const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await res.json();
    // Hiển thị kết quả...
});