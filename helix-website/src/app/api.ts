import { v4 as uuidv4 } from "uuid";

const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  GET_USER_RESOURCES_URL: "https://hbdu3d1tz2.execute-api.eu-west-2.amazonaws.com/v1",
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

export type InstanceConfig = {
  region: string
  instanceName: string
  vcpus: number
  memory: number
  storage: number
}

export type InstanceDetails = {
  instance_id: string
  instance_name: string
  cluster_id: string
  user_id: string
  instance_type: string
  vcpus: number
  memory: number
  instance_status: string
  instance_size: string
  api_endpoint: string
  ebs_volumes: string[]
  created_at: string
  updated_at: string
}

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

class API {
  id: string;
  constructor() {
    this.id = uuidv4();
    this.init(this.id);
  }

  init(id: string): void {
    let body = JSON.stringify({ userID: id });
    fetch(`${API_CONFIG.BASE_URL}/init`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: body,
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
        return { result: query_response.result.error, newGraphData: { nodes: {}, links: {} } };
      }

      return { result: query_response.result.result, newGraphData: query_response.result.graph_data };
    } catch (error) {
      console.error('Error executing query:', error);
      return { result: {}, newGraphData: { nodes: {}, links: {} } };
    }
  }
  public async getUserResources(userID: string, jwtToken: string): Promise<InstanceDetails[]> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/getUserResources`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ userID, jwtToken }),
    });
    console.log(response)
    const result = await response.json() as { resources: InstanceDetails[] };
    return result.resources;
  }

  public async createInstace(userID: string, jwtToken: string, instanceConfig: InstanceConfig): Promise<InstanceDetails> {
    const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/createServer`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ userID, jwtToken, instanceConfig }),
    });
    const result = await response.json();
    return result;
  }

  public async pushQueries(userID: string, instanceId: string, queries: { id: string, content: string }[]) {
    try {
        const response = await fetch(`${API_CONFIG.GET_USER_RESOURCES_URL}/upload-queries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userID,
                instance_id: instanceId,
                queries: queries.map((query, index) => ({
                    id: query.id,
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

  public async getQueries(userID: string, instanceId: string): Promise<{ id: string, content: string }[]> {
    // Return mock data for now
    return [
      {
        id: "1qwe",
        content: "QUERY findUsers() => V<User>()"
      },
      {
        id: "2qwe",
        content: "QUERY getUserConnections(userId: String) =>\n  user <- V<User>()::WHERE(_::Props(id)::EQ(userId))\n  connections <- user::Out<Follows>()\n  RETURN connections"
      }
    ];
  }
}

const instance = new API();

export type { GraphData, GraphNode, GraphLink };
export default instance;


