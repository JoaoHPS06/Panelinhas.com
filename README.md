# 🍳 Panelinhas.com

> Plataforma de comunidade para lojas locais — descubra, siga e interaja com os seus estabelecimentos favoritos.
---

## 💡 Ideia geral do projeto

O **Panelinhas.com** nasceu da ideia de unir o melhor de um marketplace de lojas locais com o engajamento de uma rede social. Assim como aplicativos de delivery conectam clientes a restaurantes, o Panelinhas conecta pessoas a **todo tipo de loja local**, mas com um diferencial: cada loja tem sua própria comunidade.

Qualquer visitante pode navegar pelas lojas, ver produtos e ler publicações sem precisar criar uma conta. Quem se cadastra pode seguir lojas, deixar avaliações e participar das comunidades. Donos de loja têm um painel completo para gerenciar seu espaço, publicar ofertas e novidades, cadastrar produtos e responder aos clientes.

---

## 📋 Descrição geral do sistema

O sistema é dividido em dois grandes perfis de uso:

**Visitante (sem login)**
- Navegar pelo catálogo de lojas com filtros por categoria
- Visualizar o perfil completo de cada loja: posts, produtos, avaliações e comunidade
- Buscar lojas e produtos por nome

**Usuário cadastrado**
- Tudo que o visitante pode fazer, mais:
- Seguir lojas e receber novidades
- Deixar avaliações com nota e comentário
- Participar da comunidade de cada loja (perguntas e respostas)

**Dono de loja**
- Tudo que o usuário cadastrado pode fazer, mais:
- Criar e gerenciar o perfil da loja (nome, categoria, descrição, foto)
- Publicar posts de ofertas, novidades e informações gerais (CRUD completo)
- Cadastrar, editar e remover produtos do catálogo (CRUD completo)
- Responder perguntas da comunidade com badge de "Dono"

### Funcionalidades principais

| Módulo | Descrição |
|---|---|
| Autenticação | Cadastro, login e logout com JWT |
| Lojas | CRUD completo do perfil da loja |
| Posts | Publicação de ofertas e novidades com imagem |
| Produtos | Catálogo de produtos com nome, descrição e preço |
| Avaliações | Nota de 1 a 5 estrelas com comentário |
| Comunidade | Perguntas ao dono com sistema de resposta |
| Feed público | Listagem e busca de lojas sem necessidade de login |

---

## 🛠️ Tecnologias utilizadas

**Frontend**
- React.js — biblioteca para construção da interface
- Tailwind CSS — estilização
- Typescript - lógica

**Backend**
- Python — linguagem principal do servidor
- Django — framework web

**Banco de dados**
- SQLite
---

## 👥 Integrantes da equipe

| Nome | GitHub |
|---|---|
| Gabriel Vilas Novas Sousa | https://github.com/vilas000 |
| João Henrique Pedrosa de Souza | https://github.com/JoaoHPS06 |
| Leonardo de Souza Gomes | https://github.com/Leonardo2716ba |
| Marcus Vinícius Araújo | https://github.com/MarcusViniAraujo |
| Renato Franco Anacleto | https://github.com/RenatoFAnacleto |

---

## 📌 Quadro Kanban

O acompanhamento das tarefas e o planejamento das sprints estão disponíveis no quadro abaixo:

🔗 [Acessar quadro Kanban](https://github.com/users/JoaoHPS06/projects/2)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como trabalho da disciplina de Programação Web.
