// api.js
const API_BASE_URL = 'http://localhost:3001/api';

interface Return {
  result: Record<string, any>;
  newGraphData: Record<string, Record<string, any>>;
}

export async function executeQuery(id: string, queryName: string, queryContent: string, schemaContent: string): Promise<Return> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queryName, queryContent, schemaContent, id }),
    });
    let query_response = await response.json();

    
    console.log('query_response', query_response);
    return { result: query_response.result.result, newGraphData: query_response.result.graph_data };
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function init(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID: id }),
    });
  } catch (error) {
    console.error('Error initializing handler:', error);
    throw error;
  }
}