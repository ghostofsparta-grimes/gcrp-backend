import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Gamedig from "gamedig";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
