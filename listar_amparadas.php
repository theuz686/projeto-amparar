<?php
// Inclui o arquivo de conexão
require_once 'conexao.php';

$sql = "SELECT id, nome, data_nascimento, email, numero_sid FROM amparadas";
$resultado = $conn->query($sql);

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de Amparadas</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #ff69b4; color: white; }
    </style>
</head>
<body>
    <h2>Lista de Pessoas Amparadas Cadastradas</h2>
    <a href="cadastros.html">Voltar para a Página de Cadastros</a>

    <?php if ($resultado->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Nascimento</th>
                    <th>Email</th>
                    <th>SID</th>
                </tr>
            </thead>
            <tbody>
                <?php while($linha = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td><?= $linha['id'] ?></td>
                        <td><?= $linha['nome'] ?></td>
                        <td><?= $linha['data_nascimento'] ?></td>
                        <td><?= $linha['email'] ?></td>
                        <td><?= $linha['numero_sid'] ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Nenhuma pessoa amparada encontrada no banco de dados.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>