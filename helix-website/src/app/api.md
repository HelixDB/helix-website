I'll create a markdown document that outlines the API specification for the metrics endpoint.

# Metrics API Documentation

## Endpoint
```
GET /metrics
```

## Query Parameters
| Parameter    | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| instanceId  | string | Yes      | The ID of the EC2 instance     |
| apiGatewayId| string | Yes      | The ID of the API Gateway      |
| volumeId    | string | Yes      | The ID of the EBS volume       |

## Response

### Success Response (200 OK)
```json
{
    "apiRequestCount": number,      // Total number of API requests in the time window
    "apiCalls": [                   // Array of API error calls
        {
            "method": string,       // HTTP method (e.g., "ALL" for all methods)
            "path": string,         // API path (e.g., "*" for all paths)
            "statusCode": number,   // HTTP status code
            "timestamp": string     // ISO 8601 timestamp (e.g., "2024-02-12T12:34:56Z")
        }
    ],
    "cpuUtilization": number,       // CPU utilization percentage (0-100)
    "ebsVolumeUsage": number,       // EBS volume usage in GB
    "timestamp": string            // ISO 8601 timestamp of when metrics were collected
}
```

### Error Responses

#### 400 Bad Request
When required query parameters are missing:
```json
{
    "error": "instanceId, apiGatewayId, and volumeId are required query parameters"
}
```

#### 500 Internal Server Error
When there's an error fetching metrics:
```json
{
    "error": "Failed to get metrics: {detailed error message}"
}
```

## Notes
- The metrics are collected with a 5-minute window
- All timestamps are in ISO 8601 format
- CPU utilization is returned as a percentage value
- EBS volume usage is returned in gigabytes (GB)
- API request count represents the sum of all requests in the time window
