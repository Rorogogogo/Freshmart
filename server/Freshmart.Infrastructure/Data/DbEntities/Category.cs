using System;
using System.Collections.Generic;

namespace Freshmart.Infrastructure.Data.DbEntities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
        
        // Parent-child relationship properties
        public Guid? ParentId { get; set; }
        public virtual Category Parent { get; set; }
        public virtual ICollection<Category> Children { get; set; } = new List<Category>();
        
        // Navigation properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
} 