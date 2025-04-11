using System;
using System.Collections.Generic;

namespace Freshmart.Infrastructure.Data.DbEntities
{
    public class Order : BaseEntity
    {
        public Order()
        {
            OrderItems = new HashSet<OrderItem>();
        }
        
        public Guid UserId { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        
        // Address details
        public string ShippingAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }
        
        // Email for invoice
        public string Email { get; set; }
        
        // Navigation properties
        public virtual ApplicationUser User { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
} 