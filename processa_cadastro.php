<?php

// ==============================================================================
// CONFIGURAÇÕES GLOBAIS
// ==============================================================================

// Ajuste o caminho conforme seu ambiente (Atenção: Caminhos absolutos são dependentes do sistema operacional!)
// Considere usar caminhos relativos ou variáveis de ambiente para produção.
define('UPLOAD_DIR', 'C:/xampp/htdocs/PROJETO AMPARAR/uploads_amparadas/'); 

// Habilita o reporte de erros para ajudar na depuração.
ini_set('display_errors', 1);
error_reporting(E_ALL);

// INCLUIR A CONEXÃO (assumindo que conexao.php está correto e define $conn)
// Use require para garantir que a conexão exista.
require_once 'conexao.php';

// Verifica se a conexão com o banco de dados foi estabelecida
if (!isset($conn) || $conn->connect_error) {
    die("❌ Erro fatal: Falha na conexão com o banco de dados. " . $conn->connect_error);
}

// ==============================================================================
// LÓGICA PRINCIPAL (ROTEAMENTO)
// ==============================================================================

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['tabela'])) {
    $tabela = $_POST['tabela'];
    $resultado = "";

    // LÓGICA DE ROTEAMENTO
    switch ($tabela) {
        case 'amparadas':
            // Esta função JÁ ESTAVA segura e funcional.
            $resultado = inserir_amparadas($conn, $_POST);
            break;
        case 'acolhidas':
            // Função refatorada para usar Prepared Statements.
            $resultado = inserir_acolhidas($conn, $_POST);
            break;
        case 'voluntarias':
            // Função refatorada para usar Prepared Statements.
            $resultado = inserir_voluntarias($conn, $_POST);
            break;
        default:
            $resultado = "❌ Erro: Tabela de destino desconhecida.";
            break;
    }

    // FECHAMENTO DA CONEXÃO APÓS O PROCESSAMENTO
    $conn->close();

    // EXIBIÇÃO DO RESULTADO (MANTIDA a estrutura HTML)
    // Se o seu código original tiver mais estilos ou for mais complexo, substitua abaixo.
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado do Cadastro</title>
    <!-- Adicione seus links CSS aqui se necessário -->
    <style>
        body { font-family: sans-serif; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Resultado da Operação</h1>
        <p class="<?php echo (strpos($resultado, '✅') !== false) ? 'success' : 'error'; ?>">
            <?php echo $resultado; ?>
        </p>
        <p><a href="cadastros.html" style="text-decoration: underline; color: #007bff;">Voltar para a Página de Cadastros</a></p>
    </div>
</body>
</html>
<?php

} else {
    // REDIRECIONAR SE O ACESSO FOR DIRETO OU INCOMPLETO
    header("Location: cadastros.html");
    exit();
}

// ==============================================================================
// FUNÇÕES DE INSERÇÃO - TODAS USANDO PREPARED STATEMENTS
// ==============================================================================

/**
 * Insere dados de Amparada no banco de dados.
 * @param mysqli $conn Objeto de conexão MySQLi.
 * @param array $dados Dados do formulário via POST.
 * @return string Mensagem de resultado.
 */
function inserir_amparadas($conn, $dados) {
    // 1. Coleta e mapeia os dados, aplicando trim() para sanear strings
    $nome = trim($dados['nome'] ?? '');
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL); 
    $rg = trim($dados['rg'] ?? NULL);   
    $endereco = trim($dados['endereco'] ?? NULL); 
    $numero_sid = trim($dados['numero_sid'] ?? '');
    $laudo_medico_obrigatorio = isset($dados['laudo_medico_obrigatorio']) ? 1 : 0; 
    
    $caminho_laudo = NULL;
    
    // 2. Lógica de Upload de Arquivo (MANTIDA)
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
            return "❌ Erro ao mover o arquivo de laudo. Verifique as permissões do diretório: " . UPLOAD_DIR;
        }
    } else if ($laudo_medico_obrigatorio && $_FILES['laudo_file']['error'] != UPLOAD_ERR_OK) {
         return "❌ Erro: O laudo médico é obrigatório e o upload falhou.";
    }

    // 3. Query de Inserção com Prepared Statements (10 COLUNAS)
    $sql = "INSERT INTO amparadas (nome, data_nascimento, email, telefone, cpf, rg, endereco, numero_sid, laudo_medico_obrigatorio, caminho_laudo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // TRATAMENTO DE ERRO na preparação
    if ($stmt === false) {
        error_log("Erro de preparação SQL (amparadas): " . $conn->error);
        return "❌ Erro interno do sistema ao preparar o cadastro.";
    }

    // 4. bind_param: ssssssssis (10 parâmetros: 9 strings e 1 inteiro)
    $tipos = "ssssssssis";
    $parametros = [
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $laudo_medico_obrigatorio, $caminho_laudo
    ];
    
    $stmt->bind_param($tipos, ...$parametros);
    
    // 5. Execução
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Amparada realizado com sucesso!";
    } else {
        // Loga o erro exato no servidor, mas exibe uma mensagem genérica para o usuário
        error_log("Erro na execução SQL (amparadas): " . $stmt->error);
        $stmt->close();
        return "❌ Erro interno ao cadastrar Amparada. Tente novamente.";
    }
}


/**
 * Insere dados de Acolhida no banco de dados.
 * ATUALIZADA para usar Prepared Statements.
 * @param mysqli $conn Objeto de conexão MySQLi.
 * @param array $dados Dados do formulário via POST.
 * @return string Mensagem de resultado.
 */
function inserir_acolhidas($conn, $dados) {
    // 1. Coleta e mapeia os dados, aplicando trim() para sanear strings
    $nome = trim($dados['nome'] ?? '');
    $data_nascimento = $dados['data_nascimento'] ?: NULL;
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL);
    $rg = trim($dados['rg'] ?? NULL);
    $endereco = trim($dados['endereco'] ?? NULL);
    $numero_sid = trim($dados['numero_sid'] ?? '');
    $descricao_necessidades = trim($dados['descricao_necessidades'] ?? NULL); 

    // 2. Query de Inserção com Prepared Statements (9 COLUNAS)
    $sql = "INSERT INTO acolhidas (nome, data_nascimento, email, telefone, cpf, rg, endereco, numero_sid, descricao_necessidades) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // TRATAMENTO DE ERRO na preparação
    if ($stmt === false) {
        error_log("Erro de preparação SQL (acolhidas): " . $conn->error);
        return "❌ Erro interno do sistema ao preparar o cadastro.";
    }

    // 3. bind_param: sssssssss (9 strings)
    $tipos = "sssssssss";
    $parametros = [
        $nome, $data_nascimento, $email, $telefone, $cpf, $rg, $endereco, 
        $numero_sid, $descricao_necessidades
    ];
    
    $stmt->bind_param($tipos, ...$parametros);
    
    // 4. Execução
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Acolhida realizado com sucesso!";
    } else {
        // Loga o erro exato no servidor, mas exibe uma mensagem genérica para o usuário
        error_log("Erro na execução SQL (acolhidas): " . $stmt->error);
        $stmt->close();
        return "❌ Erro interno ao cadastrar Acolhida. Tente novamente.";
    }
}


/**
 * Insere dados de Voluntária no banco de dados.
 * ATUALIZADA para usar Prepared Statements.
 * @param mysqli $conn Objeto de conexão MySQLi.
 * @param array $dados Dados do formulário via POST.
 * @return string Mensagem de resultado.
 */
function inserir_voluntarias($conn, $dados) {
    // 1. Coleta e mapeia os dados, aplicando trim() para sanear strings
    $nome = trim($dados['nome'] ?? '');
    $email = trim($dados['email'] ?? NULL);
    $telefone = trim($dados['telefone'] ?? NULL);
    $cpf = trim($dados['cpf'] ?? NULL);
    $rg = trim($dados['rg'] ?? NULL);
    $endereco = trim($dados['endereco'] ?? NULL);
    $area_atuacao = trim($dados['area_atuacao'] ?? NULL);
    $disponibilidade = trim($dados['disponibilidade'] ?? NULL);

    // 2. Query de Inserção com Prepared Statements (8 COLUNAS)
    $sql = "INSERT INTO voluntarias (nome, email, telefone, cpf, rg, endereco, area_atuacao, disponibilidade) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    
    // TRATAMENTO DE ERRO na preparação
    if ($stmt === false) {
        error_log("Erro de preparação SQL (voluntarias): " . $conn->error);
        return "❌ Erro interno do sistema ao preparar o cadastro.";
    }

    // 3. bind_param: ssssssss (8 strings)
    $tipos = "ssssssss";
    $parametros = [
        $nome, $email, $telefone, $cpf, $rg, $endereco, 
        $area_atuacao, $disponibilidade
    ];

    // Note: Usando "..." para passar os elementos do array como argumentos individuais (PHP 5.6+)
    $stmt->bind_param($tipos, ...$parametros);
    
    // 4. Execução
    if ($stmt->execute()) {
        $stmt->close();
        return "✅ Cadastro de Voluntária realizado com sucesso!";
    } else {
        // Loga o erro exato no servidor, mas exibe uma mensagem genérica para o usuário
        error_log("Erro na execução SQL (voluntarias): " . $stmt->error);
        $stmt->close();
        return "❌ Erro interno ao cadastrar Voluntária. Tente novamente.";
    }
}

// Observação: Não fechamos a conexão aqui, pois ela é fechada na lógica principal
// após a execução do switch (linha 47).
?>