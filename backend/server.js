const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// Conexão com Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS
app.use(cors({
  origin: ["http://localhost:8081", "https://duzeapp-production.up.railway.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
}));

/* =========================
   USUÁRIOS
========================= */

// Cadastro de usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha, imagemPerfil } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    let imagemURL = null;
    if (imagemPerfil) {
      // Envia a imagem para o Supabase Storage
      const buffer = Buffer.from(imagemPerfil.split(",")[1], "base64"); // remove data:image/jpeg;base64,
      const fileName = `perfil-${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("usuarios")
        .upload(fileName, buffer, { contentType: "image/jpeg" });

      if (error) throw error;

      const { publicUrl } = supabase
        .storage
        .from("usuarios")
        .getPublicUrl(fileName);

      imagemURL = publicUrl;
    }

    // Salva usuário no banco (Supabase DB padrão)
    const { data: user, error: insertError } = await supabase
      .from("usuarios")
      .insert([{ nome, email, senha: senhaHash, imagemPerfil: imagemURL }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ success: true, usuario: user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !usuario) return res.status(400).json({ success: false, error: "Usuário não encontrado" });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ success: false, error: "Senha incorreta" });

    delete usuario.senha;
    res.json({ success: true, usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   PRODUTOS (opcional)
========================= */

app.get("/produtos", async (req, res) => {
  try {
    const { data: produtos, error } = await supabase.from("produtos").select("*").order("id");
    if (error) throw error;
    res.json({ success: true, produtos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =========================
   INICIAR SERVIDOR
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
