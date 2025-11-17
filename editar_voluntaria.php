<?php
// ==============================================================================
// CONFIGURAÇÕES E CONEXÃO
// ==============================================================================
require_once 'conexao.php';
if (!isset($conn) || $conn->connect_error) {
    die("❌ Erro fatal: Falha na conexão com o banco de dados.");
}

// ==============================================================================
// LÓGICA DE BUSCA SEGURA DO REGISTRO
// ==============================================================================

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id === 0) {
    die("❌ Erro: ID do registro não fornecido ou inválido.");
}

// Query de SELECT com Prepared Statement
$sql = "SELECT id, nome, email, telefone, cpf, rg, endereco, area_atuacao, disponibilidade
        FROM voluntarias 
        WHERE id = ?";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    error_log("Erro na preparação SELECT (voluntarias): " . $conn->error);
    $conn->close();
    die("❌ Erro interno ao carregar dados.");
}

$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows !== 1) {
    $stmt->close();
    $conn->close();
    die("❌ Erro: Registro de Voluntária não encontrado.");
}

$dados = $resultado->fetch_assoc();
$stmt->close();
$conn->close();

// ==============================================================================
// ESTRUTURA HTML DO FORMULÁRIO PRÉ-PREENCHIDO
// ==============================================================================
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Voluntária: <?= htmlspecialchars($dados['nome']) ?></title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8; }
        .container { max-width: 800px; margin: 30px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        h2 { color: #ff69b4; border-bottom: 2px solid #ff69b4; padding-bottom: 10px; }
        label { display: block; margin-top: 10px; font-weight: bold; }
        input[type="text"], input[type="email"], input[type="date"], input[type="tel"], textarea {
            width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
        }
        button {
            padding: 10px 15px; margin-top: 20px; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s;
        }
        .save-btn { background-color: #ff69b4; color: white; margin-right: 10px; }
        .save-btn:hover { background-color: #d15192; }
        .back-btn { background-color: #ccc; color: #333; }
        .back-btn:hover { background-color: #bbb; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Editar Voluntária: <?= htmlspecialchars($dados['nome']) ?> (ID: <?= $dados['id'] ?>)</h2>
        
        <!-- Envia para o processador central e informa a tabela -->
        <form method="POST" action="processa_edicao.php">
            <input type="hidden" name="id" value="<?= htmlspecialchars($dados['id']) ?>">
            <input type="hidden" name="tabela" value="voluntarias">

            <label for="nome">Nome Completo:</label>
            <input type="text" id="nome" name="nome" value="<?= htmlspecialchars($dados['nome']) ?>" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="<?= htmlspecialchars($dados['email']) ?>">

            <label for="telefone">Telefone:</label>
            <input type="tel" id="telefone" name="telefone" value="<?= htmlspecialchars($dados['telefone']) ?>">
            
            <div style="display: flex; gap: 20px;">
                <div style="flex-grow: 1;">
                    <label for="cpf">CPF:</label>
                    <input type="text" id="cpf" name="cpf" value="<?= htmlspecialchars($dados['cpf']) ?>">
                </div>
                <div style="flex-grow: 1;">
                    <label for="rg">RG:</label>
                    <input type="text" id="rg" name="rg" value="<?= htmlspecialchars($dados['rg']) ?>">
                </div>
            </div>

            <label for="endereco">Endereço:</label>
            <textarea id="endereco" name="endereco"><?= htmlspecialchars($dados['endereco']) ?></textarea>
            
            <label for="area_atuacao">Área de Atuação:</label>
            <input type="text" id="area_atuacao" name="area_atuacao" value="<?= htmlspecialchars($dados['area_atuacao']) ?>">
            
            <label for="disponibilidade">Disponibilidade (Ex: Manhã, Segunda a Quarta):</label>
            <textarea id="disponibilidade" name="disponibilidade"><?= htmlspecialchars($dados['disponibilidade']) ?></textarea>

            <button type="submit" class="save-btn">Salvar Alterações</button>
            <button type="button" class="back-btn" onclick="window.location.href='listar_voluntarias.php'">Cancelar e Voltar</button>
        </form>

    </div>
</body>
</html>