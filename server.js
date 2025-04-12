const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const OpenAI = require('openai');
require('dotenv').config();

const User = require('./models/User');
const Idea = require('./models/Idea');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// JWT secret
const SECRET = process.env.JWT_SECRET || 'ideaforge_secret';

// OpenAI initialization
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// JWT middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

app.post('/register', async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const existingUser = await User.findOne({ nickname });
        if (existingUser) return res.status(409).json({ message: 'Nickname already taken' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nickname, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const user = await User.findOne({ nickname });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, nickname: user.nickname }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
});

app.post('/ideas', authenticateJWT, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newIdea = new Idea({
            title,
            description,
            nickname: req.user.nickname,
            createdBy: req.user.id
        });
        await newIdea.save();
        await User.findByIdAndUpdate(req.user.id, { $push: { submittedIdeas: newIdea._id } });
        res.status(201).json({ message: 'Idea submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting idea', error: error.message });
    }
});

app.get('/ideas', async (req, res) => {
    try {
        const ideas = await Idea.find().populate('createdBy', 'nickname');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ideas', error: error.message });
    }
});


app.put('/ideas/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const idea = await Idea.findById(id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        if (!idea.createdBy.equals(req.user.id)) return res.status(403).json({ message: 'Not authorized to edit this idea' });
        idea.title = title;
        idea.description = description;
        await idea.save();
        res.json({ message: 'Idea updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating idea', error: error.message });
    }
});

app.delete('/ideas/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const idea = await Idea.findById(id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        if (!idea.createdBy.equals(req.user.id)) return res.status(403).json({ message: 'Not authorized to delete this idea' });
        await Idea.findByIdAndDelete(id);
        await User.findByIdAndUpdate(req.user.id, { $pull: { submittedIdeas: id } });
        res.json({ message: 'Idea deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting idea', error: error.message });
    }
});

app.post('/endorse/:id', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const idea = await Idea.findById(id);
        if (!idea) return res.status(404).json({ message: 'Idea not found' });
        if (idea.endorsements.some(e => e.userId.equals(userId))) {
            return res.status(400).json({ message: 'Already endorsed' });
        }
        idea.endorsements.push({ userId });
        await idea.save();
        res.json({ message: 'Idea endorsed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error endorsing idea', error: error.message });
    }
});

app.get('/messages/:room', authenticateJWT, async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .populate('sender', 'nickname')
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

app.post('/chatbot', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "No message provided." });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }]
        });

        const botReply = completion.choices[0].message.content;
        res.json({ reply: botReply });
    } catch (err) {
        console.error('OpenAI Error:', err.message);
        res.status(500).json({ reply: "AI is currently unavailable. Try again later." });
    }
});

// Socket.IO logic
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join_room', async (room) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room ${room}`);
        try {
            const messages = await Message.find({ room }).populate('sender', 'nickname').sort({ timestamp: 1 });
            socket.emit('chat_history', messages);
        } catch (error) {
            console.error('Chat history error:', error);
        }
    });

    socket.on('send_message', async (data) => {
        const { room, sender, message } = data;
        try {
            const newMessage = new Message({ room, sender, message });
            await newMessage.save();
            io.to(room).emit('receive_message', {
                sender,
                message,
                timestamp: newMessage.timestamp
            });
        } catch (error) {
            console.error('Message save error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
