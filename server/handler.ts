import { HelixJs } from '@helix/db';

interface Event {
    queryName: string;
    queryContent: string;
    id: string;
}

export default class Handler {
    helix: HelixJs;

    constructor(userID: string) {
        this.helix = new HelixJs(userID);
    }

    handle(event: Event): any {
        const startTime = process.hrtime();

        try {
            const initTime = process.hrtime(startTime);


            let get_graph = `
        QUERY allGraphData() => 
          nodes <- V
          links <- V::OutE
          RETURN nodes, links 
        `;

            const queryStartTime = process.hrtime();
            const res = this.helix.query(event.queryContent, []);
            const queryTime = process.hrtime(queryStartTime);

            const graph_data = this.helix.query(get_graph, []);

            console.log("res", res, "graph_data", graph_data);
            return {
                success: true,
                result: JSON.parse(res),
                graph_data: JSON.parse(graph_data),
                queryName: event.queryName,
                initTime: `${initTime[0]}s ${initTime[1] / 1000000}ms`,
                queryTime: `${queryTime[0]}s ${queryTime[1] / 1000000}ms`,
                timestamp: new Date().toISOString
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }
}

