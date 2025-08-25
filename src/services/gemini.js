const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

export async function getAIExplanation(questionData, userAnswer) {
  if (!API_KEY) return "EROARE: Cheia API pentru Gemini nu este configurată.";
  
  const prompt = `Ești un instructor militar expert. Explică unui candidat de ce a greșit la o întrebare. Întrebare: "${questionData.intrebare}". Variante: ${questionData.variante.join(', ')}. Răspuns greșit: "${userAnswer}". Răspuns corect: "${questionData.raspunsCorect}". Sarcina ta: 1. Explică scurt DE CE RĂSPUNSUL CANDIDATULUI E GREȘIT. 2. Explică scurt DE CE RĂSPUNSUL CORECT E BUN, referindu-te la sursa (${questionData.sursa}). Fii didactic, formal și încurajator. Nu folosi formatare markdown.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!response.ok) throw new Error('Eroare rețea/server AI');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Eroare getAIExplanation:", error);
    return "Nu s-a putut obține explicația.";
  }
}

export async function getAISummary(fullText) {
  if (!API_KEY) return "EROARE: Cheia API nu este configurată.";

  const prompt = `Ești un instructor militar de top. Sarcina ta este să creezi un REZUMAT CONSOLIDAT al celor mai importante informații din tematica de examen, pe baza textului integral al legilor și regulamentelor furnizate. Pentru fiecare act normativ, extrage 5-7 idei esențiale care au probabilitate mare să apară în teste. Folosește un limbaj direct și concis, ideal pentru memorare rapidă. Nu evalua promptul, ci execută sarcina. Începe direct cu rezumatul. Textul complet este:\n\n${fullText}`;

  try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
    if (!response.ok) throw new Error('Eroare rețea/server AI');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Eroare getAISummary:", error);
    return "Nu s-a putut genera rezumatul.";
  }
}

export async function getMentorResponse(chatHistory) {
  if (!API_KEY) return "EROARE: Cheia API nu este configurată.";

  const historyForPrompt = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  const fullContents = [
    { role: 'user', parts: [{ text: "Instrucțiune de sistem: Ești un tutore militar expert, pe nume Mentor Ana. Răspunde la întrebările candidatului despre legislația și logistica militară din România. Fii precis, formal și încurajator. Păstrează răspunsurile concise și la obiect."}] },
    { role: 'model', parts: [{ text: "Am înțeles. Sunt Mentor Ana, gata să vă asist în pregătire."}] },
    ...historyForPrompt
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: fullContents }),
    });
    if (!response.ok) throw new Error('Eroare rețea/server AI');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Eroare getMentorResponse:", error);
    return "A apărut o eroare de comunicare. Încercați din nou.";
  }
}