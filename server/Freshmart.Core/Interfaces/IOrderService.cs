using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Order;
using System;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponseDto<OrderDto>> CreateOrderAsync(CreateOrderDto createOrderDto, Guid userId);
        Task<ApiResponseDto<OrderDto>> GetOrderByIdAsync(Guid orderId, Guid userId);
        Task<ApiResponseDto<OrderDto>> GetOrderByOrderNumberAsync(string orderNumber, Guid userId);
        Task<DataCollectionApiResponseDto<OrderDto>> GetUserOrdersAsync(Guid userId, int page = 1, int pageSize = 10);
        Task<ApiResponseDto<bool>> SendOrderConfirmationEmailAsync(Guid orderId);
    }
} 