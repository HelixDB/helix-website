import { v4 as uuidv4 } from "uuid";

// API configuration constants
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
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

// Validation function for query names
const validateQueryName = (name: string): string => {
  const validatedName = name.toLowerCase().replace(/\s+/g, '-');
  if (validatedName !== name) {
    console.warn(`Query name "${name}" was automatically converted to "${validatedName}" to match required format`);
  }
  return validatedName;
};

interface GetQueriesResponse {
  instance_id: string;
  queries: Query[]
  instance_name: string;
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
  vCPUs: number;
  instance_region: string;
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

export interface InstanceNameCheckResponse {
    message?: string;
    error?: string;
    code: 'NAME_AVAILABLE' | 'NAME_EXISTS' | 'INVALID_NAME_FORMAT' | 'MISSING_NAME' | 'SERVER_ERROR';
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
      /* if (!response.ok) {
        throw new Error('Failed to initialize handler');
      } */
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
    console.log('Fetched resources:', result.resources);
    return result.resources;
  }
  /**
   * Push queries to an instance
   */
  public async pushQuery(userID: string, instanceId: string, instanceName: string, clusterId: string, region: string, query: Query): Promise<{ error?: string }> {
    try {
        // Validate and transform query names before sending
        const validatedQuery = {
            ...query,
            name: validateQueryName(query.name)
        };

        const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/upload-queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userID,
                instance_id: instanceId,
                instance_name: instanceName,
                queries: [{
                    id: query.id,
                    name: validatedQuery.name,
                    content: query.content
                }],
                cluster_id: clusterId,
                region: region,
                queries_to_delete: []
            })
        });

        const result = await response.json();
        console.log('Queries uploaded successfully:', result);
        return result;
    } catch (error) {
        console.error('Error uploading queries:', error);
        throw error;
    }
} /**
* delete queries from an instance
*/
public async deleteQuery(userID: string, instanceId: string, instanceName: string, clusterId: string, region: string, query: Query): Promise<{ error?: string }> {
 try {
  console.log('deleting this query:', {
    user_id: userID,
    instance_id: instanceId,
    instance_name: instanceName,
    queries: [],
    cluster_id: clusterId,
    region: region,
    queries_to_delete: [query.id]
});
     const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/upload-queries`, {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             user_id: userID,
             instance_id: instanceId,
             instance_name: instanceName,
             queries: [],
             cluster_id: clusterId,
             region: region,
             queries_to_delete: [query.id]
         })
     });

     const result = await response.json();
     console.log('Queries uploaded successfully:', result);
     return result;
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
      console.log('starting get-queries:', instanceId);
      const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/get-queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userID,
          instance_id: instanceId,
        })
      });
      console.log('Response from get-queries:', response);
      
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

  public async createInstance(config: {
    userId: string;
    region: string;
    instanceName: string;
    vcpus: number;
    memory: number;
    storage: number;
  }): Promise<void> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/create-instance`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      throw new Error('Failed to create instance');
    }
  }

  public async deleteInstance(userId: string, clusterId: string, region: string, instanceId: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/delete-instance`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ user_id: userId, cluster_id: clusterId, region: region, instance_id: instanceId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete instance');
    }
  }
  public async checkInstanceName(instanceName: string): Promise<InstanceNameCheckResponse> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/check-name`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ instance_name: instanceName })
    });
    return response.json();
  }
}

// Export singleton instance
const instance = new API();

export type { GraphData, GraphNode, GraphLink };
export default instance;


