const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// 1. Automatically create an "uploads" folder for videos if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// 2. Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// 3. Initialize Gemini AI
const GEMINI_API_KEY = "AIzaSyDnHBRZrT0KS_Li_OsENb02pKq1Y4jxb7Y";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();
app.use(cors());

// IMPORTANT: Increase the limit to 50mb so the server can accept video files!
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve the uploads folder publicly so the recruiter dashboard can play the videos
app.use('/uploads', express.static(uploadsDir));

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend is running!' });
});

// AI Generation Route
app.post('/api/generate-question', async (req, res) => {
    try {
        const { role, difficulty, askedTopics } = req.body;
        const prompt = `You are an expert technical interviewer. Generate ONE multiple-choice question for a ${role} at a ${difficulty} difficulty level.
        The candidate has already been asked questions about these topics: ${askedTopics.join(', ')}. Do NOT repeat these topics. Ensure the question is unique.
        You MUST respond ONLY with a raw JSON object in this exact format. Do NOT include markdown blocks or backticks:
        { "q": "The question text here", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "a": "The exact text of the correct option" }`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
        const result = await model.generateContent(prompt);
        let aiText = result.response.text();
        aiText = aiText.replace(/```json/gi, '').replace(/```/gi, '').trim();

        res.status(200).json(JSON.parse(aiText));
    } catch (error) {
        console.error("🚨 AI Error:", error.message);
        res.status(500).json({ q: "AI Service is busy. What is 2 + 2?", options: ["3", "4", "5", "6"], a: "4" });
    }
});

// NEW: Submit Route that saves Video
app.post('/api/submit', async (req, res) => {
    try {
        const { name, role, answers, warnings, actualScore, videoBase64 } = req.body;
        let videoUrl = null;

        // If a video was recorded, save it to the local uploads folder
        if (videoBase64) {
            const base64Data = videoBase64.replace(/^data:video\/webm;base64,/, "");
            const fileName = `video_${Date.now()}.webm`;
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, base64Data, 'base64');
            videoUrl = `http://localhost:5000/uploads/${fileName}`; // The URL the recruiter will use to watch it
        }

        const candidateRef = await db.collection('candidates').add({
            name: name || "Anonymous",
            role: role || "Unknown",
            answers: answers || "",
            warnings: warnings || 0,
            score: actualScore || 0,
            videoUrl: videoUrl, // Save the video link to the database!
            submittedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Assessment saved for ${name}`);
        res.status(200).json({ success: true, id: candidateRef.id });
    } catch (error) {
        console.error("Error saving assessment:", error);
        res.status(500).json({ error: "Failed to save assessment" });
    }
});

// Route to fetch candidates
app.get('/api/candidates', async (req, res) => {
    try {
        const snapshot = await db.collection('candidates').orderBy('submittedAt', 'desc').get();
        const candidates = [];
        snapshot.forEach(doc => candidates.push({ id: doc.id, ...doc.data() }));
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));