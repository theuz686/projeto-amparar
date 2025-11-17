<?php

// DEFINIÇÕES
define('UPLOAD_DIR', 'C:/xampp/htdocs/PROJETO AMPARAR/uploads_amparadas/'); // Ajuste o caminho conforme seu sistema

// INCLUIR A CONEXÃO (assumindo que conexao.php está correto)
require_once 'conexao.php';

// VERIFICAR O MÉTODO POST E A TABELA
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['tabela'])) {
    $tabela = $_POST['tabela'];
    $resultado = "";

    // LÓGICA DE ROTEAMENTO
    switch ($tabela) {
        case 'amparadas':
            // Esta função foi atualizada no passo anterior
            $resultado = inserir_amparadas($conn, $_POST);
            break;
        case 'acolhidas':
            // Esta função será atualizada abaixo
            $resultado = inserir_acolhidas($conn, $_POST);
            break;
        case 'voluntarias':
            // Esta função será atualizada abaixo
            $resultado = inserir_voluntarias($conn, $_POST);
            break;
        default:
            $resultado = "❌ Erro: Tabela de destino desconhecida.";
            break;
    }

    // EXIBIÇÃO DO RESULTADO (MANTIDA)
    // ... (Coloque aqui o seu código HTML para exibir o resultado) ...
    // Exemplo Simples (use o seu HTML original)
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Resultado do Cadastro</title>
</head>
<body>
    <h1>Resultado da Operação</h1>
    <p><?php echo $resultado; ?></p>
    <p><a href="cadastros.html">Voltar para a Página de Cadastros</a></p>
</body>
</html>
<?php

} else {
    // REDIRECIONAR SE O ACESSO FOR DIRETO
    header("Location: cadastros.html");
    exit();
}

// ==============================================================================
// FUNÇÕES DE INSERÇÃO - ATUALIZADAS COM CPF, RG e ENDEREÇO
// ==============================================================================

// ----------------------------------------------------
// Função 1: Inserção para AMPARADAS (COMPLETA E CORRIGIDA)
// ----------------------------------------------------
function inserir_amparadas($conn, $dados) {
    // 1. Coleta e mapeia os dados
    $nome = $dados['nome'] ?? '';
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = $dados['email'] ?? NULL;
    $telefone = $dados['telefone'] ?? NULL;
    $cpf = $dados['cpf'] ?? NULL; 
    $rg = $dados['rg'] ?? NULL;   
    $endereco = $dados['endereco'] ?? NULL; 
    $numero_sid = $dados['numero_sid'] ?? '';
    $laudo_medico_obrigatorio = isset($dados['laudo_medico_obrigatorio']) ? 1 : 0; 
    
    $caminho_laudo = NULL;
    
    // 2. Lógica de Upload de Arquivo 
    if (isset($_FILES['laudo_file']) && $_FILES['laudo_file']['error'] == UPLOAD_ERR_OK) {
        $arquivo = $_FILES['laudo_file'];
        $extensao = strtolower(pathinfo($arquivo['name'], PATHINFO_EXTENSION));
        if (!in_array($extensao, ['pdf', 'jpg', 'png', 'jpeg'])) {
            return "❌ Erro: Tipo de arquivo não permitido.";
        }
        $novo_nome = $numero_sid . '_' . uniqid() . "." . $extensao;
        $destino = UPLOAD_DIR . $novo_nome;

        if (move_uploaded_file($arquivo['tmp_name'], $destino)) {
            $caminho_laudo = $destino;
        } else {
            return "❌ Erro ao mover o arquivo de laudo.";
        }
    } else if ($laudo_medico_obrigatorio && $_FILES['laudo_file']['error'] != UPLOAD_ERR_OK) {
         return "❌ Erro: O laudo médico é obrigatório e o upload falhou.";
    }


    // 3. Query de Inserção ATUALIZADA: 10 COLUNAS
    $sql = "INSERT INTO amparadas (nome, data_nascimento, email, telefone, cpf, rg, endereco, numero_sid, laudo_medico_obrigatorio, caminho_laudo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // bind_param: ssssssssis (10 parâmetros, 9 strings e 1 inteiro para o laudo_medico_obrigatorio)
    $stmt->bind_param("ssssssssis", 
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $laudo_medico_obrigatorio, $caminho_laudo
    );
    
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Amparada realizado com sucesso!";
    } else {
        $stmt->close();
        return "❌ Erro ao cadastrar Amparada: " . $conn->error;
    }
}


// ----------------------------------------------------
// Função 2: Inserção para ACOLHIDAS (ATUALIZADA)
// ----------------------------------------------------
function inserir_acolhidas($conn, $dados) {
    // 1. Coleta e mapeia os dados (NOVOS CAMPOS INCLUÍDOS)
    $nome = $dados['nome'] ?? '';
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = $dados['email'] ?? NULL;
    $telefone = $dados['telefone'] ?? NULL;
    $cpf = $dados['cpf'] ?? NULL; // NOVO
    $rg = $dados['rg'] ?? NULL;   // NOVO
    $endereco = $dados['endereco'] ?? NULL; // NOVO
    $numero_sid = $dados['numero_sid'] ?? '';
    $descricao_necessidades = $dados['descricao_necessidades'] ?? NULL; 

    // 2. Query de Inserção ATUALIZADA: 9 COLUNAS
    $sql = "INSERT INTO acolhidas (nome, data_nascimento, email, telefone, cpf, rg, endereco, numero_sid, descricao_necessidades) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // bind_param: sssssssss (9 strings)
    $stmt->bind_param("sssssssss", 
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $descricao_necessidades
    );
    
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Acolhida realizado com sucesso!";
    } else {
        $stmt->close();
        return "❌ Erro ao cadastrar Acolhida: " . $conn->error;
    }
}


// ----------------------------------------------------
// Função 3: Inserção para VOLUNTARIAS (ATUALIZADA)
// ----------------------------------------------------
function inserir_voluntarias($conn, $dados) {
    // 1. Coleta e mapeia os dados (NOVOS CAMPOS INCLUÍDOS)
    $nome = $dados['nome'] ?? '';
    $email = $dados['email'] ?? NULL;
    $telefone = $dados['telefone'] ?? NULL;
    $cpf = $dados['cpf'] ?? NULL; // NOVO
    $rg = $dados['rg'] ?? NULL;   // NOVO
    $endereco = $dados['endereco'] ?? NULL; // NOVO
    $area_atuacao = $dados['area_atuacao'] ?? NULL;
    $disponibilidade = $dados['disponibilidade'] ?? NULL;

    // 2. Query de Inserção ATUALIZADA: 8 COLUNAS
    $sql = "INSERT INTO voluntarias (nome, email, telefone, cpf, rg, endereco, area_atuacao, disponibilidade) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // bind_param: ssssssss (8 strings)
    $stmt->bind_param("ssssssss", 
        $nome, $email, $telefone, $cpf, $rg, $endereco, 
        $area_atuacao, $disponibilidade
    );
    
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Voluntária realizado com sucesso!";
    } else {
        $stmt->close();
        return "❌ Erro ao cadastrar Voluntária: " . $conn->error;
    }
}

// FECHAMENTO DA CONEXÃO NO FINAL DO SCRIPT (se necessário)
if (isset($conn)) {
    $conn->close();
}
?>