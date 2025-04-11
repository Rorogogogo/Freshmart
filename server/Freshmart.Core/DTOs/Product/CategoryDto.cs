using System;
using System.Collections.Generic;

namespace Freshmart.Core.DTOs.Product
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ProductsCount { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid? ParentId { get; set; }
        public string ParentName { get; set; }
        public List<CategoryDto> SubCategories { get; set; } = new List<CategoryDto>();
    }

    public class CategoryHierarchyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ProductsCount { get; set; }
        public List<CategoryDto> SubCategories { get; set; } = new List<CategoryDto>();
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ParentId { get; set; }
    }

    public class UpdateCategoryDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ParentId { get; set; }
    }
} 