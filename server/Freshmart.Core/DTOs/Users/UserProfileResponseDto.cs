using Freshmart.Core.DTOs;

namespace Freshmart.Core.DTOs.Users
{
    public class UserProfileResponseDto : ApiResponseDto
    {
        public UserProfileDto Data { get; set; }
    }
} 