const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Ensure this is imported
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kumaranukaran21:nPIlx6H6sbdeo5Tp@cluster0.fkzuv.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Todo Schema & Model
const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  userId: mongoose.Schema.Types.ObjectId,
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;
    next();
  });
};

// Routes for Users
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send('Username already taken');

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('Invalid credentials');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');
  
  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

// Routes for Todos (Protected by authentication)
app.get('/todos', authenticateToken, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

app.post('/todos', authenticateToken, async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({
    text,
    completed: false,
    userId: req.userId,
  });
  await todo.save();
  res.status(201).json(todo);
});

app.put('/todos/:id', authenticateToken, async (req, res) => {
  const { text, completed } = req.body;
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId }, 
    { text, completed }, 
    { new: true }
  );
  if (!todo) return res.sendStatus(404);
  res.json(todo);
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.sendStatus(404);
  res.sendStatus(204);
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
