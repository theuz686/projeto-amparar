<?php
// ==============================================================================
// CONFIGURAÇÕES E CONEXÃO
// ==============================================================================
require_once 'conexao.php';

// Verifica se a conexão está ativa
if (!isset($conn) || $conn->connect_error) {
    die("❌ Erro fatal: Falha na conexão com o banco de dados.");
}

// ==============================================================================
// LÓGICA DE EXCLUSÃO
// ==============================================================================

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id']) && isset($_POST['tabela'])) {
    
    // 1. Coleta e sanitiza as variáveis
    // O ID deve ser tratado como um número inteiro
    $id = (int)$_POST['id'];
    
    // O nome da tabela deve ser validado para evitar injeção de tabela (muito perigoso!)
    $tabela_raw = $_POST['tabela'];
    $tabelas_validas = ['amparadas', 'acolhidas', 'voluntarias'];

    if (!in_array($tabela_raw, $tabelas_validas)) {
        $resultado = "❌ Erro de segurança: Tabela inválida para exclusão.";
    } else {
        // Uso de aspas invertidas para nomes de tabelas, se necessário, mas 
        // a validação acima já garante a segurança.
        $tabela = $tabela_raw; 

        // 2. Prepara a consulta DELETE de forma SEGURA
        // O nome da tabela é inserido diretamente APÓS a validação, 
        // e o ID é passado como um parâmetro (?)
        $sql = "DELETE FROM " . $tabela . " WHERE id = ?";
        
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            error_log("Erro de preparação SQL DELETE: " . $conn->error);
            $resultado = "❌ Erro interno ao preparar exclusão.";
        } else {
            // 3. Vincula o ID (i = integer)
            $stmt->bind_param("i", $id);

            // 4. Executa a exclusão
            if ($stmt->execute()) {
                $resultado = "✅ Registo na tabela '" . $tabela . "' (ID: " . $id . ") excluído com sucesso!";
            } else {
                error_log("Erro de execução SQL DELETE: " . $stmt->error);
                $resultado = "❌ Erro ao excluir registo. Detalhes no log.";
            }
            $stmt->close();
        }
    }
} else {
    $resultado = "❌ Erro: Acesso inválido ou parâmetros ausentes.";
}

// Fecha a conexão
$conn->close();

// ==============================================================================
// EXIBIÇÃO DO RESULTADO E REDIRECIONAMENTO
// ==============================================================================
// Redireciona o usuário de volta para a lista após 3 segundos
$redirect_url = 'listar_' . $tabela . '.php'; 
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="3;url=<?php echo htmlspecialchars($redirect_url); ?>">
    <title>Resultado da Exclusão</title>
    <style>
        /* Estilos básicos para a mensagem */
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }
        .message-box { padding: 30px; border-radius: 10px; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <div class="message-box">
        <p class="<?php echo (strpos($resultado, '✅') !== false) ? 'success' : 'error'; ?>">
            <?php echo htmlspecialchars($resultado); ?>
        </p>
        <p>A ser redirecionado(a) em 3 segundos. <a href="<?php echo htmlspecialchars($redirect_url); ?>">Clique aqui para ir agora.</a></p>
    </div>
</body>
</html>