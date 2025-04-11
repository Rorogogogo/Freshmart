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
                var category = await _context.Categories
                    .Include(c => c.Parent)
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

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
                _logger.LogError(ex, "Error retrieving category");
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<DataCollectionApiResponseDto<CategoryDto>> GetAllCategoriesAsync(int page = 1, int pageSize = 10, string searchTerm = null, bool includeSubcategories = false)
        {
            try
            {
                IQueryable<Category> query = _context.Categories.Include(c => c.Parent);
                
                // Filter only root categories or all categories based on parameter
                if (!includeSubcategories)
                {
                    query = query.Where(c => c.ParentId == null);
                }
                
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
                // Verify parent exists if ParentId is provided
                if (categoryDto.ParentId.HasValue)
                {
                    var parentExists = await _context.Categories
                        .AnyAsync(c => c.Id == categoryDto.ParentId.Value && !c.IsDeleted);
                    
                    if (!parentExists)
                    {
                        return new ApiResponseDto<CategoryDto>
                        {
                            Message = "Parent category not found",
                            Success = false,
                            StatusCode = 404
                        };
                    }
                }
                
                var category = new Category
                {
                    Name = categoryDto.Name,
                    Description = categoryDto.Description,
                    ParentId = categoryDto.ParentId,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Categories.AddAsync(category);
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
                var category = await _context.Categories
                    .Include(c => c.Parent)
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

                if (category == null)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Check for circular reference
                if (categoryDto.ParentId.HasValue && categoryDto.ParentId.Value != category.ParentId)
                {
                    // Check if the new parent is valid (not itself and not one of its descendants)
                    if (categoryDto.ParentId.Value == id || await IsDescendantOfAsync(categoryDto.ParentId.Value, id))
                    {
                        return new ApiResponseDto<CategoryDto>
                        {
                            Message = "Cannot set a category as its own descendant",
                            Success = false,
                            StatusCode = 400
                        };
                    }
                    
                    // Check if parent exists
                    var parentExists = await _context.Categories
                        .AnyAsync(c => c.Id == categoryDto.ParentId.Value && !c.IsDeleted);
                    
                    if (!parentExists)
                    {
                        return new ApiResponseDto<CategoryDto>
                        {
                            Message = "Parent category not found",
                            Success = false,
                            StatusCode = 404
                        };
                    }
                }

                category.Name = categoryDto.Name;
                category.Description = categoryDto.Description;
                category.ParentId = categoryDto.ParentId;
                category.UpdatedAt = DateTime.UtcNow;

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
                _logger.LogError(ex, "Error updating category");
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
                var category = await _context.Categories
                    .Include(c => c.Children)
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

                if (category == null)
                {
                    return new ApiResponseDto<bool>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Check if category has products
                var hasProducts = await _context.Products
                    .AnyAsync(p => p.CategoryId == id && !p.IsDeleted);

                if (hasProducts)
                {
                    return new ApiResponseDto<bool>
                    {
                        Message = "Cannot delete category with active products",
                        Success = false,
                        StatusCode = 400
                    };
                }

                // If it has children categories, we need to handle them
                if (category.Children.Any())
                {
                    // Option 1: Prevent deletion
                    return new ApiResponseDto<bool>
                    {
                        Message = "Cannot delete category with subcategories",
                        Success = false,
                        StatusCode = 400
                    };
                    
                    // Option 2: Mark all children as deleted too
                    // await DeleteCategoryTreeAsync(category);
                }
                else
                {
                    // Just mark this category as deleted
                    category.IsDeleted = true;
                    category.UpdatedAt = DateTime.UtcNow;
                }

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
                _logger.LogError(ex, "Error deleting category");
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
                var category = await _context.Categories
                    .Include(c => c.Parent)
                    .FirstOrDefaultAsync(c => c.Id == id && c.IsDeleted);

                if (category == null)
                {
                    return new ApiResponseDto<CategoryDto>
                    {
                        Message = "Deleted category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // If it has a parent category that's deleted, we cannot restore
                if (category.ParentId.HasValue)
                {
                    var parentCategory = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Id == category.ParentId.Value);
                    
                    if (parentCategory != null && parentCategory.IsDeleted)
                    {
                        return new ApiResponseDto<CategoryDto>
                        {
                            Message = "Cannot restore category with deleted parent category",
                            Success = false,
                            StatusCode = 400
                        };
                    }
                }

                category.IsDeleted = false;
                category.UpdatedAt = DateTime.UtcNow;

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
                _logger.LogError(ex, "Error restoring category");
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error restoring category",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        // New methods for hierarchical categories
        public async Task<DataCollectionApiResponseDto<CategoryDto>> GetCategoryHierarchyAsync()
        {
            try
            {
                // Get all categories
                var allCategories = await _context.Categories
                    .Where(c => !c.IsDeleted)
                    .ToListAsync();

                // Get root categories (those without parents)
                var rootCategories = allCategories
                    .Where(c => c.ParentId == null)
                    .OrderBy(c => c.Name)
                    .ToList();

                // Build the hierarchy
                var result = new List<CategoryDto>();
                foreach (var rootCategory in rootCategories)
                {
                    var categoryDto = MapToCategoryDto(rootCategory);
                    
                    // Add subcategories
                    categoryDto.SubCategories = GetSubcategories(allCategories, rootCategory.Id);
                    
                    result.Add(categoryDto);
                }

                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Data = result,
                    Message = "Category hierarchy retrieved successfully",
                    Success = true,
                    StatusCode = 200,
                    TotalCount = result.Count
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category hierarchy");
                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving category hierarchy",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<DataCollectionApiResponseDto<CategoryDto>> GetSubcategoriesAsync(Guid parentId)
        {
            try
            {
                // Ensure parent category exists
                var parentExists = await _context.Categories
                    .AnyAsync(c => c.Id == parentId && !c.IsDeleted);

                if (!parentExists)
                {
                    return new DataCollectionApiResponseDto<CategoryDto>
                    {
                        Message = "Parent category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Get direct subcategories
                var subcategories = await _context.Categories
                    .Where(c => c.ParentId == parentId && !c.IsDeleted)
                    .OrderBy(c => c.Name)
                    .ToListAsync();

                var result = subcategories.Select(MapToCategoryDto).ToList();

                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Data = result,
                    Message = "Subcategories retrieved successfully",
                    Success = true,
                    StatusCode = 200,
                    TotalCount = result.Count
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving subcategories");
                return new DataCollectionApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving subcategories",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<CategoryDto>> GetCategoryWithSubcategoriesAsync(Guid id)
        {
            try
            {
                // Get the category with its parent
                var category = await _context.Categories
                    .Include(c => c.Parent)
                    .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

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

                // Get all subcategories
                var allCategories = await _context.Categories
                    .Where(c => !c.IsDeleted)
                    .ToListAsync();

                // Add subcategories
                categoryDto.SubCategories = GetSubcategories(allCategories, category.Id);

                return new ApiResponseDto<CategoryDto>
                {
                    Data = categoryDto,
                    Message = "Category with subcategories retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category with subcategories");
                return new ApiResponseDto<CategoryDto>
                {
                    Message = "Error retrieving category with subcategories",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        // Helper methods
        private CategoryDto MapToCategoryDto(Category category)
        {
            var productsCount = _context.Products
                .Count(p => p.CategoryId == category.Id && !p.IsDeleted);

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ProductsCount = productsCount,
                IsDeleted = category.IsDeleted,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt,
                ParentId = category.ParentId,
                ParentName = category.Parent?.Name
            };
        }

        private List<CategoryDto> GetSubcategories(List<Category> allCategories, Guid parentId)
        {
            var subcategories = allCategories
                .Where(c => c.ParentId == parentId)
                .OrderBy(c => c.Name)
                .ToList();

            var result = new List<CategoryDto>();
            foreach (var subcategory in subcategories)
            {
                var subcategoryDto = MapToCategoryDto(subcategory);
                subcategoryDto.SubCategories = GetSubcategories(allCategories, subcategory.Id);
                result.Add(subcategoryDto);
            }

            return result;
        }

        private async Task<bool> IsDescendantOfAsync(Guid potentialParentId, Guid potentialDescendantId)
        {
            var currentId = potentialParentId;
            
            while (currentId != Guid.Empty)
            {
                var category = await _context.Categories.FindAsync(currentId);
                if (category == null)
                {
                    return false;
                }
                
                if (category.ParentId == potentialDescendantId)
                {
                    return true;
                }
                
                currentId = category.ParentId ?? Guid.Empty;
            }
            
            return false;
        }

        private async Task DeleteCategoryTreeAsync(Category category)
        {
            // Mark the category as deleted
            category.IsDeleted = true;
            category.UpdatedAt = DateTime.UtcNow;
            
            // Recursively delete all children
            var children = await _context.Categories
                .Where(c => c.ParentId == category.Id && !c.IsDeleted)
                .ToListAsync();
                
            foreach (var child in children)
            {
                await DeleteCategoryTreeAsync(child);
            }
        }
    }
} 