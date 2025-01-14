# Trade AI - Gerador de Sinais de Operações Binárias

<p align="center">
  <img src="https://i.postimg.cc/y8rmY69S/logo.png" alt="Trade AI Logo" width="400" />
</p>

Trade AI é um projeto para gerar sinais de operações binárias. Ele fornece informações sobre ativos, probabilidades de vitória, horários de execução e tipos de operações (Call/Put).

## Funcionalidades Principais

- **Geração de Sinais**: Gera sinais de operações binárias com base em dados simulados.
- **Horário de Execução**: Calcula o próximo horário de execução com base no tempo atual.
- **Probabilidade de Vitória**: Exibe a probabilidade de vitória para cada sinal gerado.
- **Tipo de Operação**: Define se a operação é de compra (Call) ou venda (Put).
- **Bloqueio Temporário**: Impede a geração de novos sinais por 5 minutos após a geração de um sinal.

## Como Usar

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/seu-usuario/trade-ai.git
   cd trade-ai
   ```

2. **Instalar Dependências**:
   ```bash
   pnpm install
   ```

3. **Executar o Projeto**:
   ```bash
   pnpm dev
   ```

4. **Acessar o Projeto**:
   Abra o navegador e acesse `http://localhost:3000`.

## Estrutura do Projeto

- **`SignalGenerator.tsx`**: Componente principal que gerencia a geração de sinais e a interface do usuário.
- **`SingleProgressBar.tsx`**: Componente que exibe uma barra de progresso durante a geração do sinal.
- **`InfoItem.tsx`**: Componente que exibe informações detalhadas sobre o sinal gerado.
- **`InfiniteWaveAnimation.tsx`**: Componente que exibe uma animação de onda infinita no fundo da tela.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Adiciona tipagem estática ao JavaScript para melhorar a qualidade do código.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **Howler.js**: Biblioteca para manipulação de áudio no navegador.

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido por enzodevs (https://github.com/enzodevs).
