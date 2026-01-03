import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { query } from "samp-query";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* --- Server Status (SA-MP Query) --- */
app.get("/api/server/status", async (req, res) => {
  query(
    {
      host: process.env.SAMP_IP,
      port: Number(process.env.SAMP_PORT),
      timeout: 1000
    },
    (error, response) => {
      if (error) {
        return res.json({ online: false });
      }

      res.json({
        online: true,
        players: response.online,
        maxPlayers: response.maxplayers,
        hostname: response.hostname,
        gamemode: response.gamemode
      });
    }
  );
});

/* --- Health check --- */
app.get("/", (req, res) => {
  res.send("GCRP backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
