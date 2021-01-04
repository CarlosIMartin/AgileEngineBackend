# Agile Engine Backend

## Run the application

1. Navigate to `./agile-engine-backend` directory with your terminal.
2. Execute the following commands: `yarn install` and then `yarn start` (make sure to have yarn installed globally)

## Details

This application was created in Node.js, it allows a user to create Credit and Debit transactions. It uses Typescript. Express, Typedi (DI) and Winston (Logs) are the main libraries.
The application is configured to run on port 3001 by default.

## Endpoints

### Make a Transaction

Allows to make a transaction.

HTTP Method: **POST**

URI: `/account/newTransaction`

Request example:

        {
          "type": "credit",
          "amount": 1000
        }
    
- **type** field could be: "credit" for credit transactions or "debit" for debit transactions.
- **amount** the value of the transaction.

Response example:

        {
          "id": "00142e7d-2795-4d15-a572-ba7c7b11af5d",
          "type": "credit",
          "amount": 1000,
          "effectiveDate": "2021-01-03T23:24:19.812Z"
        }
___
### Account Balance

Shows the balance of the account.

HTTP Method: **GET**

URI: `/account/balance`

Response example:

        {
          "amount": 1000
        }
___
### Account History

Shows all transactions made so far.

HTTP Method: **GET**

URI: `/account/history`

Response example:

        [
          {
            "id": "afa3737c-3cd6-4585-8b5a-56e92b5b9d38",
            "type": "credit",
            "amount": 1000,
            "effectiveDate": "2021-01-03T23:43:25.918Z"
          },
          {
            "id": "9345ddca-68e5-4314-b958-ba173f77429a",
            "type": "credit",
            "amount": 500.4,
            "effectiveDate": "2021-01-03T23:43:33.763Z"
          },
          {
            "id": "60dc7a2c-7bcb-4700-ab40-0edf772cd189",
            "type": "credit",
            "amount": 10.52,
            "effectiveDate": "2021-01-03T23:43:53.826Z"
          },
          {
            "id": "3fabc519-393d-413a-b495-d560f81486b8",
            "type": "debit",
            "amount": 10.52,
            "effectiveDate": "2021-01-03T23:44:03.790Z"
          }
        ]
___
### Transaction Details
Shows the details of a specific transaction.

HTTP Method: **GET**

URI: `/account/transaction`

Request example:

        {
          "id": "afa3737c-3cd6-4585-8b5a-56e92b5b9d38"
        }

- **id** the UUID of the transaction.

Response example:

        {
          "id": "afa3737c-3cd6-4585-8b5a-56e92b5b9d38",
          "type": "credit",
          "amount": 1000,
          "effectiveDate": "2021-01-03T23:43:25.918Z"
        }