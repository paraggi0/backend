# Backend API Documentation for Android Integration

## Overview
This manufacturing management system provides two main API services with different responsibilities:

1. **Query Service (FastAPI)** - Read Operations
   - **Base URL**: `http://your-server:8000/api/query`
   - **Purpose**: Retrieve data from the system
   - **Framework**: FastAPI (Python)

2. **Command Service (Node.js)** - Write Operations  
   - **Base URL**: `http://your-server:3001/api/command`
   - **Purpose**: Create/Update/Delete operations
   - **Framework**: Express.js (Node.js)

## Authentication
All endpoints except login require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Query Service Endpoints (Port 8000)

### Base Information
- **Root Endpoint**: `GET /`
  - **URL**: `http://your-server:8000/`
  - **Response**: `{"message": "Welcome to the Query API"}`

### 1. Production Module
**Base Path**: `/api/query/production`

#### Get Production Orders
- **URL**: `GET /api/query/production/orders`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve production orders
- **Authentication**: Required

#### Get Machine Outputs
- **URL**: `GET /api/query/production/outputs`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve machine output records
- **Authentication**: Required

#### Get WIP Stock
- **URL**: `GET /api/query/production/stock-wip`
- **Purpose**: Retrieve Work-in-Progress stock data
- **Authentication**: Required

### 2. Quality Control Module
**Base Path**: `/api/query/quality-control`

#### Get OQC Records
- **URL**: `GET /api/query/quality-control/oqc-records`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve Outgoing Quality Control records
- **Authentication**: Required

#### Get QC Transfers
- **URL**: `GET /api/query/quality-control/transfers`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve quality control transfer records
- **Authentication**: Required

#### Get WIP Stock (QC)
- **URL**: `GET /api/query/quality-control/stock-wip`
- **Purpose**: Retrieve WIP stock from QC perspective
- **Authentication**: Required

#### Get Finished Goods Stock (QC)
- **URL**: `GET /api/query/quality-control/stock-fg`
- **Purpose**: Retrieve finished goods stock from QC perspective
- **Authentication**: Required

### 3. Warehouse Module
**Base Path**: `/api/query/warehouse`

#### Get Deliveries
- **URL**: `GET /api/query/warehouse/deliveries`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve delivery records
- **Authentication**: Required

#### Get Customer Returns
- **URL**: `GET /api/query/warehouse/returns`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve customer return records
- **Authentication**: Required

#### Get Finished Goods Stock
- **URL**: `GET /api/query/warehouse/stock-fg`
- **Purpose**: Retrieve finished goods stock
- **Authentication**: Required

### 4. User Management Module
**Base Path**: `/api/query/users`

#### Get Users
- **URL**: `GET /api/query/users/users`
- **Purpose**: Retrieve all users in the system
- **Authentication**: Required

#### Get User Logs
- **URL**: `GET /api/query/users/logs`
- **Purpose**: Retrieve user activity logs
- **Authentication**: Required

### 5. Historical Stock Module
**Base Path**: `/api/query/historical-stock`

#### Get Stock Takes
- **URL**: `GET /api/query/historical-stock/stock-takes`
- **Purpose**: Retrieve stock take history records
- **Authentication**: Required

#### Get Stock Adjustments
- **URL**: `GET /api/query/historical-stock/adjustments`
- **Purpose**: Retrieve stock adjustment records
- **Authentication**: Required

### 6. Master Product Module
**Base Path**: `/api/query/master-product`

#### Get All Master Products
- **URL**: `GET /api/query/master-product/`
- **Query Parameters**: 
  - `skip` (int, optional): Skip records (default: 0)
  - `limit` (int, optional): Limit results (default: 100)
- **Purpose**: Retrieve all master product data
- **Authentication**: Required

## Command Service Endpoints (Port 3001)

### 1. Authentication Module
**Base Path**: `/api/command/auth`

#### Login
- **URL**: `POST /api/command/auth/login`
- **Method**: POST
- **Purpose**: Authenticate user and get JWT token
- **Authentication**: Not required
- **Request Body Example**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

### 2. Production Module
**Base Path**: `/api/command/production`

#### Create Production Order
- **URL**: `POST /api/command/production/orders`
- **Method**: POST
- **Purpose**: Create new production order
- **Authentication**: Required

#### Create Machine Output
- **URL**: `POST /api/command/production/outputs`
- **Method**: POST
- **Purpose**: Create new machine output record
- **Authentication**: Required

### 3. Quality Control Module
**Base Path**: `/api/command/quality-control`

#### Create OQC Record
- **URL**: `POST /api/command/quality-control/oqc`
- **Method**: POST
- **Purpose**: Create new OQC record
- **Authentication**: Required

#### Create QC Transfer
- **URL**: `POST /api/command/quality-control/transfer`
- **Method**: POST
- **Purpose**: Create new QC transfer record
- **Authentication**: Required

### 4. Warehouse Module
**Base Path**: `/api/command/warehouse`

#### Create Delivery
- **URL**: `POST /api/command/warehouse/delivery`
- **Method**: POST
- **Purpose**: Create new delivery record
- **Authentication**: Required

#### Create Customer Return
- **URL**: `POST /api/command/warehouse/returns`
- **Method**: POST
- **Purpose**: Create new customer return record
- **Authentication**: Required

## Server Configuration

### Production Configuration (PM2)
Based on the `ecosystem.config.js` file, the services are configured to run:

- **Query Service (FastAPI)**: Port 8000
- **Command Service (Node.js)**: Port 3001

### Environment Variables Required
For Node.js service, these environment variables need to be configured:
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `PORT`: Service port (default: 3001)

## Android Integration Guidelines

### 1. Base URL Configuration
Configure your Android app with:
```kotlin
const val QUERY_BASE_URL = "http://your-server:8000/api/query"
const val COMMAND_BASE_URL = "http://your-server:3001/api/command"
```

### 2. Authentication Flow
1. Call login endpoint to get JWT token
2. Store token securely in Android app
3. Include token in all subsequent API calls

### 3. CQRS Pattern
This system follows CQRS (Command Query Responsibility Segregation):
- Use **Query Service** for all READ operations (GET requests)
- Use **Command Service** for all WRITE operations (POST/PUT/DELETE requests)

### 4. Error Handling
- Query Service returns FastAPI standard error responses
- Command Service returns Express.js standard error responses
- Always check HTTP status codes and handle errors appropriately

### 5. Pagination
Most query endpoints support pagination with `skip` and `limit` parameters:
```
GET /api/query/production/orders?skip=0&limit=20
```

## Testing the APIs

You can test the APIs using tools like:
- Postman
- curl commands
- Android HTTP clients

### Example curl commands:

#### Login
```bash
curl -X POST http://your-server:3001/api/command/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

#### Get Production Orders
```bash
curl -X GET http://your-server:8000/api/query/production/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notes for Android Developers

1. **Network Security**: Use HTTPS in production
2. **Token Management**: Implement token refresh mechanism
3. **Offline Support**: Consider caching strategies for read operations
4. **Error Handling**: Implement proper error handling for network failures
5. **Loading States**: Show loading indicators for long-running operations
6. **Pagination**: Implement pagination for large datasets