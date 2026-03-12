const express = require("express");
const router = express.Router();
const db = require("../db");

// 🔹 GET todas las personas
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM personas");
  res.json(rows);
});

// 🔹 POST crear persona
router.post("/", async (req, res) => {
  const { cedula, nombre, destino, estado } = req.body;

  await db.query(
    "INSERT INTO personas (cedula, nombre, destino, estado) VALUES (?, ?, ?, ?)",
    [cedula, nombre, destino, estado]
  );

  res.status(201).json({ message: "Persona creada" });
});

// 🔹 PUT actualizar persona
router.put("/:cedula", async (req, res) => {
  const { cedula } = req.params;
  const { nombre, destino, estado } = req.body;

  await db.query(
    "UPDATE personas SET nombre=?, destino=?, estado=? WHERE cedula=?",
    [nombre, destino, estado, cedula]
  );

  res.json({ message: "Persona actualizada" });
});

// 🔹 DELETE eliminar persona
router.delete("/:cedula", async (req, res) => {
  const { cedula } = req.params;

  await db.query("DELETE FROM personas WHERE cedula=?", [cedula]);

  res.json({ message: "Persona eliminada" });
});

module.exports = router;
