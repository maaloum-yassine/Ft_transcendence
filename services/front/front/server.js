// const express = require('express');
// const path = require('path');
// const app = express();

// // Serve static files from the 'public' folder
// app.use(express.static(path.join(__dirname, '')));

// // Serve 'index.html' for any other route to let the client-side router handle it
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '', 'index.html'));
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// npm run dev

const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the 'public' folder (ajuste le chemin si nécessaire)
app.use(express.static(path.join(__dirname, "")));

// Exemple : créer un chemin spécifique pour les images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
// Serve 'index.html' for any other route to let the client-side router handle it
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// css display flex
// css display grid
// css position absolute, and position relative
