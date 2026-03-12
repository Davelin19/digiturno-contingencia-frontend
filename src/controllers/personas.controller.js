import { pool } from "../db.js";

export const obtenerPersonas = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM personas");
  res.json(rows);
};

export const crearPersona = async (req, res) => {
  const { cedula, nombre, destino } = req.body;

  await pool.query(
    "INSERT INTO personas (cedula, nombre, destino) VALUES (?, ?, ?)",
    [cedula, nombre, destino]
  );

  res.status(201).json({ message: "Persona creada" });
};

export const llamarPersona = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE personas SET estado='LLAMADO' WHERE id=?",
    [id]
  );

  res.json({ message: "Persona llamada" });
};

export const atenderPersona = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE personas SET estado='ATENDIDO' WHERE id=?",
    [id]
  );

  res.json({ message: "Persona atendida" });
};

export const cancelarPersona = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE personas SET estado='CANCELADO' WHERE id=?",
    [id]
  );

  res.json({ message: "Persona cancelada" });
};
