using System.Collections.Generic;

namespace Freshmart.Core.DTOs
{
    public class ApiResponseDto
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; } = 200;
    }

    public class ApiResponseDto<T> : ApiResponseDto
    {
        public T Data { get; set; }
    }

    public class DataCollectionApiResponseDto<T> : ApiResponseDto
    {
        public IEnumerable<T> Data { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int Page { get; set; }
    }
} 