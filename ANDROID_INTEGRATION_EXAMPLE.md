# Android Integration Example

## Retrofit Interface Configuration

```kotlin
// ApiConstants.kt
object ApiConstants {
    const val QUERY_BASE_URL = "http://your-server:8000/"
    const val COMMAND_BASE_URL = "http://your-server:3001/"
}

// Query API Interface
interface QueryApiService {
    @GET("api/query/production/orders")
    suspend fun getProductionOrders(
        @Header("Authorization") token: String,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 100
    ): Response<List<ProductionOrder>>
    
    @GET("api/query/quality-control/oqc-records") 
    suspend fun getOqcRecords(
        @Header("Authorization") token: String,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 100
    ): Response<List<OqcRecord>>
    
    @GET("api/query/warehouse/deliveries")
    suspend fun getDeliveries(
        @Header("Authorization") token: String,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 100
    ): Response<List<Delivery>>
    
    @GET("api/query/master-product/")
    suspend fun getMasterProducts(
        @Header("Authorization") token: String,
        @Query("skip") skip: Int = 0,
        @Query("limit") limit: Int = 100
    ): Response<List<MasterProduct>>
}

// Command API Interface  
interface CommandApiService {
    @POST("api/command/auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
    
    @POST("api/command/production/orders")
    suspend fun createProductionOrder(
        @Header("Authorization") token: String,
        @Body order: CreateProductionOrderRequest
    ): Response<ApiResponse>
    
    @POST("api/command/quality-control/oqc")
    suspend fun createOqcRecord(
        @Header("Authorization") token: String,
        @Body oqc: CreateOqcRequest
    ): Response<ApiResponse>
    
    @POST("api/command/warehouse/delivery")
    suspend fun createDelivery(
        @Header("Authorization") token: String,
        @Body delivery: CreateDeliveryRequest
    ): Response<ApiResponse>
}
```

## Data Models

```kotlin
// Authentication
data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val access_token: String,
    val token_type: String,
    val expires_in: Int?
)

// Production
data class ProductionOrder(
    val id: Int,
    val orderNumber: String,
    val productId: Int,
    val quantity: Int,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)

data class CreateProductionOrderRequest(
    val orderNumber: String,
    val productId: Int,
    val quantity: Int,
    val plannedStartDate: String
)

// Quality Control
data class OqcRecord(
    val id: Int,
    val productId: Int,
    val batchNumber: String,
    val inspectionResult: String,
    val defectCount: Int,
    val inspectorId: Int,
    val createdAt: String
)

data class CreateOqcRequest(
    val productId: Int,
    val batchNumber: String,
    val inspectionResult: String,
    val defectCount: Int,
    val notes: String?
)

// Warehouse
data class Delivery(
    val id: Int,
    val deliveryNumber: String,
    val customerId: Int,
    val items: List<DeliveryItem>,
    val status: String,
    val scheduledDate: String,
    val actualDate: String?
)

data class CreateDeliveryRequest(
    val customerId: Int,
    val items: List<CreateDeliveryItem>,
    val scheduledDate: String,
    val notes: String?
)

// Master Data
data class MasterProduct(
    val id: Int,
    val productCode: String,
    val productName: String,
    val category: String,
    val unitOfMeasure: String,
    val standardCost: Double,
    val isActive: Boolean
)

// Generic Response
data class ApiResponse(
    val success: Boolean,
    val message: String,
    val data: Any?
)
```

## Repository Implementation

```kotlin
class ManufacturingRepository(
    private val queryApi: QueryApiService,
    private val commandApi: CommandApiService,
    private val tokenManager: TokenManager
) {
    
    suspend fun login(username: String, password: String): Result<LoginResponse> {
        return try {
            val response = commandApi.login(LoginRequest(username, password))
            if (response.isSuccessful) {
                response.body()?.let { loginResponse ->
                    tokenManager.saveToken(loginResponse.access_token)
                    Result.success(loginResponse)
                } ?: Result.failure(Exception("Empty response body"))
            } else {
                Result.failure(Exception("Login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getProductionOrders(page: Int = 0, limit: Int = 20): Result<List<ProductionOrder>> {
        return try {
            val token = "Bearer ${tokenManager.getToken()}"
            val response = queryApi.getProductionOrders(token, page * limit, limit)
            if (response.isSuccessful) {
                Result.success(response.body() ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch production orders: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun createProductionOrder(request: CreateProductionOrderRequest): Result<ApiResponse> {
        return try {
            val token = "Bearer ${tokenManager.getToken()}"
            val response = commandApi.createProductionOrder(token, request)
            if (response.isSuccessful) {
                Result.success(response.body() ?: ApiResponse(false, "Empty response", null))
            } else {
                Result.failure(Exception("Failed to create production order: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getMasterProducts(): Result<List<MasterProduct>> {
        return try {
            val token = "Bearer ${tokenManager.getToken()}"
            val response = queryApi.getMasterProducts(token)
            if (response.isSuccessful) {
                Result.success(response.body() ?: emptyList())
            } else {
                Result.failure(Exception("Failed to fetch master products: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

## ViewModel Example

```kotlin
class ProductionViewModel(
    private val repository: ManufacturingRepository
) : ViewModel() {
    
    private val _productionOrders = MutableLiveData<List<ProductionOrder>>()
    val productionOrders: LiveData<List<ProductionOrder>> = _productionOrders
    
    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading
    
    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error
    
    fun loadProductionOrders() {
        viewModelScope.launch {
            _loading.value = true
            repository.getProductionOrders().fold(
                onSuccess = { orders ->
                    _productionOrders.value = orders
                    _loading.value = false
                },
                onFailure = { exception ->
                    _error.value = exception.message
                    _loading.value = false
                }
            )
        }
    }
    
    fun createProductionOrder(orderRequest: CreateProductionOrderRequest) {
        viewModelScope.launch {
            _loading.value = true
            repository.createProductionOrder(orderRequest).fold(
                onSuccess = { response ->
                    if (response.success) {
                        // Refresh the list
                        loadProductionOrders()
                    } else {
                        _error.value = response.message
                    }
                    _loading.value = false
                },
                onFailure = { exception ->
                    _error.value = exception.message
                    _loading.value = false
                }
            )
        }
    }
}
```

## Network Configuration

```kotlin
// NetworkModule.kt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    @Named("query")
    fun provideQueryRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl(ApiConstants.QUERY_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    @Named("command")
    fun provideCommandRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl(ApiConstants.COMMAND_BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideQueryApiService(@Named("query") retrofit: Retrofit): QueryApiService {
        return retrofit.create(QueryApiService::class.java)
    }
    
    @Provides
    @Singleton
    fun provideCommandApiService(@Named("command") retrofit: Retrofit): CommandApiService {
        return retrofit.create(CommandApiService::class.java)
    }
}
```

## Usage in Activity/Fragment

```kotlin
class ProductionActivity : AppCompatActivity() {
    
    private lateinit var viewModel: ProductionViewModel
    private lateinit var adapter: ProductionOrderAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_production)
        
        setupViewModel()
        setupRecyclerView()
        observeData()
        
        // Load initial data
        viewModel.loadProductionOrders()
    }
    
    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[ProductionViewModel::class.java]
    }
    
    private fun observeData() {
        viewModel.productionOrders.observe(this) { orders ->
            adapter.updateOrders(orders)
        }
        
        viewModel.loading.observe(this) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                Toast.makeText(this, it, Toast.LENGTH_LONG).show()
            }
        }
    }
}
```