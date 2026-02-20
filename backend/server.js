const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin using your secret key
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test route to verify it's working
app.get('/api/health', (req, res) => {
    res.json({ status: 'TEAM-RSAA Backend is securely connected to Firebase!' });
});

// Route to receive the assessment and save to Firebase
app.post('/api/submit', async (req, res) => {
    try {
        const { name, role, answers, warnings } = req.body;

        // 1. Simulate an AI Score calculation (Random number between 60 and 100)
        const generatedScore = Math.floor(Math.random() * 41) + 60;

        // 2. Save the candidate data to Firebase Firestore
        const candidateRef = await db.collection('candidates').add({
            name: name || "Anonymous Candidate",
            role: role || "Unknown Role",
            answers: answers || "",
            warnings: warnings || 0,
            score: generatedScore,
            submittedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`✅ Assessment saved for ${name} with score ${generatedScore}`);

        // 3. Send the score back to the frontend alert
        res.status(200).json({ success: true, generatedScore: generatedScore, id: candidateRef.id });

    } catch (error) {
        console.error("Error saving assessment:", error);
        res.status(500).json({ error: "Failed to save assessment to database" });
    }
});

// NEW: Route to fetch all candidates for the Recruiter Dashboard
app.get('/api/candidates', async (req, res) => {
    try {
        const snapshot = await db.collection('candidates').orderBy('submittedAt', 'desc').get();
        const candidates = [];

        snapshot.forEach(doc => {
            candidates.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(candidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ error: "Failed to fetch candidates" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Backend connected to Firestore and running on port ${PORT}`);
});