using System;
using System.Collections.Generic;

namespace Freshmart.Core.DTOs.Order
{
    public class OrderDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        
        // Address details
        public string ShippingAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        
        // User details for display
        public string UserName { get; set; }
        
        // Items in the order
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
} 