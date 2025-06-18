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


## 5 • Testes de erro
| Nº | Módulo           | Caso de Teste                          | Descrição                                                 | Resultado Esperado                                                |
| -- | ---------------- | -------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| 1  | Registro Usuário | Cadastro com dados válidos             | Preencher todos os campos obrigatórios e enviar           | Usuário cadastrado com sucesso                                    |
| 2  | Registro Usuário | Cadastro com e-mail já existente       | Tentar cadastrar com e-mail já usado                      | Exibir mensagem "Email já cadastrado"                             |
| 3  | Registro Usuário | Cadastro com telefone inválido         | Número fora do formato (xx)xxxxxxxxx com 10 ou 11 dígitos | Exibir mensagem "Telefone inválido, precisa de 10 ou 11 dígitos"  |
| 4  | Registro Usuário | Cadastro com data de nascimento futura | Informar data futura                                      | Exibir mensagem "Data de nascimento inválida"                     |
| 5  | Registro Usuário | Cadastro com idade > 200               | Informar data de nascimento com mais de 200 anos          | Exibir mensagem "Idade inválida"                                  |
| 6  | Registro Usuário | Cadastro com peso inumano              | Exemplo: peso > 300kg ou <= 0kg                           | Exibir mensagem "Peso inválido"                                   |
| 7  | Registro Usuário | Cadastro com endereço sem número       | Deixar campo número vazio                                 | Exibir mensagem "Número obrigatório"                              |
| 8  | Registro Usuário | Cadastro com CEP inválido              | CEP fora do formato ou inexistente                        | Exibir mensagem "CEP inválido"                                    |
| 9  | Login            | Login com credenciais válidas          | Informar e-mail e senha corretos                          | Login bem-sucedido                                                |
| 10 | Login            | Login com senha errada                 | Senha incorreta                                           | Exibir mensagem "E-mail ou senha inválidos"                       |
| 11 | Login            | Login com e-mail inválido              | E-mail fora do formato                                    | Exibir mensagem "E-mail inválido"                                 |
| 12 | Produtos         | Listagem de produtos                   | Acessar página inicial                                    | Produtos carregados                                               |
| 13 | Produtos         | Filtro por categoria                   | Selecionar uma categoria                                  | Produtos da categoria aparecem                                    |
| 14 | Produtos         | Buscar produto existente               | Buscar por nome válido                                    | Produto aparece                                                   |
| 15 | Produtos         | Buscar produto inexistente             | Buscar termo que não existe                               | Exibir mensagem "Nenhum produto encontrado"                       |
| 16 | Produtos         | Buscar por tag correta                 | Buscar por tag válida                                     | Produtos com a tag aparecem                                       |
| 17 | Produtos         | Buscar por tag inexistente             | Buscar por tag inválida                                   | Exibir mensagem "Nenhum produto encontrado"                       |
| 18 | Carrinho         | Adicionar item ao carrinho             | Clicar em "Adicionar"                                     | Produto adicionado                                                |
| 19 | Carrinho         | Adicionar quantidade negativa          | Inserir quantidade negativa                               | Não permitir adicionar quantidade negativa                        |
| 20 | Carrinho         | Adicionar além do estoque              | Inserir quantidade maior que o estoque disponível         | Não permitir quantidade acima do estoque                          |
| 21 | Carrinho         | Remover item                           | Clicar em "Remover"                                       | Item removido                                                     |
| 22 | Carrinho         | Atualizar quantidade                   | Alterar quantidade de um item                             | Total recalculado                                                 |
| 23 | Endereço         | Adicionar endereço válido              | Preencher CEP, número, complemento                        | Endereço salvo                                                    |
| 24 | Endereço         | Adicionar CEP inválido                 | CEP inexistente ou formato inválido                       | Exibir mensagem "CEP não encontrado"                              |
| 25 | Endereço         | Remover endereço                       | Clicar em "Remover"                                       | Endereço deletado                                                 |
| 26 | Pagamento        | Adicionar cartão válido                | Preencher dados corretos (passar no Luhn)                 | Cartão salvo                                                      |
| 27 | Pagamento        | Adicionar cartão com letras            | Inserir letras no campo número                            | Não permitir letras                                               |
| 28 | Pagamento        | Adicionar cartão inválido (Luhn)       | Número que não passa na validação de Luhn                 | Exibir mensagem "Número de cartão inválido"                       |
| 29 | Pagamento        | Data de expiração no passado           | Data anterior à data atual                                | Exibir mensagem "Cartão expirado"                                 |
| 30 | Pagamento        | Data de expiração muito no futuro      | Mais de 15 anos no futuro                                 | Exibir mensagem "Ano muito no futuro"                             |
| 31 | Pagamento        | Mês inválido na validade               | Mês maior que 12 ou menor que 1                           | Exibir mensagem "Mês inválido"                                    |
| 32 | Pagamento        | CVV inválido                           | Menos de 3 ou mais de 4 dígitos                           | Exibir mensagem "CVV inválido"                                    |
| 33 | Pagamento        | Remover cartão                         | Clicar em "Remover"                                       | Cartão removido                                                   |
| 34 | Pedido           | Finalizar pedido                       | Escolher endereço e cartão                                | Pedido criado                                                     |
| 35 | Pedido           | Ver histórico de pedidos               | Ir em "Meus Pedidos"                                      | Listagem de pedidos                                               |
| 36 | Upload Imagem    | Upload de imagem                       | Fazer upload via admin                                    | Imagem salva                                                      |
| 37 | API              | GET /api/products                      | Testar rota GET                                           | Resposta JSON com lista de produtos                               |
| 38 | API              | POST /api/users/login                  | Fazer POST com credenciais válidas                        | Token JWT recebido                                                |
| 39 | API              | CORS na porta 5173                     | Acessar front-end conectado ao back-end                   | Sem erro CORS                                                     |
| 40 | Integração       | Fluxo completo                         | Cadastro → Login → Compra                                 | Fluxo sem falha                                                   |
| 41 | Admin            | Adicionar produto                      | Nome, preço, quantidade, categoria, descrição, imagem     | Produto adicionado                                                |
| 42 | Admin            | Remover produto                        | Clicar em remover                                         | Produto deletado                                                  |
| 43 | Admin            | Editar produto                         | Alterar informações                                       | Produto atualizado                                                |
| 44 | Admin            | Preço negativo                         | Tentar cadastrar preço <= 0                               | Exibir mensagem "O preço deve ser maior que R\$ 0,00"             |
| 45 | Admin            | Quantidade negativa                    | Tentar cadastrar quantidade negativa                      | Exibir mensagem "O estoque não pode ser negativo"                 |
| 46 | Admin            | Descrição com menos de 10 caracteres   | Inserir descrição curta                                   | Exibir mensagem "A descrição precisa ter no mínimo 10 caracteres" |
| 47 | Admin            | Categoria em branco                    | Não selecionar categoria                                  | Exibir mensagem "Você deve selecionar uma categoria"              |
| 48 | Admin            | Imagem do produto ausente              | Não enviar imagem                                         | Exibir mensagem "A imagem do produto é obrigatória"               |
| 49 | Admin            | Adicionar cliente                      | Preencher formulário                                      | Cliente adicionado                                                |
| 50 | Admin            | Remover cliente                        | Clicar em remover                                         | Cliente removido                                                  |
| 51 | Admin            | Editar cliente                         | Alterar dados                                             | Cliente atualizado                                                |
| 52 | Admin            | Adicionar admin                        | Preencher dados admin                                     | Admin criado                                                      |
| 53 | Admin            | Remover admin                          | Remover admin                                             | Admin removido                                                    |
