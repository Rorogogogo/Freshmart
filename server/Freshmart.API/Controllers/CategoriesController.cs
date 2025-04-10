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
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories(
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string searchTerm = null)
        {
            var result = await _categoryService.GetAllCategoriesAsync(page, pageSize, searchTerm);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            var result = await _categoryService.CreateCategoryAsync(categoryDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] UpdateCategoryDto categoryDto)
        {
            var result = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPatch("{id}/restore")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> RestoreCategory(Guid id)
        {
            var result = await _categoryService.RestoreCategoryAsync(id);
            return StatusCode(result.StatusCode, result);
        }
    }
} 