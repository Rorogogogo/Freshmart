using System;

namespace Freshmart.Core.DTOs.Order
{
    public class OrderItemDto
    {
        public string Id { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public string ProductImageUrl { get; set; }
    }
} 