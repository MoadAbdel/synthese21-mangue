# synthese21-mangue

API de gestion de comptes bancaires et de lignes de compte

## Prérequis

- Node.js
- Une instance MongoDB (locale ou Atlas)

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine avec :

| Variable      | Description                        |
| ------------- | ----------------------------------- |
| `MONGODB_URI` | URI de connexion MongoDB            |
| `JWT_SECRET`  | Secret de signature des tokens JWT  |
| `PORT`        | Port d'écoute du serveur            |

## Lancement

```bash
npm run dev    # avec rechargement automatique (nodemon)
npm start      # production
```

## Routes

| Méthode | Route                                                    | Description                                   |
| ------- | --------------------------------------------------------- | ---------------------------------------------- |
| POST    | `/api/auth/register`                                       | Inscription d'un utilisateur                   |
| POST    | `/api/auth/login`                                           | Connexion                                      |
| POST    | `/api/accounts`                                             | Créer un compte bancaire                       |
| GET     | `/api/accounts`                                             | Lister ses comptes avec solde calculé          |
| GET     | `/api/accounts/global-balance`                              | Solde cumulé de tous ses comptes               |
| PUT     | `/api/accounts/:accountId`                                  | Modifier un de ses comptes                     |
| DELETE  | `/api/accounts/:accountId`                                  | Supprimer un de ses comptes (cascade)          |
| POST    | `/api/accounts/:accountId/transactions`                     | Ajouter une transaction sur un compte          |
| GET     | `/api/accounts/:accountId/transactions`                     | Voir les transactions d'un compte + son solde  |
| GET     | `/api/accounts/:accountId/transactions/pending`             | Transactions "à venir" d'un compte             |
| GET     | `/api/accounts/:accountId/transactions/populated`           | Transactions avec détails du compte parent     |
| PUT     | `/api/accounts/:accountId/transactions/:transactionId`      | Modifier une transaction                       |
| DELETE  | `/api/accounts/:accountId/transactions/:transactionId`      | Supprimer une transaction                      |
