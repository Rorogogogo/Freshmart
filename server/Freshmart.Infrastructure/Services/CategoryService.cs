using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Product;
using Freshmart.Core.Interfaces;
using Freshmart.Infrastructure.Data;
using Freshmart.Infrastructure.Data.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Freshmart.Infrastructure.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly FreshmartDbContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(FreshmartDbContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponseDto<CategoryDto>> GetCategoryByIdAsync(Guid id)
        {
            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

                if (category == null)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                var categoryDto = MapToCategoryDto(category);

                return new ApiResponseDto<CategoryDto>
                {
                    Data = categoryDto,
                    Message = "Category retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category with ID: {CategoryId}", id);
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<DataCollectionApiResponseDto<CategoryDto>> GetAllCategoriesAsync(int page = 1, int pageSize = 10, string searchTerm = null)
        {
            try
            {
                IQueryable<Category> query = _context.Categories;
                
                // Apply search filter if provided
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    query = query.Where(c => 
                        c.Name.ToLower().Contains(searchTerm) || 
                        (c.Description != null && c.Description.ToLower().Contains(searchTerm))
                    );
                }
                
                var totalItems = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var categories = await query
                    .OrderBy(c => c.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var categoryDtos = new List<CategoryDto>();
                foreach (var category in categories)
                {
                    categoryDtos.Add(MapToCategoryDto(category));
                }

                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Data = categoryDtos,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalItems,
                    TotalPages = totalPages,
                    Message = "Categories retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categories");
                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving categories",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<CategoryDto>> CreateCategoryAsync(CreateCategoryDto categoryDto)
        {
            try
            {
                var category = new Category
                {
                    Name = categoryDto.Name,
                    Description = categoryDto.Description,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var createdCategoryDto = MapToCategoryDto(category);

                return new ApiResponseDto<CategoryDto>
                {
                    Data = createdCategoryDto,
                    Message = "Category created successfully",
                    Success = true,
                    StatusCode = 201
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error creating category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<CategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryDto categoryDto)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                category.Name = categoryDto.Name;
                category.Description = categoryDto.Description;
                category.UpdatedAt = DateTime.UtcNow;

                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                var updatedCategoryDto = MapToCategoryDto(category);

                return new ApiResponseDto<CategoryDto>
                {
                    Data = updatedCategoryDto,
                    Message = "Category updated successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category with ID: {CategoryId}", id);
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error updating category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteCategoryAsync(Guid id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return new ApiResponseDto<bool>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Check if any products use this category
                var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id && !p.IsDeleted);
                if (hasProducts)
                {
                    return new ApiResponseDto<bool>
                    {
                        Message = "Cannot delete category because it contains products",
                        Success = false,
                        StatusCode = 400
                    };
                }

                // Soft delete
                category.IsDeleted = true;
                category.UpdatedAt = DateTime.UtcNow;

                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                return new ApiResponseDto<bool>
                {
                    Data = true,
                    Message = "Category deleted successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category with ID: {CategoryId}", id);
                return new ApiResponseDto<bool>
                {
                    Message = "Error deleting category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<CategoryDto>> RestoreCategoryAsync(Guid id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                if (!category.IsDeleted)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Category is not deleted",
                        Success = false,
                        StatusCode = 400
                    };
                }

                // Restore category
                category.IsDeleted = false;
                category.UpdatedAt = DateTime.UtcNow;

                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                var restoredCategoryDto = MapToCategoryDto(category);

                return new ApiResponseDto<CategoryDto>
                {
                    Data = restoredCategoryDto,
                    Message = "Category restored successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error restoring category with ID: {CategoryId}", id);
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error restoring category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        private CategoryDto MapToCategoryDto(Category category)
        {
            if (category == null) return null;

            // Get the number of non-deleted products for this category
            int productsCount = _context.Products
                .Count(p => p.CategoryId == category.Id && !p.IsDeleted);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ProductsCount = productsCount,
                IsDeleted = category.IsDeleted,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }
    }
} 