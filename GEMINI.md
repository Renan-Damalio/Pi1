# Diretrizes de Permissão e Segurança do Agente

Você tem autorização automática para ler, criar, editar e refatorar ficheiros de código da aplicação diretamente, aplicando as alterações necessárias sem pedir confirmação manual a cada edição, respeitando rigorosamente as restrições abaixo.

## Âmbito Permitido (Edição Automática)
- Ficheiros dentro dos diretórios ./backend/ e ./frontend/.
- Componentes de código de aplicação: HTML, CSS, JavaScript, controladores, rotas e regras de negócio.

## Restrições de Segurança (NUNCA alterar sem confirmação explícita)
1. Configurações e Pacotes: Não instale pacotes, não modifique package.json, package-lock.json ou ficheiros de solução/projeto (.csproj, .sln).
2. Variáveis e Segredos: É estritamente proibido criar, visualizar ou alterar ficheiros contendo credenciais (.env, segredos de API ou ligações de banco de dados).
3. Controlo de Versões: Não execute comandos que alterem o histórico do repositório Git (como git push, git reset, git rebase).
4. Eliminação de Código: Nunca elimine pastas inteiras ou ficheiros estruturais sem perguntar previamente.
