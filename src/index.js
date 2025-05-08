const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./route/authRoute");
const apiKeyRoutes = require("./route/apiKeyRoutes");
const countriesRoute = require("./route/countriesRoute");
const userRoute = require("./route/userRoute");
const cookieParser = require("cookie-parser");
const {info} = require("./util/loggerUtil");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const YAML = require("yamljs");

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));


dotenv.config();
const app = express();
const PORT = process.env.PORT ;


// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:3000",  // Allow frontend at localhost:3000
    credentials: true,                // Allow cookies (JWT and CSRF token)
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
    info(`[${req.method}] [Request] - ${req.originalUrl}`);
    next();
});

// Use Auth Routes
app.use("/auth", authRoutes);
app.use("/keys", apiKeyRoutes);
app.use("/api/countries", countriesRoute);
app.use("/users", userRoute)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/", (req, res) => {
    res.send("Secure API Middleware is running ");
});


//Swagger(app);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});


