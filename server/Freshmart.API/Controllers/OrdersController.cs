using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Order;
using Freshmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freshmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        
        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }
        
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<OrderDto>>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponseDto 
                { 
                    Success = false, 
                    Message = "Invalid order data", 
                    StatusCode = 400 
                });
            }
            
            var userId = GetUserId();
            var result = await _orderService.CreateOrderAsync(createOrderDto, userId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }
            
            return CreatedAtAction(nameof(GetOrderById), new { id = result.Data.Id }, result);
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<OrderDto>>> GetOrderById(string id)
        {
            if (!Guid.TryParse(id, out var orderId))
            {
                return BadRequest(new ApiResponseDto 
                { 
                    Success = false, 
                    Message = "Invalid order ID format", 
                    StatusCode = 400 
                });
            }
            
            var userId = GetUserId();
            var result = await _orderService.GetOrderByIdAsync(orderId, userId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }
            
            return Ok(result);
        }
        
        [HttpGet("number/{orderNumber}")]
        public async Task<ActionResult<ApiResponseDto<OrderDto>>> GetOrderByNumber(string orderNumber)
        {
            if (string.IsNullOrEmpty(orderNumber))
            {
                return BadRequest(new ApiResponseDto 
                { 
                    Success = false, 
                    Message = "Order number is required", 
                    StatusCode = 400 
                });
            }
            
            var userId = GetUserId();
            var result = await _orderService.GetOrderByOrderNumberAsync(orderNumber, userId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }
            
            return Ok(result);
        }
        
        [HttpGet]
        public async Task<ActionResult<DataCollectionApiResponseDto<OrderDto>>> GetUserOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var userId = GetUserId();
            var result = await _orderService.GetUserOrdersAsync(userId, page, pageSize);
            
            return Ok(result);
        }
        
        [HttpPost("{id}/send-confirmation")]
        public async Task<ActionResult<ApiResponseDto<bool>>> SendOrderConfirmation(string id)
        {
            if (!Guid.TryParse(id, out var orderId))
            {
                return BadRequest(new ApiResponseDto 
                { 
                    Success = false, 
                    Message = "Invalid order ID format", 
                    StatusCode = 400 
                });
            }
            
            var result = await _orderService.SendOrderConfirmationEmailAsync(orderId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }
            
            return Ok(result);
        }
        
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID not found in claims");
            }
            
            return userId;
        }
    }
} 