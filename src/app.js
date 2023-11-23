import express from "express";
import morgan from "morgan";
import cors from "cors"; // Importa el módulo cors

import usuarioRoutes from "./routes/usuario.routes.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Habilita CORS para todas las rutas de tu aplicación
app.use(cors());

// Rutas
app.use("/", indexRoutes);
app.use("/api", usuarioRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
