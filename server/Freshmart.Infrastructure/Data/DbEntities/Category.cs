using System;
using System.Collections.Generic;

namespace Freshmart.Infrastructure.Data.DbEntities
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
        
        // Navigation properties
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
} 