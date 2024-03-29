import express from 'express';
import cors from 'cors';

import { createInitialData } from "./src/config/db/initialData.js";
import checkToken from './src/config/auth/checkToken.js';
import userRoutes from './src/modules/user/routes/UserRoutes.js'
import tracing from './src/config/tracing.js';

const app = express();
const env = process.env;
const PORT = env.PORT || 8080;
const CONTAINER_ENV = "container";

app.get('/api/status/', (req, res) => {
    return res.status(200).json({
        service: 'Auth-API',
        status: 'up',
        httpStatus: 200,
    })
});

app.use(express.json());
app.use(cors({credentials: true, origin: "http://localhost:5173"}));

starApplication();

function starApplication() {
    if (env.NODE_ENV !== CONTAINER_ENV) {
        createInitialData();
    }
}

app.get("/api/initial-data", (req, res) => {
    createInitialData();
    return res.json({ message: "Data created." });
});

app.use(tracing);
app.use(userRoutes);

app.listen(PORT, () => {
    console.info(`Server started successfully at port ${PORT}`)
})
