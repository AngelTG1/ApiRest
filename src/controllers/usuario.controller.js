import { pool } from "../db.js";

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Usuario not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasenia, rol } = req.body;

    if (!nombre || !apellido || !correo || !contrasenia || !rol) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [userResult] = await pool.query(
      "INSERT INTO usuarios (nombre, apellido, correo, contrasenia, rol) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, correo, contrasenia, rol]
    );

    const usuario_id = userResult.insertId;

    res.status(201).json({ id: usuario_id, nombre, apellido, correo, contrasenia, rol });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, contrasenia, rol } = req.body;

    const query =
      "UPDATE usuarios SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), correo = IFNULL(?, correo), contrasenia = IFNULL(?, contrasenia), rol = IFNULL(?, rol) WHERE id = ?";
    const values = [nombre, apellido, correo, contrasenia, rol, id];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario not found" });

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
