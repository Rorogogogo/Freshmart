using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Freshmart.Core.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        public List<CreateOrderItemDto> Items { get; set; } = new List<CreateOrderItemDto>();
        
        [Required]
        public string ShippingAddress { get; set; }
        
        [Required]
        public string City { get; set; }
        
        [Required]
        public string State { get; set; }
        
        [Required]
        public string ZipCode { get; set; }
        
        [Required]
        public string Country { get; set; }
        
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
    
    public class CreateOrderItemDto
    {
        [Required]
        public string ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
} 