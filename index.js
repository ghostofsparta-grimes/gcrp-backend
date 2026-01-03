import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Gamedig from "gamedig";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("GCRP backend is running");
});

// SA-MP Server Status
app.get("/api/server/status", async (req, res) => {
  try {
    const state = await Gamedig.query({
      type: "samp",
      host: process.env.SAMP_IP,
      port: Number(process.env.SAMP_PORT)
    });

    res.json({
      online: true,
      players: state.players.length,
      maxPlayers: state.maxplayers,
      hostname: state.name,
      gamemode: state.raw.gamemode
    });
  } catch (error) {
    res.json({ online: false });
  }
});

// MySQL connection (READ ONLY)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Leaderboard API (Top Players)
app.get("/api/leaderboard", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT username, level, hours
       FROM users
       ORDER BY level DESC, hours DESC
       LIMIT 25`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
