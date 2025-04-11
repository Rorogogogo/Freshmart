using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Email;
using Freshmart.Core.DTOs.Order;
using Freshmart.Core.Interfaces;
using Freshmart.Infrastructure.Data;
using Freshmart.Infrastructure.Data.DbEntities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Freshmart.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly FreshmartDbContext _context;
        private readonly IEmailService _emailService;
        
        public OrderService(FreshmartDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        
        public async Task<ApiResponseDto<OrderDto>> CreateOrderAsync(CreateOrderDto createOrderDto, Guid userId)
        {
            // Verify user exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return new ApiResponseDto<OrderDto> 
                { 
                    Success = false, 
                    Message = "User not found", 
                    StatusCode = 404 
                };
            }
            
            // Create order with unique number
            var order = new Order
            {
                UserId = userId,
                OrderNumber = GenerateOrderNumber(),
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                ShippingAddress = createOrderDto.ShippingAddress,
                City = createOrderDto.City,
                State = createOrderDto.State,
                ZipCode = createOrderDto.ZipCode,
                Country = createOrderDto.Country,
                PhoneNumber = createOrderDto.PhoneNumber,
                Email = createOrderDto.Email,
                TotalAmount = 0 // Will calculate this from items
            };
            
            // Add order to context
            await _context.Orders.AddAsync(order);
            
            // Process each item
            decimal orderTotal = 0;
            foreach (var item in createOrderDto.Items)
            {
                // Find product
                var productGuid = Guid.Parse(item.ProductId);
                var product = await _context.Products.FindAsync(productGuid);
                if (product == null)
                {
                    return new ApiResponseDto<OrderDto>
                    {
                        Success = false,
                        Message = $"Product with ID {item.ProductId} not found",
                        StatusCode = 404
                    };
                }
                
                // Check stock
                if (product.StockQuantity < item.Quantity)
                {
                    return new ApiResponseDto<OrderDto>
                    {
                        Success = false,
                        Message = $"Insufficient stock for product {product.Name}. Available: {product.StockQuantity}",
                        StatusCode = 400
                    };
                }
                
                // Create order item
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = item.Quantity,
                    Subtotal = product.Price * item.Quantity
                };
                
                // Add to context
                await _context.OrderItems.AddAsync(orderItem);
                
                // Update order total
                orderTotal += orderItem.Subtotal;
                
                // Update product stock
                product.StockQuantity -= item.Quantity;
            }
            
            // Set final order total
            order.TotalAmount = orderTotal;
            
            // Save all changes
            await _context.SaveChangesAsync();
            
            // Send confirmation email
            await SendOrderConfirmationEmailAsync(order.Id);
            
            // Return order details
            return new ApiResponseDto<OrderDto>
            {
                Success = true,
                Message = "Order created successfully",
                StatusCode = 201,
                Data = await MapOrderToDto(order)
            };
        }
        
        public async Task<ApiResponseDto<OrderDto>> GetOrderByIdAsync(Guid orderId, Guid userId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);
                
            if (order == null)
            {
                return new ApiResponseDto<OrderDto>
                {
                    Success = false,
                    Message = "Order not found",
                    StatusCode = 404
                };
            }
            
            // Check if this order belongs to the user (or is admin, implement later)
            if (order.UserId != userId)
            {
                return new ApiResponseDto<OrderDto>
                {
                    Success = false,
                    Message = "Unauthorized access to this order",
                    StatusCode = 403
                };
            }
            
            return new ApiResponseDto<OrderDto>
            {
                Success = true,
                Data = await MapOrderToDto(order)
            };
        }
        
        public async Task<ApiResponseDto<OrderDto>> GetOrderByOrderNumberAsync(string orderNumber, Guid userId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
                
            if (order == null)
            {
                return new ApiResponseDto<OrderDto>
                {
                    Success = false,
                    Message = "Order not found",
                    StatusCode = 404
                };
            }
            
            // Check if this order belongs to the user (or is admin, implement later)
            if (order.UserId != userId)
            {
                return new ApiResponseDto<OrderDto>
                {
                    Success = false,
                    Message = "Unauthorized access to this order",
                    StatusCode = 403
                };
            }
            
            return new ApiResponseDto<OrderDto>
            {
                Success = true,
                Data = await MapOrderToDto(order)
            };
        }
        
        public async Task<DataCollectionApiResponseDto<OrderDto>> GetUserOrdersAsync(Guid userId, int page = 1, int pageSize = 10)
        {
            // Validate pagination
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;
            
            // Query orders for this user
            var query = _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate);
                
            // Get total count for pagination
            var totalCount = await query.CountAsync();
            
            // Calculate total pages
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            
            // Get orders for current page
            var orders = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
                
            // Map to DTOs
            var orderDtos = new List<OrderDto>();
            foreach (var order in orders)
            {
                orderDtos.Add(await MapOrderToDto(order));
            }
            
            return new DataCollectionApiResponseDto<OrderDto>
            {
                Success = true,
                Data = orderDtos,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Page = page,
                PageSize = pageSize
            };
        }
        
        public async Task<ApiResponseDto<bool>> SendOrderConfirmationEmailAsync(Guid orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);
                
            if (order == null)
            {
                return new ApiResponseDto<bool>
                {
                    Success = false,
                    Message = "Order not found",
                    StatusCode = 404,
                    Data = false
                };
            }
            
            // Create email content
            var subject = $"Freshmart Order Confirmation - Order #{order.OrderNumber}";
            var body = await GenerateOrderEmailHtml(order);
            
            // Send email
            var emailDto = new EmailDto
            {
                To = order.Email,
                Subject = subject,
                Body = body
            };
            
            var result = await _emailService.SendEmailAsync(emailDto);
            
            return new ApiResponseDto<bool>
            {
                Success = result,
                Message = result ? "Order confirmation email sent" : "Failed to send order confirmation email",
                StatusCode = result ? 200 : 500,
                Data = result
            };
        }
        
        private async Task<OrderDto> MapOrderToDto(Order order)
        {
            // Ensure order items are loaded
            if (!_context.Entry(order).Collection(o => o.OrderItems).IsLoaded)
            {
                await _context.Entry(order).Collection(o => o.OrderItems).LoadAsync();
            }
            
            // Ensure user is loaded
            if (order.User == null && !_context.Entry(order).Reference(o => o.User).IsLoaded)
            {
                await _context.Entry(order).Reference(o => o.User).LoadAsync();
            }
            
            var orderDto = new OrderDto
            {
                Id = order.Id.ToString(),
                UserId = order.UserId.ToString(),
                OrderNumber = order.OrderNumber,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                City = order.City,
                State = order.State,
                ZipCode = order.ZipCode,
                Country = order.Country,
                PhoneNumber = order.PhoneNumber,
                Email = order.Email,
                UserName = order.User?.UserName ?? "Unknown"
            };
            
            // Map order items
            foreach (var item in order.OrderItems)
            {
                // Get product for image url
                var product = await _context.Products.FindAsync(item.ProductId);
                
                orderDto.Items.Add(new OrderItemDto
                {
                    Id = item.Id.ToString(),
                    ProductId = item.ProductId.ToString(),
                    ProductName = item.ProductName,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    Subtotal = item.Subtotal,
                    ProductImageUrl = product?.ImageUrl ?? ""
                });
            }
            
            return orderDto;
        }
        
        private string GenerateOrderNumber()
        {
            // Order number format: FMO-{timestamp}-{random}
            return $"FMO-{DateTime.UtcNow.ToString("yyyyMMddHHmmss")}-{new Random().Next(1000, 9999)}";
        }
        
        private async Task<string> GenerateOrderEmailHtml(Order order)
        {
            // Create a simple HTML email with order details
            var html = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ text-align: center; padding: 20px 0; }}
                        .order-info {{ border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 20px; }}
                        .items-table {{ width: 100%; border-collapse: collapse; }}
                        .items-table th, .items-table td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}
                        .total {{ font-weight: bold; text-align: right; margin-top: 20px; }}
                        .footer {{ text-align: center; margin-top: 30px; font-size: 12px; color: #777; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>Thank You for Your Order!</h1>
                            <p>Order Number: {order.OrderNumber}</p>
                        </div>
                        
                        <div class='order-info'>
                            <h2>Order Details</h2>
                            <p><strong>Date:</strong> {order.OrderDate.ToString("yyyy-MM-dd HH:mm")}</p>
                            <p><strong>Status:</strong> {order.Status}</p>
                            <p><strong>Total Amount:</strong> ${order.TotalAmount.ToString("0.00")}</p>
                            
                            <h3>Shipping Address</h3>
                            <p>{order.ShippingAddress}</p>
                            <p>{order.City}, {order.State} {order.ZipCode}</p>
                            <p>{order.Country}</p>
                            <p>Phone: {order.PhoneNumber}</p>
                        </div>
                        
                        <h2>Order Items</h2>
                        <table class='items-table'>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>";
                            
            foreach (var item in order.OrderItems)
            {
                html += $@"
                    <tr>
                        <td>{item.ProductName}</td>
                        <td>{item.Quantity}</td>
                        <td>${item.UnitPrice.ToString("0.00")}</td>
                        <td>${item.Subtotal.ToString("0.00")}</td>
                    </tr>";
            }
            
            html += $@"
                            </tbody>
                        </table>
                        
                        <div class='total'>
                            <p>Total: ${order.TotalAmount.ToString("0.00")}</p>
                        </div>
                        
                        <div class='footer'>
                            <p>If you have any questions, please contact our customer service.</p>
                            <p>&copy; {DateTime.UtcNow.Year} Freshmart. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>";
                
            return html;
        }
    }
} 