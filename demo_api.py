from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Simple FastAPI demo for testing API structure
app = FastAPI(
    title="Manufacturing Query API - Demo",
    description="Demo version showing all available endpoints",
    version="1.0.0"
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Manufacturing Query API"}

@app.get("/api/query/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "query-api"}

# Demo endpoints showing the API structure without database dependencies
@app.get("/api/query/production/orders", tags=["Production"])
def get_production_orders_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns production orders",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token",
        "example_response": [
            {
                "id": 1,
                "orderNumber": "PO-2024-001",
                "productId": 101,
                "quantity": 100,
                "status": "in_progress"
            }
        ]
    }

@app.get("/api/query/production/outputs", tags=["Production"])
def get_machine_outputs_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns machine output records",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/production/stock-wip", tags=["Production"])
def get_wip_stock_demo():
    return {
        "message": "This endpoint returns Work-in-Progress stock data",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/quality-control/oqc-records", tags=["Quality Control"])
def get_oqc_records_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns OQC (Outgoing Quality Control) records",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/quality-control/transfers", tags=["Quality Control"])
def get_qc_transfers_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns QC transfer records",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/quality-control/stock-wip", tags=["Quality Control"])
def get_qc_wip_stock_demo():
    return {
        "message": "This endpoint returns WIP stock from QC perspective",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/quality-control/stock-fg", tags=["Quality Control"])
def get_qc_fg_stock_demo():
    return {
        "message": "This endpoint returns finished goods stock from QC perspective",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/warehouse/deliveries", tags=["Warehouse"])
def get_deliveries_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns delivery records",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/warehouse/returns", tags=["Warehouse"])
def get_returns_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns customer return records",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/warehouse/stock-fg", tags=["Warehouse"])
def get_warehouse_fg_stock_demo():
    return {
        "message": "This endpoint returns finished goods stock",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/users/users", tags=["User Management"])
def get_users_demo():
    return {
        "message": "This endpoint returns all users in the system",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/users/logs", tags=["User Management"])
def get_user_logs_demo():
    return {
        "message": "This endpoint returns user activity logs",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/historical-stock/stock-takes", tags=["Historical Stock"])
def get_stock_takes_demo():
    return {
        "message": "This endpoint returns stock take history records",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/historical-stock/adjustments", tags=["Historical Stock"])
def get_stock_adjustments_demo():
    return {
        "message": "This endpoint returns stock adjustment records",
        "authentication": "Required: Bearer token"
    }

@app.get("/api/query/master-product/", tags=["Master Product"])
def get_master_products_demo(skip: int = 0, limit: int = 100):
    return {
        "message": "This endpoint returns all master product data",
        "parameters": {"skip": skip, "limit": limit},
        "authentication": "Required: Bearer token",
        "example_response": [
            {
                "id": 1,
                "productCode": "PROD-001",
                "productName": "Sample Product",
                "category": "Electronics",
                "unitOfMeasure": "PCS",
                "standardCost": 15.50,
                "isActive": True
            }
        ]
    }

@app.get("/api/endpoints", tags=["Documentation"])
def list_all_endpoints():
    """
    Returns a comprehensive list of all available API endpoints for Android integration
    """
    return {
        "query_service": {
            "base_url": "http://your-server:8000",
            "authentication": "Bearer token required for all endpoints except /health",
            "endpoints": {
                "health": "GET /api/query/health",
                "production": {
                    "orders": "GET /api/query/production/orders",
                    "outputs": "GET /api/query/production/outputs", 
                    "stock_wip": "GET /api/query/production/stock-wip"
                },
                "quality_control": {
                    "oqc_records": "GET /api/query/quality-control/oqc-records",
                    "transfers": "GET /api/query/quality-control/transfers",
                    "stock_wip": "GET /api/query/quality-control/stock-wip",
                    "stock_fg": "GET /api/query/quality-control/stock-fg"
                },
                "warehouse": {
                    "deliveries": "GET /api/query/warehouse/deliveries",
                    "returns": "GET /api/query/warehouse/returns",
                    "stock_fg": "GET /api/query/warehouse/stock-fg"
                },
                "user_management": {
                    "users": "GET /api/query/users/users",
                    "logs": "GET /api/query/users/logs"
                },
                "historical_stock": {
                    "stock_takes": "GET /api/query/historical-stock/stock-takes",
                    "adjustments": "GET /api/query/historical-stock/adjustments"
                },
                "master_product": {
                    "all": "GET /api/query/master-product/"
                }
            }
        },
        "command_service": {
            "base_url": "http://your-server:3001",
            "authentication": "Bearer token required for all endpoints except /login",
            "endpoints": {
                "auth": {
                    "login": "POST /api/command/auth/login"
                },
                "production": {
                    "create_order": "POST /api/command/production/orders",
                    "create_output": "POST /api/command/production/outputs"
                },
                "quality_control": {
                    "create_oqc": "POST /api/command/quality-control/oqc",
                    "create_transfer": "POST /api/command/quality-control/transfer"
                },
                "warehouse": {
                    "create_delivery": "POST /api/command/warehouse/delivery",
                    "create_return": "POST /api/command/warehouse/returns"
                }
            }
        },
        "documentation": {
            "swagger_ui": "http://your-server:8000/docs",
            "redoc": "http://your-server:8000/redoc",
            "openapi_json": "http://your-server:8000/openapi.json"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)