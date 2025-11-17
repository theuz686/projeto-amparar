<?php
require_once 'conexao.php';
$sql = "SELECT id, nome, email, area_atuacao, disponibilidade FROM voluntarias";
$resultado = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de Voluntárias</title>
    <style> /* Estilos omitidos por serem os mesmos */ </style>
</head>
<body>
    <h2>Lista de Voluntárias Cadastradas</h2>
    <a href="cadastros.html">Voltar para a Página de Cadastros</a>

    <?php if ($resultado->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Área de Atuação</th>
                    <th>Disponibilidade</th>
                </tr>
            </thead>
            <tbody>
                <?php while($linha = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td><?= $linha['id'] ?></td>
                        <td><?= $linha['nome'] ?></td>
                        <td><?= $linha['email'] ?></td>
                        <td><?= $linha['area_atuacao'] ?></td>
                        <td><?= $linha['disponibilidade'] ?></td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Nenhuma voluntária encontrada no banco de dados.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>