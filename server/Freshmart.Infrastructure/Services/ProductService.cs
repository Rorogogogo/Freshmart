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
    public class ProductService : IProductService
    {
        private readonly FreshmartDbContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(FreshmartDbContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponseDto<ProductDto>> GetProductByIdAsync(Guid id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Product not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                var productDto = MapToProductDto(product);

                return new ApiResponseDto<ProductDto>
                {
                    Data = productDto,
                    Message = "Product retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving product with ID: {ProductId}", id);
                return new ApiResponseDto<ProductDto>
                {
                    Message = "Error retrieving product",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<DataCollectionApiResponseDto<ProductDto>> GetAllProductsAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var totalItems = await _context.Products.CountAsync();
                var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = await _context.Products
                    .Include(p => p.Category)
                    .OrderBy(p => p.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDtos = products.Select(MapToProductDto).ToList();

                return new DataCollectionApiResponseDto<ProductDto>
                {
                    Data = productDtos,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalItems,
                    TotalPages = totalPages,
                    Message = "Products retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products");
                return new DataCollectionApiResponseDto<ProductDto>
                {
                    Message = "Error retrieving products",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<DataCollectionApiResponseDto<ProductDto>> GetProductsByCategoryAsync(Guid categoryId, int page = 1, int pageSize = 10)
        {
            try
            {
                var totalItems = await _context.Products
                    .Where(p => p.CategoryId == categoryId)
                    .CountAsync();

                var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = await _context.Products
                    .Include(p => p.Category)
                    .Where(p => p.CategoryId == categoryId)
                    .OrderBy(p => p.Name)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDtos = products.Select(MapToProductDto).ToList();

                return new DataCollectionApiResponseDto<ProductDto>
                {
                    Data = productDtos,
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = totalItems,
                    TotalPages = totalPages,
                    Message = "Products retrieved successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving products for category ID: {CategoryId}", categoryId);
                return new DataCollectionApiResponseDto<ProductDto>
                {
                    Message = "Error retrieving products",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<ProductDto>> CreateProductAsync(CreateProductDto productDto)
        {
            try
            {
                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId);
                if (!categoryExists)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                var product = new Product
                {
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    StockQuantity = productDto.StockQuantity,
                    ImageUrl = productDto.ImageUrl,
                    CategoryId = productDto.CategoryId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Get the full product with category
                var createdProduct = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == product.Id);

                var createdProductDto = MapToProductDto(createdProduct);

                return new ApiResponseDto<ProductDto>
                {
                    Data = createdProductDto,
                    Message = "Product created successfully",
                    Success = true,
                    StatusCode = 201
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return new ApiResponseDto<ProductDto>
                {
                    Message = "Error creating product",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<ProductDto>> UpdateProductAsync(Guid id, UpdateProductDto productDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Product not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == productDto.CategoryId);
                if (!categoryExists)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Category not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                product.Name = productDto.Name;
                product.Description = productDto.Description;
                product.Price = productDto.Price;
                product.StockQuantity = productDto.StockQuantity;
                product.ImageUrl = productDto.ImageUrl;
                product.CategoryId = productDto.CategoryId;
                product.UpdatedAt = DateTime.UtcNow;

                _context.Products.Update(product);
                await _context.SaveChangesAsync();

                // Get the full product with category
                var updatedProduct = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                var updatedProductDto = MapToProductDto(updatedProduct);

                return new ApiResponseDto<ProductDto>
                {
                    Data = updatedProductDto,
                    Message = "Product updated successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product with ID: {ProductId}", id);
                return new ApiResponseDto<ProductDto>
                {
                    Message = "Error updating product",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteProductAsync(Guid id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return new ApiResponseDto<bool>
                    {
                        Message = "Product not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Soft delete
                product.IsDeleted = true;
                product.UpdatedAt = DateTime.UtcNow;

                _context.Products.Update(product);
                await _context.SaveChangesAsync();

                return new ApiResponseDto<bool>
                {
                    Data = true,
                    Message = "Product deleted successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID: {ProductId}", id);
                return new ApiResponseDto<bool>
                {
                    Message = "Error deleting product",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        public async Task<ApiResponseDto<ProductDto>> RateProductAsync(Guid id, RateProductDto rateDto)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Product not found",
                        Success = false,
                        StatusCode = 404
                    };
                }

                // Validate rating
                if (rateDto.Rating < 1 || rateDto.Rating > 5)
                {
                    return new ApiResponseDto<ProductDto>
                    {
                        Message = "Rating must be between 1 and 5",
                        Success = false,
                        StatusCode = 400
                    };
                }

                // Calculate new average rating
                decimal currentTotalRating = product.Rating * product.ReviewCount;
                int newReviewCount = product.ReviewCount + 1;
                decimal newRating = (currentTotalRating + rateDto.Rating) / newReviewCount;

                // Update product with new rating
                product.Rating = Math.Round(newRating, 1);
                product.ReviewCount = newReviewCount;
                product.UpdatedAt = DateTime.UtcNow;

                _context.Products.Update(product);
                await _context.SaveChangesAsync();

                var productDto = MapToProductDto(product);

                return new ApiResponseDto<ProductDto>
                {
                    Data = productDto,
                    Message = "Product rating updated successfully",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rating product with ID: {ProductId}", id);
                return new ApiResponseDto<ProductDto>
                {
                    Message = "Error rating product",
                    Success = false,
                    StatusCode = 500
                };
            }
        }

        private ProductDto MapToProductDto(Product product)
        {
            if (product == null) return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,
                Rating = product.Rating,
                ReviewCount = product.ReviewCount,
                IsDeleted = product.IsDeleted,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }
    }
} 