<?php
// ==============================================================================
// CONFIGURAÇÕES E CONEXÃO
// ==============================================================================
require_once 'conexao.php';
if (!isset($conn) || $conn->connect_error) {
    die("❌ Erro fatal: Falha na conexão com o banco de dados.");
}

// ==============================================================================
// LÓGICA PRINCIPAL (ROTEAMENTO)
// ==============================================================================

$resultado = "❌ Erro: Acesso inválido ou dados incompletos.";
$tabela = ''; 

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['id']) && isset($_POST['tabela'])) {
    
    $tabela_raw = $_POST['tabela'];
    $tabelas_validas = ['amparadas', 'acolhidas', 'voluntarias'];
    
    // 1. Validação de Segurança da Tabela
    if (!in_array($tabela_raw, $tabelas_validas)) {
        $resultado = "❌ Erro de segurança: Tentativa de edição em tabela inválida.";
    } else {
        $tabela = $tabela_raw;
        
        // 2. Roteamento para a função de UPDATE correta
        switch ($tabela) {
            case 'amparadas':
                $resultado = editar_amparada($conn, $_POST);
                break;
            case 'acolhidas':
                $resultado = editar_acolhida($conn, $_POST);
                break;
            case 'voluntarias':
                $resultado = editar_voluntaria($conn, $_POST);
                break;
        }
    }
}

// ==============================================================================
// FUNÇÕES DE EDIÇÃO (UPDATE) - TODAS USANDO PREPARED STATEMENTS
// ==============================================================================

// Colunas: 10 + ID
function editar_amparada($conn, $dados) {
    $id = (int)$dados['id'];
    $nome = trim($dados['nome'] ?? '');
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL); 
    $rg = trim($dados['rg'] ?? NULL);   
    $endereco = trim($dados['endereco'] ?? NULL); 
    $numero_sid = trim($dados['numero_sid'] ?? '');
    $laudo_medico_obrigatorio = isset($dados['laudo_medico_obrigatorio']) ? 1 : 0; 
    
    // NOTA: O campo caminho_laudo NÃO está incluído para UPDATE, pois uploads requerem multipart/form-data. 
    // Para simplificar, o laudo só será alterado se um novo upload for implementado no formulário.

    $sql = "UPDATE amparadas SET 
        nome=?, data_nascimento=?, email=?, telefone=?, cpf=?, rg=?, endereco=?, numero_sid=?, laudo_medico_obrigatorio=? 
        WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log("Erro de preparação SQL (UPDATE amparadas): " . $conn->error);
        return "❌ Erro interno ao preparar edição.";
    }

    // Tipos: ssssssssi + i (para o ID no WHERE) -> 9 strings, 1 inteiro, 1 inteiro
    $stmt->bind_param("ssssssssii", 
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $laudo_medico_obrigatorio, $id
    );
    
    if ($stmt->execute()) {
        $msg = $stmt->affected_rows > 0 ? "✅ Edição de Amparada (ID: {$id}) realizada com sucesso!" : "⚠️ Nenhuma alteração feita.";
        $stmt->close();
        return $msg;
    } else {
        error_log("Erro de execução SQL (UPDATE amparadas): " . $stmt->error);
        $stmt->close();
        return "❌ Erro ao editar Amparada.";
    }
}

// Colunas: 9 + ID
function editar_acolhida($conn, $dados) {
    $id = (int)$dados['id'];
    $nome = trim($dados['nome'] ?? '');
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL);
    $rg = trim($dados['rg'] ?? NULL);
    $endereco = trim($dados['endereco'] ?? NULL);
    $numero_sid = trim($dados['numero_sid'] ?? '');
    $descricao_necessidades = trim($dados['descricao_necessidades'] ?? NULL); 

    $sql = "UPDATE acolhidas SET 
        nome=?, data_nascimento=?, email=?, telefone=?, cpf=?, rg=?, endereco=?, numero_sid=?, descricao_necessidades=? 
        WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log("Erro de preparação SQL (UPDATE acolhidas): " . $conn->error);
        return "❌ Erro interno ao preparar edição.";
    }

    // Tipos: sssssssss + i (para o ID no WHERE) -> 9 strings, 1 inteiro
    $stmt->bind_param("sssssssssi", 
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $descricao_necessidades, $id
    );
    
    if ($stmt->execute()) {
        $msg = $stmt->affected_rows > 0 ? "✅ Edição de Acolhida (ID: {$id}) realizada com sucesso!" : "⚠️ Nenhuma alteração feita.";
        $stmt->close();
        return $msg;
    } else {
        error_log("Erro de execução SQL (UPDATE acolhidas): " . $stmt->error);
        $stmt->close();
        return "❌ Erro ao editar Acolhida.";
    }
}

// Colunas: 8 + ID
function editar_voluntaria($conn, $dados) {
    $id = (int)$dados['id'];
    $nome = trim($dados['nome'] ?? '');
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL);
    $rg = trim($dados['rg'] ?? NULL);
    $endereco = trim($dados['endereco'] ?? NULL);
    $area_atuacao = trim($dados['area_atuacao'] ?? NULL);
    $disponibilidade = trim($dados['disponibilidade'] ?? NULL);

    $sql = "UPDATE voluntarias SET 
        nome=?, email=?, telefone=?, cpf=?, rg=?, endereco=?, area_atuacao=?, disponibilidade=? 
        WHERE id=?";
    
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log("Erro de preparação SQL (UPDATE voluntarias): " . $conn->error);
        return "❌ Erro interno ao preparar edição.";
    }

    // Tipos: ssssssss + i (para o ID no WHERE) -> 8 strings, 1 inteiro
    $stmt->bind_param("ssssssssi", 
        $nome, $email, $telefone, $cpf, $rg, $endereco, 
        $area_atuacao, $disponibilidade, $id
    );
    
    if ($stmt->execute()) {
        $msg = $stmt->affected_rows > 0 ? "✅ Edição de Voluntária (ID: {$id}) realizada com sucesso!" : "⚠️ Nenhuma alteração feita.";
        $stmt->close();
        return $msg;
    } else {
        error_log("Erro de execução SQL (UPDATE voluntarias): " . $stmt->error);
        $stmt->close();
        return "❌ Erro ao editar Voluntária.";
    }
}

// ==============================================================================
// EXIBIÇÃO DO RESULTADO E REDIRECIONAMENTO
// ==============================================================================

// Fecha a conexão após todo o processamento
$conn->close();

$redirect_url = empty($tabela) ? 'cadastros.html' : 'listar_' . $tabela . '.php'; 

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="3;url=<?php echo htmlspecialchars($redirect_url); ?>">
    <title>Resultado da Edição</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }
        .message-box { padding: 30px; border-radius: 10px; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        .warning { color: orange; font-weight: bold; }
    </style>
</head>
<body>
    <div class="message-box">
        <p class="<?php 
            if (strpos($resultado, '✅') !== false) echo 'success';
            else if (strpos($resultado, '⚠️') !== false) echo 'warning';
            else echo 'error';
        ?>">
            <?php echo htmlspecialchars($resultado); ?>
        </p>
        <p>A ser redirecionado(a) em 3 segundos. <a href="<?php echo htmlspecialchars($redirect_url); ?>">Clique aqui para ir agora.</a></p>
    </div>
</body>
</html>