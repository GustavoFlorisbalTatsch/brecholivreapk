
const express = require("express");
const conexao = require("../conexao");

const router = express.Router();

// Campos permitidos para cadastro e atualização
const camposPermitidos = [
  "loja_id",
  "categoria_id",
  "nome",
  "descricao",
  "preco",
  "condicao",
  "imagem_url",
  "estoque"
];

const condicoesPermitidas = ["novo", "seminovo", "usado"];

// GET - Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const [produtos] = await conexao.execute(
      "SELECT * FROM produtos ORDER BY id DESC"
    );

    return res.status(200).json({
      sucesso: true,
      total: produtos.length,
      produtos
    });
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao consultar produtos."
    });
  }
});

// GET - Buscar produto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido."
      });
    }

    const [produtos] = await conexao.execute(
      "SELECT * FROM produtos WHERE id = ?",
      [id]
    );

    if (produtos.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado."
      });
    }

    return res.status(200).json({
      sucesso: true,
      produto: produtos[0]
    });
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao buscar produto."
    });
  }
});

// POST - Cadastrar produto
router.post("/", async (req, res) => {
  try {
    const {
      loja_id,
      categoria_id,
      nome,
      descricao,
      preco,
      condicao,
      imagem_url,
      estoque
    } = req.body;

    if (
      !loja_id ||
      !nome ||
      preco === undefined ||
      preco === null
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Informe loja_id, nome e preco."
      });
    }

    const lojaId = Number(loja_id);
    const precoNumero = Number(preco);
    const estoqueNumero = estoque === undefined ? 0 : Number(estoque);

    if (!Number.isInteger(lojaId) || lojaId <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "loja_id inválido."
      });
    }

    if (!Number.isFinite(precoNumero) || precoNumero < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O preço deve ser um número igual ou maior que zero."
      });
    }

    if (!Number.isInteger(estoqueNumero) || estoqueNumero < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O estoque deve ser um número inteiro igual ou maior que zero."
      });
    }

    if (condicao && !condicoesPermitidas.includes(condicao)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Condição inválida. Use novo, seminovo ou usado."
      });
    }

    const dados = {
      loja_id: lojaId,
      nome: String(nome).trim(),
      preco: precoNumero,
      estoque: estoqueNumero
    };

    if (categoria_id !== undefined) {
      dados.categoria_id =
        categoria_id === null ? null : Number(categoria_id);
    }

    if (descricao !== undefined) dados.descricao = descricao;
    if (condicao !== undefined) dados.condicao = condicao;
    if (imagem_url !== undefined) dados.imagem_url = imagem_url;

    const colunas = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = colunas.map(() => "?").join(", ");

    const sql = `
      INSERT INTO produtos (${colunas.join(", ")})
      VALUES (${placeholders})
    `;

    const [resultado] = await conexao.execute(sql, valores);

    return res.status(201).json({
      sucesso: true,
      mensagem: "Produto cadastrado com sucesso!",
      id: resultado.insertId
    });
  } catch (erro) {
    console.error("Erro ao cadastrar produto:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível cadastrar o produto. Verifique a loja, a categoria e os campos do banco de dados."
    });
  }
});

// PUT - Atualizar produto
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido."
      });
    }

    const [existentes] = await conexao.execute(
      "SELECT id FROM produtos WHERE id = ?",
      [id]
    );

    if (existentes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado."
      });
    }

    const dados = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined) {
        dados[campo] = req.body[campo];
      }
    }

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Informe pelo menos um campo para atualizar."
      });
    }

    if (dados.nome !== undefined) {
      if (typeof dados.nome !== "string" || !dados.nome.trim()) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "O nome do produto é obrigatório."
        });
      }

      dados.nome = dados.nome.trim();
    }

    if (dados.loja_id !== undefined) {
      dados.loja_id = Number(dados.loja_id);

      if (!Number.isInteger(dados.loja_id) || dados.loja_id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "loja_id inválido."
        });
      }
    }

    if (dados.categoria_id !== undefined && dados.categoria_id !== null) {
      dados.categoria_id = Number(dados.categoria_id);

      if (!Number.isInteger(dados.categoria_id) || dados.categoria_id <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "categoria_id inválido."
        });
      }
    }

    if (dados.preco !== undefined) {
      dados.preco = Number(dados.preco);

      if (!Number.isFinite(dados.preco) || dados.preco < 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preço inválido."
        });
      }
    }

    if (dados.estoque !== undefined) {
      dados.estoque = Number(dados.estoque);

      if (!Number.isInteger(dados.estoque) || dados.estoque < 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Estoque inválido."
        });
      }
    }

    if (
      dados.condicao !== undefined &&
      !condicoesPermitidas.includes(dados.condicao)
    ) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Condição inválida."
      });
    }

    const colunas = Object.keys(dados);

    const atualizacoes = colunas
      .map((campo) => `${campo} = ?`)
      .join(", ");

    const valores = Object.values(dados);

    await conexao.execute(
      `UPDATE produtos SET ${atualizacoes} WHERE id = ?`,
      [...valores, id]
    );

    return res.status(200).json({
      sucesso: true,
      mensagem: "Produto atualizado com sucesso!"
    });
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar produto."
    });
  }
});

// DELETE - Excluir produto
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID inválido."
      });
    }

    const [resultado] = await conexao.execute(
      "DELETE FROM produtos WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Produto não encontrado."
      });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Produto excluído com sucesso!"
    });
  } catch (erro) {
    console.error("Erro ao excluir produto:", erro);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Não foi possível excluir o produto. Ele pode estar vinculado a um pedido."
    });
  }
});

module.exports = router;
