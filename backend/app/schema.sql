CREATE TABLE contas (
    usuario TEXT PRIMARY KEY,
    senha TEXT NOT NULL,
    saldo REAL NOT NULL
);

CREATE TABLE ativos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    moeda TEXT NOT NULL,
    quantidade REAL NOT NULL,
    UNIQUE(usuario, moeda), 
    FOREIGN KEY(usuario) REFERENCES contas(usuario)
);

CREATE TABLE transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    remetente TEXT NOT NULL,
    destinatario TEXT NOT NULL,
    valor REAL NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(remetente) REFERENCES contas(usuario),
    FOREIGN KEY(destinatario) REFERENCES contas(usuario)
);