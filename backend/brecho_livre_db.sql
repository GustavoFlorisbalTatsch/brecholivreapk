
-- =====================================================
-- BRECHÓ LIVRE - BANCO DE DADOS
-- MySQL 8.0+
-- =====================================================

CREATE DATABASE IF NOT EXISTS brecholivre
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE brecholivre;

-- =====================================================
-- 1. USUÁRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario ENUM(
        'comprador',
        'lojista',
        'administrador'
    ) NOT NULL DEFAULT 'comprador',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- 2. LOJAS
-- =====================================================

CREATE TABLE IF NOT EXISTS lojas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    imagem_url VARCHAR(500),
    telefone_contato VARCHAR(20),
    email_contato VARCHAR(180),
    cidade VARCHAR(100),
    estado CHAR(2),
    endereco VARCHAR(255),
    status ENUM(
        'ativa',
        'pausada',
        'bloqueada'
    ) NOT NULL DEFAULT 'ativa',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_lojas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 3. CATEGORIAS
-- =====================================================

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- 4. PRODUTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS produtos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    loja_id BIGINT UNSIGNED NOT NULL,
    categoria_id BIGINT UNSIGNED NOT NULL,
    nome VARCHAR(180) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    condicao ENUM(
        'novo',
        'seminovo',
        'usado'
    ) NOT NULL DEFAULT 'usado',
    imagem_url VARCHAR(500),
    estoque INT UNSIGNED NOT NULL DEFAULT 1,
    status ENUM(
        'disponivel',
        'indisponivel',
        'vendido',
        'pausado'
    ) NOT NULL DEFAULT 'disponivel',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_produtos_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_produtos_preco CHECK (preco >= 0),

    INDEX idx_produtos_loja (loja_id),
    INDEX idx_produtos_categoria (categoria_id),
    INDEX idx_produtos_status (status),
    INDEX idx_produtos_nome (nome)
) ENGINE=InnoDB;

-- =====================================================
-- 5. FAVORITOS
-- =====================================================

CREATE TABLE IF NOT EXISTS favoritos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    produto_id BIGINT UNSIGNED NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_favorito
        UNIQUE (usuario_id, produto_id),

    CONSTRAINT fk_favoritos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_favoritos_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 6. PEDIDOS
-- =====================================================

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT UNSIGNED NOT NULL,
    codigo_pedido VARCHAR(30) NOT NULL UNIQUE,

    status ENUM(
        'aguardando_pagamento',
        'pago',
        'em_separacao',
        'enviado',
        'entregue',
        'cancelado'
    ) NOT NULL DEFAULT 'aguardando_pagamento',

    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    endereco_entrega VARCHAR(255),
    cidade_entrega VARCHAR(100),
    estado_entrega CHAR(2),
    cep_entrega VARCHAR(10),
    observacoes TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pedidos_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_pedido_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_pedido_frete CHECK (valor_frete >= 0),
    CONSTRAINT chk_pedido_total CHECK (valor_total >= 0),

    INDEX idx_pedidos_usuario (usuario_id),
    INDEX idx_pedidos_status (status)
) ENGINE=InnoDB;

-- =====================================================
-- 7. ITENS DOS PEDIDOS
-- =====================================================

CREATE TABLE IF NOT EXISTS itens_pedido (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT UNSIGNED NOT NULL,
    produto_id BIGINT UNSIGNED NULL,
    loja_id BIGINT UNSIGNED NULL,

    nome_produto VARCHAR(180) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade INT UNSIGNED NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_itens_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_itens_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_itens_loja
        FOREIGN KEY (loja_id)
        REFERENCES lojas(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_item_preco CHECK (preco_unitario >= 0),
    CONSTRAINT chk_item_quantidade CHECK (quantidade > 0),
    CONSTRAINT chk_item_subtotal CHECK (subtotal >= 0),

    INDEX idx_itens_pedido (pedido_id),
    INDEX idx_itens_produto (produto_id),
    INDEX idx_itens_loja (loja_id)
) ENGINE=InnoDB;

-- =====================================================
-- 8. CATEGORIAS INICIAIS
-- =====================================================

INSERT IGNORE INTO categorias (nome, descricao) VALUES
('Roupas', 'Roupas masculinas, femininas e infantis'),
('Calçados', 'Tênis, sapatos, botas e sandálias'),
('Acessórios', 'Bolsas, cintos, relógios e acessórios'),
('Eletrônicos', 'Celulares, computadores e eletrônicos'),
('Móveis', 'Móveis e itens para casa'),
('Livros', 'Livros e materiais de leitura'),
('Materiais Escolares', 'Materiais e itens escolares'),
('Outros', 'Outros produtos');

-- =====================================================
-- 9. VERIFICAÇÃO DO BANCO
-- =====================================================

SELECT DATABASE() AS banco_selecionado;

SHOW TABLES;

SELECT * FROM categorias;

-- Verificar estrutura dos produtos
DESCRIBE produtos;

-- Verificar estrutura dos usuários
DESCRIBE usuarios;
