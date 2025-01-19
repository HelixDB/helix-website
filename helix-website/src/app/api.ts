import { v4 as uuidv4 } from "uuid";

const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

interface Return {
  result: Record<string, any>;
  newGraphData: Record<string, Record<string, any>>;
}



class API {
  id: string;
  constructor() {
    this.id = uuidv4();
    this.init(this.id);
  }

  init(id: string): void {
    let body = JSON.stringify({ userID: id });
    console.log("body", body);
    fetch(`${API_CONFIG.BASE_URL}/init`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body:body,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to initialize handler');
      }
    }).catch((error) => {
      console.error('Error initializing handler:', error);
      throw error;
    });
  }

  public async executeQuery(queryName: string, queryContent: string, schemaContent: string): Promise<Return> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/query`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ queryName, queryContent, schemaContent, id: this.id }),
      });
      let query_response = await response.json();
      if (!query_response.result.success) {
        return { result: query_response.result.error, newGraphData: {} };
      }

      return { result: query_response.result.result, newGraphData: query_response.result.graph_data };
    } catch (error) {
      console.error('Error executing query:', error);
      return { result: {}, newGraphData: {} };
    }
  }

}

const instance = new API();

export default instance;


