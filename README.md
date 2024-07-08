# ⚡️ Babel API

(This project is under Babel Foundation initiative. You can read the manifest [here](https://github.com/margostino/babel-foundation))

The gateway service for interacting with Babel data. This API processes natural language queries, searches indexed metadata, and returns relevant responses by leveraging advanced Large Language Models (LLMs).

Babel data is a collection of human consciousness and memory assets captured and stored by users. This is a private repository for all personal data structured by folders, with each asset indexed for easy access and retrieval.

- Store your personal data in the structured folders.
- Ensure each asset is properly indexed for optimal performance.

<p align="center">
  <img src="https://github.com/margostino/babel-foundation/blob/master/assets/babel-architecture.png?raw=true" alt="Babel Foundation Architecture"/>
</p>

## Structure

- **Folders**: Organize data into folders based on categories or types.
- **Indexing**: Each asset is indexed to facilitate quick searches.

## Features

- **GET Endpoint**: Handles natural language queries and returns processed responses.
- **Index Metadata Search**: Searches metadata indexes to find relevant data.
- **LLM Processing**: Utilizes LLMs to interpret and respond to user queries.

## API Endpoint

### GET /search

Query Parameters:

- `query` (string): The natural language query to search Babel data.

Example Request:

```bash
curl -X GET "http://babel-gateway.vercel.app/index?query=Show+me+my+vacation+notes+from+2024"
