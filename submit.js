require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

// Crear una instancia de Express
const app = express();

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido al backend!");
});

// Ruta para manejar el formulario
app.post("/submit", async (req, res) => {
  if (req.method === "POST") {
    const { firstName, email, type, comment } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "tomcesped7@gmail.com",
      subject: `Nuevo mensaje de ${firstName} (${type})`,
      text: `Nombre: ${firstName}\nEmail: ${email}\nTipo: ${type}\nMensaje: ${comment}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        type: "success",
        message: "Hey 👋🏼 I will contact you as soon as possible 📩",
      });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).json({
        type: "error",
        message: "Oops 😬, there was an error.",
      });
    }
  } else {
    res.status(405).json({
      type: "error",
      message: "Method Not Allowed",
    });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});