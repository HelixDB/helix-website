import { v4 as uuidv4 } from "uuid";

// API configuration constants
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  GET_USER_RESOURCES_URL: "https://hbdu3d1tz2.execute-api.eu-west-2.amazonaws.com/v1",
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Query-related interfaces
export interface Query {
  id: string;
  name: string;
  content: string;
}

interface GetQueriesResponse {
  instance_id: string;
  queries: Query[]
}

// Instance-related types
export type InstanceConfig = {
  region: string;
  instanceName: string;
  vcpus: number;
  memory: number;
  storage: number;
}

export type InstanceDetails = {
  instance_id: string;
  instance_name: string;
  cluster_id: string;
  user_id: string;
  instance_type: string;
  vcpus: number;
  memory: number;
  instance_status: string;
  instance_size: string;
  api_endpoint: string;
  ebs_volumes: string[];
  created_at: string;
  updated_at: string;
}

// Graph-related interfaces
interface GraphNode {
  id: string;
  label?: string;
  properties?: Record<string, unknown>;
}

interface GraphLink {
  id: string;
  from_node: string;
  to_node: string;
  label: string;
  properties?: Record<string, unknown>;
}

interface GraphData {
  nodes: Record<string, GraphNode>;
  links: Record<string, GraphLink>;
}

interface Return {
  result: Record<string, any>;
  newGraphData: GraphData;
}

/**
 * API class handling all backend communication
 */
class API {
  private id: string;

  constructor() {
    this.id = uuidv4();
    this.init(this.id);
  }

  /**
   * Initialize the API handler
   */
  private init(id: string): void {
    const body = JSON.stringify({ userID: id });
    fetch(`${API_CONFIG.BASE_URL}/init`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Failed to initialize handler');
      }
    }).catch((error) => {
      console.error('Error initializing handler:', error);
      throw error;
    });
  }

  /**
   * Execute a Helix query
   */
  public async executeQuery(queryName: string, queryContent: string, schemaContent: string): Promise<Return> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/query`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ queryName, queryContent, schemaContent, id: this.id }),
      });
      const query_response = await response.json();
      
      if (!query_response.result.success) {
        return { 
          result: query_response.result.error, 
          newGraphData: { nodes: {}, links: {} } 
        };
      }

      return { 
        result: query_response.result.result, 
        newGraphData: query_response.result.graph_data 
      };
    } catch (error) {
      console.error('Error executing query:', error);
      return { result: {}, newGraphData: { nodes: {}, links: {} } };
    }
  }

  /**
   * Get user's instance resources
   */
  public async getUserResources(userID: string, jwtToken: string): Promise<InstanceDetails[]> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/getUserResources`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ userID, jwtToken }),
    });

    const result = await response.json() as { resources: InstanceDetails[] };
    return result.resources;
  }

  /**
   * Create a new instance
   */
  public async createInstace(userID: string, jwtToken: string, instanceConfig: InstanceConfig): Promise<InstanceDetails> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/createServer`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ userID, jwtToken, instanceConfig }),
    });
    
    return await response.json();
  }

  /**
   * Push queries to an instance
   */
  public async pushQueries(userID: string, instanceId: string, queries: Query[]): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/upload-queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          instance_id: instanceId,
          queries: queries.map(query => ({
            id: query.id,
            name: query.name,
            content: query.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload queries');
      }

      const result = await response.json();
      console.log('Queries uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading queries:', error);
      throw error;
    }
  }

  /**
   * Get queries from an instance
   */
  public async getQueries(userID: string, instanceId: string): Promise<GetQueriesResponse> {
    try {
      const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/get-queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          instance_id: instanceId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get queries');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  }

  public async deleteQueries(userID: string, instanceId: string, queries: Query[]): Promise<void> {
    try {
        const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/delete-queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userID,
                instance_id: instanceId,
                queries: queries.map(query => (
                    query.id
                ))
            })
        });

        if (!response.ok) {
            throw new Error('Failed to delete queries');
        }

        const result = await response.json();
        console.log('Queries deleted successfully:', result);
    } catch (error) {
        console.error('Error deleting queries:', error);
        throw error;
    }
}
}

// Export singleton instance
const instance = new API();

export type { GraphData, GraphNode, GraphLink };
export default instance;


