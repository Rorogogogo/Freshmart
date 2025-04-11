using System;

namespace Freshmart.Infrastructure.Data.DbEntities
{
    public class OrderItem : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        
        // Navigation properties
        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
    }
} 