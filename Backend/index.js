
const express = require('express');
const connectDB = require('./config/Database');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Use Dependancies

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true                 // allow cookies to be sent
}));



// Routes Import
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const contactRoutes = require('./routes//contact.routes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/help', contactRoutes);




// Routes configuration
app.get('/', (req, res) => {
  res.send('API is running...');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
