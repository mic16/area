# Format de Reponses

## En cas d'Erreur

```json
{
    "error": <error message>,
    ...
}
```

## En cas de Succès

```json
{
    "result": <object>,
    ...
}
```

# Field Types
-  **int**
-  **float**
-  **array**
-  **string**
-  **boolean**

# Routes

Liste de toutes les routes de l'area

| Route                                   | Method   | Description                                                  |
| --------------------------------------- | -------- | ------------------------------------------------------------ |
| `/register`                             | **POST** | Crée un compte utilisateur                                   |
| `/login`                                | **POST** | Permet de se connecter a un compte utilisateur               |
| `/logout`                               | **POST** | Permet de se déconnecter d'un compte utilisateur             |
| `/services`                             | **GET**  | Liste les services                                           |
| `/services/<serviceNames>`              | **GET**  | Liste les actions et reactions des services avec les configs |
| `/services/<serviceNames>/<actionName>` | **POST** | Liste toutes les reactions compatibles avec l'action         |
| `/area/create`                          | **POST** | Crée une area                                                |
| `/area/delete`                          | **POST** | Supprime une area                                            |
| `/about.json`                           | **GET**  | Renvoie des informations sur tout les services               |

## **[`POST`]** /register
Crée un compte utilisateur

### Request Body

```json
{
  "mail": <user mail>,
  "password": <user password>
}
```

### Response
```json
{
  "result": <user token>
}
```

<hr>

## **[`POST`]** /login
Permet de se connecter a un compte utilisateur

### Request Body

```json
{
  "mail": <user mail>,
  "password": <user password>
}
```

### Response
```json
{
  "result": <user token>
}
```

<hr>

## **[`POST`]** /logout
Permet de se deconnecter d'un compte utilisateur

### Request Body
```json
{
  "token": <user token>
}
```

### Response

#### Logout success
```json
{
  "result": "you are disconnected"
}
```
#### Logout fail
```json
{
  "error": <error message>
}
```
<hr>

## **[`GET`]** /services
Retourne une liste de tout les services disponibles

```json
{
    "result": ["Twitter", ...],
    ...
}
```

<hr>

## **[`GET`]** /services/\<serviceName> 
Retourne un objet qui décrit les différentes actions et réactions possibles

```json
{
  "result": {
    "actions": [
      {
        "name": <action name>,                    // Nom de l'action
        "description": <action description>,      // Description de ce que fait l'action
        "fields": [                               // Champs servant a configurer le fonctionnement de l'action
          {
            "name": <field name>,                     // Nom du champs
            "description": <field description>,       // Description de ce a quoi sert le champs
            "type": <field type>                      // Type de champs
          }, 
          ...
        ]
      },
      ...
    ], 
    "reactions": [
      {
        "name": <reaction name>,                  // Nom de la reaction
        "description": <reaction description>,    // Description de ce que fait la reaction
        "fields": [...],                          // Champs servant a configurer le fonctionnement de la reaction
      },
      ...
    ]
  }
}
```

<hr>

## **[`POST`]** /services/\<serviceName>/\<actionName>
Retourne une liste de tout les reactions possible pour une action d'un service donné

### Request Body

Il faut passer la configuration de l'action dans le body de la requête
car une même route peu réagir différement en fonction de sa configuration
et interagir avec des widget différent

```json
{
  "<field name>": <field value>,
  "<field name>": <field value>,
  ...
}
```

### Response

```json
    "result": {
        "<service name>": [
            {
              "name": <reaction name>,
              "description": <reaction description>,
            },
            ...
        ]
    }
```

<hr>

## **[`POST`]** /area/create

Crée une area avec la configuration spécifiée

### Request Body

```json
{
    "action": {
        "service": <service name>,
        "name": <action name>,
        "config": {
            "<field name>": <field value>,
            ...
        }
    },
    "reaction":  {
        "service": <service name>,
        "name": <reaction name>,
        "config": {
          "<field name>": <field value>,
          ...
        }
    },
    "token": <user token>
}
```

### Response

```json
{
  "result": <area uuid>
}
```

<hr>

## **[`POST`]** /area/delete

Supprime une area

### Request Body

```json
{
  "token": <user token>,
  "uuid": <area uuid>,
}
```

### Response


#### Area delete success
```json
{
  "result": <success message>
}
```
#### Area delete fail

```json
{
  "error": <error message>
}
```
