// api.js
const API_BASE_URL = 'http://localhost:3001/api';


export async function executeQuery(queryName, queryContent, schemaContent) {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryName, queryContent, schemaContent }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}