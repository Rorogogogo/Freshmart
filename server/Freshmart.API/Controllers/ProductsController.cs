using System;
using System.Threading.Tasks;
using Freshmart.Core.DTOs.Product;
using Freshmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Freshmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _productService.GetAllProductsAsync(page, pageSize);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategory(Guid categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _productService.GetProductsByCategoryAsync(categoryId, page, pageSize);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto productDto)
        {
            var result = await _productService.CreateProductAsync(productDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductDto productDto)
        {
            var result = await _productService.UpdateProductAsync(id, productDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var result = await _productService.DeleteProductAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("{id}/rate")]
        public async Task<IActionResult> RateProduct(Guid id, [FromBody] RateProductDto rateDto)
        {
            var result = await _productService.RateProductAsync(id, rateDto);
            return StatusCode(result.StatusCode, result);
        }
    }
} 