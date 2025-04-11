using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Product;

namespace Freshmart.Core.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponseDto<ProductDto>> GetProductByIdAsync(Guid id);
        Task<DataCollectionApiResponseDto<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 10);
        Task<DataCollectionApiResponseDto<ProductDto>> GetProductsByCategoryAsync(Guid categoryId, int page = 1, int pageSize = 10, bool includeSubcategories = false);
        Task<ApiResponseDto<ProductDto>> CreateProductAsync(CreateProductDto productDto);
        Task<ApiResponseDto<ProductDto>> UpdateProductAsync(Guid id, UpdateProductDto productDto);
        Task<ApiResponseDto<bool>> DeleteProductAsync(Guid id);
        Task<ApiResponseDto<ProductDto>> RateProductAsync(Guid id, RateProductDto rateDto);
    }
} 