# NorthCoders News API

Welcome to the **NC News API**! This project is an API that provides programmatic access to application data for a Reddit-style news application. The API is designed to serve data to a front-end architecture and allows users to access articles, topics, comments, and more.

## Hosted Version

You can find the hosted version of the API [here](https://my-nc-news-086w.onrender.com/).

---

## Project Summary

The NC News API is a back-end service built using **Node.js**, **Express**, and **PostgreSQL**. It mimics a real-world backend architecture, serving as the data layer for a news aggregation platform. The API provides:

- Endpoints for retrieving articles, topics, and comments.
- Support for filtering, sorting, and paginating articles.
- Full test coverage to ensure reliability and stability.
- Dynamic comment counts for articles.

This project is aimed to showcase my ability to build a robust and well-tested backend service using industry-standard practices.

---

## Minimum Requirements

- **Node.js:** v16.0.0 or higher
- **PostgreSQL:** v12.0 or higher

---

## Installation & Setup

To set up this project locally, follow the steps below:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name 
```

### 2. Install Dependencies

Ensure you have **Node.js (v16.0.0 or later)** and **PostgreSQL (v12.0 or later)** installed. Then, install the project dependencies:

```bash
npm install
```

### 3. Create .env Files

You will need two .env files in the root directory to configure your local databases:

- .env.development :
```makefile
PGDATABASE=nc_news
```
- .env.test :
```makefile
PGDATABASE=nc_news_test
```
Make sure these databases exist locally before running the setup scripts.


### 4. Seed the Local Database

Run the following command to create tables and seed your development database:

```bash
npm run setup-dbs && npm run seed
```


### 5. Run the Tests

To ensure everything is working correctly, run the test suite:

```bash
npm test
```

### 6. Start the Server

You can start the server locally with:

```bash
npm start
```

The API will be accessible at http://localhost:9090.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
