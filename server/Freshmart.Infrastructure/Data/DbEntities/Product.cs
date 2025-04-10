using System;

namespace Freshmart.Infrastructure.Data.DbEntities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string ImageUrl { get; set; }
        
        // Add rating fields
        public decimal Rating { get; set; } = 0;
        public int ReviewCount { get; set; } = 0;
        
        // Foreign keys
        public Guid CategoryId { get; set; }
        
        // Navigation properties
        public virtual Category Category { get; set; }
    }
} 