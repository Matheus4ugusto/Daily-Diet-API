# Documentação da API

## Rotas de Usuários

**Prefixo da Rota:** `/users`

---

### 1. Criar Usuário

* **Método:** POST
* **Rota:** `/`
* **Descrição:** Cria um novo usuário e define um cookie de autorização.
* **Corpo da Requisição:**
    ```json
    {
        "email": "usuario@email.com",
        "password": "senha_segura",
        "name": "Nome do Usuário"
    }
    ```
* **Respostas:**
    * **201 Created:** Usuário criado com sucesso (sem corpo na resposta). Um cookie `authorizationToken` é definido com
      um token aleatório.

### 2. Obter Informações do Usuário

* **Método:** GET
* **Rota:** `/`
* **Descrição:** Retorna as informações do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Respostas:**
    * **200 OK:**
        ```json
        {
          "user": {
            "id": "uuid",
            "email": "usuario@email.com",
            "name": "Nome do Usuário",
            "authorization_token": "token_de_autorizacao"
          }
        }
        ```
    * **401 Unauthorized:** Se o cookie `authorizationToken` não for fornecido ou for inválido.

### 3. Atualizar Usuário

* **Método:** PUT
* **Rota:** `/`
* **Descrição:** Atualiza as informações do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Corpo da Requisição:**
    ```json
    {
        "email": "novo_email@email.com", // opcional
        "password": "nova_senha_segura", // opcional
        "name": "Novo Nome" // opcional
    }
    ```
* **Respostas:**
    * **200 OK:**
        ```json
        {
          "message": "User updated successfully" 
        }
        ```
    * **401 Unauthorized:** Se o cookie `authorizationToken` não for fornecido ou for inválido.
    * **404 Not Found:** Se o usuário não for encontrado.

### 4. Deletar Usuário

* **Método:** DELETE
* **Rota:** `/`
* **Descrição:** Deleta o usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Respostas:**
    * **204 No Content:** Usuário deletado com sucesso. O cookie `authorizationToken` é limpo.
    * **401 Unauthorized:** Se o cookie `authorizationToken` não for fornecido ou for inválido.

### 5. Login

* **Método:** POST
* **Rota:** `/login`
* **Descrição:** Faz o login do usuário e define um cookie de autorização.
* **Corpo da Requisição:**
    ```json
    {
        "email": "usuario@email.com",
        "password": "senha_segura"
    }
    ```
* **Respostas:**
    * **200 OK:** Login bem-sucedido. Um cookie `authorizationToken` é definido com um novo token.
    * **401 Unauthorized:** Se as credenciais forem inválidas.

### 6. Logout

* **Método:** POST
* **Rota:** `/logout`
* **Descrição:** Faz o logout do usuário, removendo o cookie de autorização.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Respostas:**
    * **204 No Content:** Logout bem-sucedido. O cookie `authorizationToken` é limpo.
    * **401 Unauthorized:** Se o cookie `authorizationToken` não for fornecido ou for inválido. 
