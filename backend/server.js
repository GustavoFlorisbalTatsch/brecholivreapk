const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conexao = require("./conexao");

const app = express();

// ==========================================
// CONFIGURAÇÕES
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// ROTA INICIAL
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "API do Brechó Livre funcionando!",
    rotas: {
      testeBanco: "/api/teste-banco",
      produtos: "/api/produtos"
    }
  });
});

// ==========================================
// TESTE DE CONEXÃO COM MYSQL
// ==========================================
app.get("/api/teste-banco", async (req, res) => {
  try {
    const [resultado] = await conexao.query(
      "SELECT DATABASE() AS banco, NOW() AS horario"
    );

    res.status(200).json({
      sucesso: true,
      conectado: true,
      mensagem: "MySQL conectado com sucesso!",
      dados: resultado[0]
    });

  } catch (erro) {
    console.error("Erro ao conectar ao MySQL:", erro);

    res.status(500).json({
      sucesso: false,
      conectado: false,
      mensagem: "Não foi possível conectar ao MySQL.",
      erro: erro.message
    });
  }
});

// ==========================================
// CRUD DE PRODUTOS
// 1. LISTAR PRODUTOS DO BRECHÓ (GET)
// ==========================================
app.get("/api/produtos", async (req, res) => {
  try {
    const [produtos] = await conexao.query(`
      SELECT p.*, c.nome AS nome_categoria, l.nome AS nome_loja
      FROM produtos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      INNER JOIN lojas l ON p.loja_id = l.id
      WHERE p.status = 'disponivel'
      ORDER BY p.criado_em DESC
    `);

    res.status(200).json({
      sucesso: true,
      total: produtos.length,
      produtos
    });

  } catch (erro) {
    console.error("Erro ao buscar produtos:", erro);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar produtos no banco de dados.",
      erro: erro.message
    });
  }
});

// ==========================================
// CRUD DE PRODUTOS
// 2. CRIAR NOVO PRODUTO DO PAINEL (POST)
// ==========================================
app.post("/api/produtos", async (req, res) => {
  const { nome, descricao, preco, condicao, imagem_url, categoria_id } = req.body;

  // Validação de campos obrigatórios exigida pelo schema do banco
  if (!nome || !preco) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e preço são campos obrigatórios."
    });
  }

  try {
    const sql = `
      INSERT INTO produtos 
        (loja_id, categoria_id, nome, descricao, preco, condicao, imagem_url, estoque, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'disponivel')
    `;

    const [resultado] = await conexao.query(sql, [
      1,                     // loja_id fixo na loja padrão do painel (Vendedor ASDSADSADSAD)
      categoria_id || 1,     // categoria_id (Padrão 1 = Roupas)
      nome,
      descricao || "",
      preco,
      condicao || "usado",   // 'novo', 'seminovo' ou 'usado' conforme o ENUM do MySQL
      imagem_url || "https://unsplash.com"
    ]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Produto publicado com sucesso no MySQL do Brechó Livre!",
      id: resultado.insertId
    });

  } catch (erro) {
    console.error("Erro ao inserir produto no MySQL:", erro);

    res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível cadastrar o produto no banco de dados.",
      erro: erro.message
    });
  }
});

// ==========================================
// ROTA NÃO ENCONTRADA
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota não encontrada."
  });
});

// ==========================================
// TRATAMENTO DE ERROS GLOBAL
// ==========================================
app.use((erro, req, res, next) => {
  console.error("Erro na API:", erro);

  res.status(500).json({
    sucesso: false,
    mensagem: "Erro interno do servidor."
  });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log("BRECHÓ LIVRE - BACKEND SINCRONIZADO");
  console.log("--------------------------------");
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log(`Listar/Criar: http://localhost:${PORT}/api/produtos`);
  console.log(`MySQL: http://localhost:${PORT}/api/teste-banco`);
  console.log("--------------------------------");
  console.log("Servidor iniciado com sucesso!");
});
