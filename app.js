// 1. Import the installed express framework
import express from 'express';

// 2. Initialize the application instance
const app = express();
const PORT = 3000;

// 3. Create a basic route for the homepage
app.get('/', (req, res) => {
    res.send('Hello from my DevOps Capstone!');
});

// 4. Bind the application to a network port
app.listen(PORT, () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
});