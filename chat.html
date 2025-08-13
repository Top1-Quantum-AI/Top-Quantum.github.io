<!DOCTYPE html> 
 <html lang="ar" dir="rtl"> 
 <head> 
   <meta charset="UTF-8" /> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
   <title>مساعد النظام الكمومي</title> 
   <style> 
     body { 
       font-family: Tahoma, sans-serif; 
       background: #0f172a; 
       color: #fff; 
       margin: 0; 
       padding: 20px; 
     } 
     .chat-container { 
       max-width: 500px; 
       margin: auto; 
       background: #1e293b; 
       border-radius: 12px; 
       padding: 20px; 
     } 
     .message { 
       margin: 10px 0; 
     } 
     .user { 
       text-align: right; 
       color: #38bdf8; 
     } 
     .bot { 
       text-align: left; 
       color: #a3e635; 
     } 
     .input-container { 
       display: flex; 
       gap: 10px; 
       margin-top: 15px; 
     } 
     input { 
       flex: 1; 
       padding: 10px; 
       border-radius: 8px; 
       border: none; 
       font-size: 16px; 
     } 
     select { 
       padding: 10px; 
       border-radius: 8px; 
       border: none; 
       font-size: 14px; 
     } 
     button { 
       padding: 10px 15px; 
       background: #38bdf8; 
       color: #000; 
       border: none; 
       border-radius: 8px; 
       cursor: pointer; 
     } 
   </style> 
 </head> 
 <body> 
 
   <div class="chat-container"> 
     <div id="chat-box"></div> 
     <div class="input-container"> 
       <select id="mode"> 
         <option value="analytical">تحليلي</option> 
         <option value="creative">إبداعي</option> 
         <option value="friendly">ودّي</option> 
       </select> 
       <input id="user-input" type="text" placeholder="اكتب سؤالك..." /> 
       <button onclick="sendMessage()">إرسال</button> 
     </div> 
   </div> 
 
   <script> 
     const chatBox = document.getElementById("chat-box"); 
 
     function appendMessage(sender, text) { 
       const msgDiv = document.createElement("div"); 
       msgDiv.className = `message ${sender}`; 
       msgDiv.innerText = text; 
       chatBox.appendChild(msgDiv); 
       chatBox.scrollTop = chatBox.scrollHeight; 
     } 
 
     async function sendMessage() { 
       const input = document.getElementById("user-input"); 
       const mode = document.getElementById("mode").value; 
       const userText = input.value.trim(); 
       if (!userText) return; 
 
       appendMessage("user", userText); 
       input.value = ""; 
 
       try { 
         const res = await fetch("/api/ai", { 
           method: "POST", 
           headers: { "Content-Type": "application/json" }, 
           body: JSON.stringify({ 
             message: userText, 
             personality: mode 
           }) 
         }); 
 
         const data = await res.json(); 
         appendMessage("bot", data.response); 
       } catch (error) { 
         console.error(error); 
         appendMessage("bot", "حدث خطأ أثناء الاتصال بالمساعد."); 
       } 
     } 
   </script> 
 
 </body> 
 </html>