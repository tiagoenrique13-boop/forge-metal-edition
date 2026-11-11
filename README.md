# FORGE 1.3.1 — Backup & Transferência

Adiciona exportação/importação de backup JSON para transferir os dados entre Safari e o app instalado no iPhone.

O backup inclui:
- Rotinas e exercícios
- Biblioteca, fichas e links de vídeos
- Histórico e avaliações
- Sessão ativa, se houver

Como transferir:
1. No Safari, abra o FORGE 1.3.1 e toque em Início > Exportar Backup.
2. Salve o arquivo JSON no app Arquivos.
3. Abra o FORGE instalado na tela inicial, atualize-o para 1.3.1 e toque em Importar Backup.
4. Selecione o JSON salvo no app Arquivos e confirme.

Importante:
- O processo cria um backup dos dados locais de destino antes de importar.
- O import substitui os dados locais do app de destino pelo conteúdo do arquivo.
- Não limpe os dados do Safari nem desinstale o app antes de exportar.
- Mantém a chave `forge-metal-v1`.
- Não substitua `manifest.webmanifest` nem `assets/icon.svg` ao atualizar.
