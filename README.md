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
            "name": "Nome do Usuário"
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
    * **401 Unauthorized:** Se as credenciais forem inválidas (usuário não encontrado ou senha incorreta).

### 6. Logout

* **Método:** POST
* **Rota:** `/logout`
* **Descrição:** Faz o logout do usuário, removendo o cookie de autorização.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Respostas:**
    * **204 No Content:** Logout bem-sucedido. O cookie `authorizationToken` é limpo.
    * **401 Unauthorized:** Se o cookie `authorizationToken` não for fornecido ou for inválido.

---

## Rotas de Refeições

**Prefixo da Rota:** `/meals`

**Autenticação:** Todas as rotas de refeições exigem autenticação. O cookie `authorizationToken` deve ser enviado em
todas as requisições.

---

### 1. Criar Refeição

* **Método:** POST
* **Rota:** `/`
* **Descrição:** Cria uma nova refeição para o usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Corpo da Requisição:**
    ```json
    {
        "name": "Nome da Refeição",
        "description": "Descrição da Refeição",
        "isOnDiet": true 
    }
    ```
* **Respostas:**
    * **201 Created:** Refeição criada com sucesso (sem corpo na resposta).
    * **403 Forbidden:** Se o usuário não estiver autenticado.

### 2. Listar Refeições

* **Método:** GET
* **Rota:** `/`
* **Descrição:** Retorna uma lista de todas as refeições do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Respostas:**
    * **200 OK:**
        ```json
        {
          "meals": [
            {
              "mealId": "uuid",
              "name": "Nome da Refeição",
              "description": "Descrição da Refeição",
              "isOnDiet": true,
              "createdAt": "2023-10-26T12:00:00Z" 
            }
            // ... mais refeições
          ]
        }
        ```
    * **403 Forbidden:** Se o usuário não estiver autenticado.
    * **404 Not Found:** Se o usuário não tiver nenhuma refeição cadastrada.

### 3. Obter Refeição por ID

* **Método:** GET
* **Rota:** `/:mealId`
* **Descrição:** Retorna uma refeição específica do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Parâmetros da Rota:**
    * `mealId` (UUID): ID da refeição.
* **Respostas:**
    * **200 OK:**
        ```json
        {
          "meal": {
            "mealId": "uuid",
            "name": "Nome da Refeição",
            "description": "Descrição da Refeição",
            "isOnDiet": true,
            "createdAt": "2023-10-26T12:00:00Z" 
          }
        }
        ```
    * **403 Forbidden:** Se o usuário não estiver autenticado.
    * **404 Not Found:** Se a refeição não for encontrada.

### 4. Atualizar Refeição

* **Método:** PUT
* **Rota:** `/:mealId`
* **Descrição:** Atualiza uma refeição específica do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Parâmetros da Rota:**
    * `mealId` (UUID): ID da refeição.
* **Corpo da Requisição:**
    ```json
    {
        "name": "Novo Nome da Refeição", // opcional
        "description": "Nova Descrição da Refeição", // opcional
        "isOnDiet": false // opcional
    }
    ```
* **Respostas:**
    * **200 OK:**
        ```json
        {
          "message": "Meal successfully updated" 
        }
        ```
    * **403 Forbidden:** Se o usuário não estiver autenticado.
    * **404 Not Found:** Se a refeição não for encontrada.

### 5. Deletar Refeição

* **Método:** DELETE
* **Rota:** `/:mealId`
* **Descrição:** Deleta uma refeição específica do usuário autenticado.
* **Headers:**
    * `Cookie`: `authorizationToken=token_de_autorizacao`
* **Parâmetros da Rota:**
    * `mealId` (UUID): ID da refeição.
* **Respostas:**
    * **204 No Content:** Refeição deletada com sucesso.
    * **403 Forbidden:** Se o usuário não estiver autenticado.
    * **404 Not Found:** Se a refeição não for encontrada. 
