# Funcionários para cadastrar em `/admin/funcionarios`

Lista extraída da antiga `src/data/setores.ts`, na ordem em que aparecia no site.
Os funcionários não são mais exibidos a partir do código: cada setor fica vazio até
o cadastro ser feito na tela de administração.

- **WhatsApp**: digite o número como está na tabela (DDD + número). O sistema adiciona o `55` sozinho.
- **Foto**: os arquivos continuam em `public/assets/images/funcionarios/`. Envie-os pelo botão de upload; depois de cadastrar todos, a pasta pode ser apagada (mantenha `agente.webp`, que é a foto padrão de quem não tem foto).
- **Posição**: use o número da coluna para manter a ordem atual, ou deixe em branco para ir ao fim da lista.

## Setor de Móveis (`moveis`)

| Posição | Nome | Cargo | WhatsApp | Foto |
|---|---|---|---|---|
| 1 | Elizângela | Atendente | 68999588960 | `funcionarios/moveis/ELISANGELA.webp` |
| 2 | Jamesson | Atendente | 68992258077 | `funcionarios/moveis/JAMISSON.webp` |
| 3 | Lerivaldo | Atendente | 68992271502 | `funcionarios/moveis/LERIVALDO.webp` |
| 4 | Vanda | Atendente | 68999435942 | `funcionarios/moveis/VANDA.webp` |

## Confecção e Calçados (`confeccao`)

| Posição | Nome | Cargo | WhatsApp | Foto |
|---|---|---|---|---|
| 1 | Denyse | Atendente | 6892370253 | `funcionarios/confeccao/DENYSE.webp` |
| 2 | Fabíola | Atendente | 6896010998 | `funcionarios/confeccao/FABIULA.webp` |
| 3 | Maria Francisca | Atendente | 6899698627 | `funcionarios/confeccao/FRANCISCA.webp` |
| 4 | Janaira | Atendente | 6899575870 | `funcionarios/confeccao/JANAIRA.webp` |
| 5 | Mônica | Atendente | 6884035185 | `funcionarios/confeccao/MONICA.webp` |
| 6 | Zenaide | Atendente | 6899974483 | `funcionarios/confeccao/ZENAIDE.webp` |
| 7 | Maria José | Atendente | 6899335255 | `funcionarios/confeccao/MARIA.webp` |

Os números deste setor estavam cadastrados com 8 dígitos após o DDD (sem o 9 inicial).
Mantive como estavam, porque é assim que os links funcionam hoje.

## Tecidos, Cama, Mesa e Banho (`tecidos`)

| Posição | Nome | Cargo | WhatsApp | Foto |
|---|---|---|---|---|
| 1 | Conceição | Atendente | 68999336589 | `funcionarios/tecidos/CONCEICAO.webp` |
| 2 | Damiana | Atendente | 68999147854 | `funcionarios/tecidos/DAMIANA.webp` |
| 3 | Sumaya | Atendente | 68992244656 | `funcionarios/tecidos/SUMAYA.webp` |
| 4 | Auxiliadora | Atendente | 6899840078 | sem foto própria (usava `funcionarios/agente.webp`) |

## Pagamentos de Faturas (`pagamento`)

| Posição | Nome | Cargo | WhatsApp | Foto |
|---|---|---|---|---|
| 1 | Financeiro | Atendente | 68992257912 | `funcionarios/faturas/financeiro.webp` |

## Crediários e Negociações (`negociacao`)

| Posição | Nome | Cargo | WhatsApp | Foto |
|---|---|---|---|---|
| 1 | Crediário | Atendente | 68992091053 | `funcionarios/negociacoes/negociacao.webp` |

## Observações

- Total: 17 funcionários.
- Existe a foto `funcionarios/confeccao/DAVID.webp`, mas não havia nenhum "David" na lista. Cadastre só se ele ainda fizer parte da equipe.
- Avaliações antigas continuam aparecendo com o nome correto em `/admin/avaliacoes` (via `src/data/colaboradoresLegado.ts`). Para que avaliações novas e antigas caiam no mesmo filtro, cadastre os nomes exatamente como nesta tabela.
