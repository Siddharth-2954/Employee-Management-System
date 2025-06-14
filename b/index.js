const express = require("express");
const cors = require("cors");  // Import cors
const app = express();

// Load environment variables first
require("dotenv").config();

// Verify required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    process.exit(1);
}

// Connect to database
require("./config/database").connect();

app.use(express.json());

// Update CORS configuration
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"], // Frontend ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Allow credentials
};

// Enable CORS for your frontend origin
app.use(cors(corsOptions));

// Import routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// Start server
const PORT = process.env.PORT || 5000; // Changed default port to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
