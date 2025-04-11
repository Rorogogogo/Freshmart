using System;
using System.Threading.Tasks;
using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Product;

namespace Freshmart.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponseDto<CategoryDto>> GetCategoryByIdAsync(Guid id);
        Task<DataCollectionApiResponseDto<CategoryDto>> GetAllCategoriesAsync(int page = 1, int pageSize = 10, string searchTerm = null, bool includeSubcategories = false);
        Task<ApiResponseDto<CategoryDto>> CreateCategoryAsync(CreateCategoryDto categoryDto);
        Task<ApiResponseDto<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryDto categoryDto);
        Task<ApiResponseDto<bool>> DeleteCategoryAsync(Guid id);
        Task<ApiResponseDto<CategoryDto>> RestoreCategoryAsync(Guid id);
        
        // New methods for hierarchical categories
        Task<DataCollectionApiResponseDto<CategoryDto>> GetCategoryHierarchyAsync();
        Task<DataCollectionApiResponseDto<CategoryDto>> GetSubcategoriesAsync(Guid parentId);
        Task<ApiResponseDto<CategoryDto>> GetCategoryWithSubcategoriesAsync(Guid id);
    }
} 