# Buy Things – Loja Online  
**SCC0219 - Introdução ao Desenvolvimento Web • 1º sem/2025**

## Equipe
| Integrante | Nº USP |
|------------|--------|
| Bruno Kazuya Yamato Sakaji | 14562466 |
| Guilherme Pacheco de Oliveira Souza | 11797091 |
| Leonardo Marangoni | 14747614 |

---

## 1 • Requisitos

| Código | Descrição|
|--------|-----------|
| R-01 | Exibir catálogo de produtos com preço e imagem |
| R-02 | Exibir resumo do pedido (subtotal, frete, desconto, total) |
| R-03 | Navegação entre Home → Produtos → Carrinho |
| R-04 | Layout responsivo (mobile-first) |

---

## 2 • Descrição do Projeto

### 2.1 Visão geral
*BuyThings* uma loja online feita em React. O objetivo nessa etapa é de criar toda a interface e funcionalidade do lado do cliente.


### 2.2 Estrutura do projeto
```
├── capturas
│   ├── adm1.png
│   ├── cadastro.png
│   ├── carrinho.png
│   ├── contato.png
│   ├── home1.png
│   ├── home2.png
│   ├── home3.png
│   ├── login.png
│   ├── produtos1.png
│   ├── produtos2.png
│   ├── sobre.png
│   ├── user.png
├── milestone1
│   ├── css
│   │   ├── estilo.css
│   ├── img
│   │   ├── diagrama.jpg
│   │   ├── image.png
│   │   ├── produto1.avif
│   │   ├── produto2.avif
│   │   ├── produto3.avif
│   │   ├── produto4.avif
│   │   ├── produto5.avif
│   │   ├── produto6.avif
│   ├── javascript
│   │   ├── script.js
│   ├── carrinho.html
│   ├── index.html
│   ├── products.html
├── public
|   ├── img
│   ├── favicon.ico
├── src
│   ├── App.jsx
│   ├── components
│   ├── pages
│   ├── contexts
│   ├── index.css
│   ├── main.jsx
├── readme.md
```
A estrutura do repositório foi concebida para refletir a evolução do protótipo estático em HTML/CSS/JS para uma aplicação React organizada e escalável. Na raiz, temos duas pastas históricas: capturas/, que armazena todas as screenshots e mockups do protótipo inicial, e milestone1/, onde residem as páginas estáticas (index.html, products.html, carrinho.html) acompanhadas de seus arquivos de estilo (em css/) e de comportamento em JavaScript (em javascript/), além das imagens de produto em milestone1/img/ e do diagrama de navegação.

A pasta public/ é reservada aos ativos estáticos que serão servidos diretamente pelo build do React — como o favicon, imagens de produto e eventuais arquivos que não passam pelo bundler. Já o coração da aplicação em React está em src/, com seu ponto de entrada e roteamento (main.jsx). Dentro de src/contexts/ ficam os providers de estado global (por exemplo, de produtos, de usuário e de carrinho), enquanto src/components/ concentra todos os blocos de interface reutilizáveis (Navbar, Footer, ProductCard, formulários etc.) e src/pages/ reúne cada view de rota (Home, Produtos, Detalhe de Produto, Carrinho e 404).

Esse layout modular permite reuso consistente entre as páginas, separando claramente lógica de dados (nos contexts) e apresentação (nos componentes), e facilita tanto a manutenção quanto a adição de novas funcionalidades sem comprometer a organização do código.

> *Observação:* todas as imagens de snapshots do prototipo estão em `capturas/` na raiz do projeto.


### 2.2 Diagrama de Navegação
![Diagrama de navegação](milestone1/img/diagrama.jpg)

## 3 • Sobre o projeto

### 3.1 Como instalar
- Node.js ≥ 14 
- git clone https://github.com/BrunoKazuya/web_e-commerce
- cd web_e-commerce
- npm install
- npm run dev

Pronto com isso você pode acessar no navegador http://localhost:5173

### 3.2 Tipos de usuario

| Tipo de usuário | Descrição |
|-----------------|-----------|
| Visitante | Ele consegue navegar pelas paginas home, produtos, sobre, contato, pagina do produto e autenticação. Ele não consegue adicionar itens ao carrinho e não efetua compra |
| Cliente | Para ser esse tipo de usuário basta criar uma conta. Ele pode adicionar itens ao carrinho e efetuar compras, além disso ele pode editar o seu perfil |
| Administrador | Por padrão existe um administrador para acessar basta fazer o login com o email: admin@admin.com e a senha: admin. Ele pode acessar a dashboard onde pode gerenciar a loja, adicionando, atualizando e deletando produtos e pode adicionar usuário, atualizar a permissão dele e também pode deletar |

### 3.3 LocalStorage
O aplicativo faz uso do localStorage para persistir toda a informação necessária entre sessões, incluindo:

- loggedIn: flag booleana que indica se há um usuário autenticado.

- user: objeto JSON com os dados do usuário atualmente logado (nome, e-mail, papel etc.).

- products: array de objetos que representa o catálogo de produtos da loja.

- users: array de objetos que contém todos os perfis de usuário cadastrados no sistema.

Sempre que o usuário faz login, adiciona itens ao carrinho ou edita seu perfil, nós atualizamos esses itens no localStorage, garantindo que a aplicação possa recarregar o estado completo caso o navegador seja fechado ou a página seja atualizada.

## 4 • Funcionalidades

| Funcionalidade | Descrição |
|-----------------|-----------|
| Adicionar ao carrinho | É póssivel adicionar itens ao carrinho e mudar a quantidade deles (o mínimo é 1 e o máximo é quantidade em estoque) |
| Realizar compra | É possível realizar a "compra" dos itens no carrinho, com a diminuição da quantidade em estoque dos itens comprados |	
| Gerenciar produto | O administrador pode adicionar, atualizar e remover produtos do catálogo |
| Gerenciar usuário | O administrador pode adicionar, atualizar apenas a permissão e remover usuários do sistema |
| Editar perfil | O cliente pode editar o seu perfil, mudando o nome, email e senha |
| Autenticação | O cliente pode se autenticar no sistema, com o email e senha, e também pode se cadastrar |
| Dashboard | O administrador pode acessar a dashboard onde pode gerenciar os produtos e usuários |
|Filtro de produtos | É possível filtrar os produtos por categoria, nome e preço |


