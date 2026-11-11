# FORGE 1.3 — Exercise Library

Novidades:
- Biblioteca de exercícios integrada aos treinos existentes.
- Ficha por exercício: músculos, equipamento, execução, erros comuns e observações pessoais.
- Associação de um vídeo do YouTube por exercício, com player incorporado e link externo.
- Busca direcionada no YouTube priorizando Paulo Muzy, Léo Marinho e Renato Cariani; opção de buscar outros profissionais.
- O usuário escolhe e cola o link do vídeo. Nenhuma API key é exposta no navegador.

Compatibilidade:
- Mantém a chave LocalStorage `forge-metal-v1`.
- Mantém os registros de treinos, medidas, histórico e sessão ativa.
- Os dados novos ficam em `exerciseLibrary`, dentro do mesmo armazenamento local.
- Não apague dados do Safari nem desinstale o PWA para atualizar.

Atualização no GitHub:
Substitua `index.html`, `css/theme-metal.css` e `js/app.js`. Mantenha `manifest.webmanifest` e `assets/icon.svg` atuais.
