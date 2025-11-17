<?php
require_once 'conexao.php';
$sql = "SELECT id, nome, email, descricao_necessidades FROM acolhidas";
$resultado = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de Acolhidas</title>
    <style> /* Estilos omitidos por serem os mesmos */ </style>
</head>
<body>
    <h2>Lista de Pessoas Acolhidas Cadastradas</h2>
    <a href="cadastros.html">Voltar para a Página de Cadastros</a>

    <?php if ($resultado->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Necessidades</th>
                </tr>
            </thead>
            <tbody>
                <?php while($linha = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td><?= $linha['id'] ?></td>
                        <td><?= $linha['nome'] ?></td>
                        <td><?= $linha['email'] ?></td>
                        <td><?= $linha['descricao_necessidades'] ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Nenhuma pessoa acolhida encontrada no banco de dados.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>