<?php
// ==============================================================================
// CONFIGURAÇÕES E CONEXÃO
// ==============================================================================

// Inclui o arquivo de conexão (assume que $conn é definido nele)
require_once 'conexao.php';

// Verifica se a conexão com o banco de dados foi estabelecida
if (!isset($conn) || $conn->connect_error) {
    die("❌ Erro fatal: Falha na conexão com o banco de dados. " . $conn->connect_error);
}

// ==============================================================================
// LÓGICA DE FILTRO E PREPARED STATEMENT (SEGURO)
// ==============================================================================

// Variável de filtro (sanitiza e coleta o termo de busca da URL)
$termo_busca = isset($_GET['busca']) ? trim($_GET['busca']) : '';

// 1. Define a consulta SQL base, selecionando todas as colunas relevantes
$sql = "SELECT id, nome, data_nascimento, email, telefone, cpf, rg, endereco, numero_sid, descricao_necessidades 
        FROM acolhidas";

$tipos = "";
$parametros = [];

// 2. Monta a cláusula WHERE apenas se houver um termo de busca
if (!empty($termo_busca)) {
    // Adiciona a cláusula WHERE para buscar no nome, email ou SID
    $sql .= " WHERE nome LIKE ? OR email LIKE ? OR numero_sid LIKE ?";
    
    // O termo de busca precisa de caracteres curinga (%) para o LIKE
    $busca_like = "%" . $termo_busca . "%";
    
    // Três strings (s) para nome, email e numero_sid
    $tipos = "sss";
    $parametros = [$busca_like, $busca_like, $busca_like];
}

// Adiciona ordenação para melhor visualização
$sql .= " ORDER BY nome ASC";

// 3. Prepara a instrução
$stmt = $conn->prepare($sql);

// TRATAMENTO DE ERRO na preparação
if ($stmt === false) {
    error_log("Erro na preparação da consulta (acolhidas): " . $conn->error);
    die("❌ Erro interno do sistema. Consulte os logs.");
}

// 4. Se houver parâmetros, vincula-os
if (!empty($parametros)) {
    // Usamos o operador splat (...) para passar o array como argumentos de forma segura
    $stmt->bind_param($tipos, ...$parametros);
}

// 5. Executa a consulta
if (!$stmt->execute()) {
    error_log("Erro na execução SQL (acolhidas): " . $stmt->error);
    die("❌ Erro ao buscar dados de Acolhidas. Tente novamente.");
}

// 6. Obtém o resultado da consulta
$resultado = $stmt->get_result();

// ==============================================================================
// ESTRUTURA HTML PARA EXIBIÇÃO
// ==============================================================================
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Acolhidas</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8; }
        .container { max-width: 1400px; margin: 30px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        /* A cor rosa forte (#ff69b4) é mantida para o tema */
        h2 { color: #ff69b4; border-bottom: 2px solid #ff69b4; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #ff69b4; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        /* Estilos do Formulário de Busca */
        .search-form { margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
        .search-form input[type="text"] { 
            padding: 10px; 
            border: 1px solid #ccc; 
            border-radius: 5px; 
            flex-grow: 1; 
            font-size: 16px;
        }
        .search-form button { 
            padding: 10px 15px; 
            background-color: #007bff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            transition: background-color 0.3s;
        }
        .search-form button:hover { background-color: #0056b3; }
        .voltar-link { margin-top: 20px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Lista de Pessoas Acolhidas Cadastradas</h2>
        
        <!-- Formulário de Busca SEGURO -->
        <form method="GET" class="search-form">
            <input 
                type="text" 
                name="busca" 
                placeholder="Buscar por nome, e-mail ou SID..." 
                value="<?php echo htmlspecialchars($termo_busca); ?>"
            >
            <button type="submit">🔍 Buscar</button>
            <button type="button" onclick="window.location.href='listar_acolhidas.php'">Limpar Filtro</button>
        </form>

        <?php if ($resultado->num_rows > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>SID</th>
                        <th>Nome</th>
                        <th>Nascimento</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CPF</th>
                        <th>RG</th>
                        <th>Endereço</th>
                        <th>Necessidades</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($linha = $resultado->fetch_assoc()): ?>
                        <tr>
                            <!-- Aplicação do htmlspecialchars() para prevenir XSS em TODOS os dados de saída -->
                            <td><?= htmlspecialchars($linha['id']) ?></td>
                            <td><?= htmlspecialchars($linha['numero_sid']) ?></td>
                            <td><?= htmlspecialchars($linha['nome']) ?></td>
                            <td><?= htmlspecialchars($linha['data_nascimento']) ?></td>
                            <td><?= htmlspecialchars($linha['email']) ?></td>
                            <td><?= htmlspecialchars($linha['telefone']) ?></td>
                            <td><?= htmlspecialchars($linha['cpf']) ?></td>
                            <td><?= htmlspecialchars($linha['rg']) ?></td>
                            <td><?= htmlspecialchars($linha['endereco']) ?></td>
                            <td><?= htmlspecialchars($linha['descricao_necessidades']) ?></td>
                            <td>
                                <!-- TODO: Adicionar botões de Edição e Exclusão aqui -->
                                <button style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Editar</button>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p>Nenhuma pessoa acolhida encontrada no banco de dados <?php echo !empty($termo_busca) ? "para o termo '" . htmlspecialchars($termo_busca) . "'" : ""; ?>.</p>
        <?php endif; ?>

        <a href="cadastros.html" class="voltar-link">Voltar para a Página de Cadastros</a>
    </div>
</body>
</html>

<?php
// 7. Limpeza (fechamento da instrução e da conexão)
$stmt->close();
$conn->close();
?>