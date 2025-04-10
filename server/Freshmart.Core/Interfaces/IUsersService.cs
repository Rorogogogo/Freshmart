using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Users;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface IUsersService
    {
        Task<UserProfileResponseDto> GetUserProfileAsync(Guid userId);
        Task<UserProfileResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileDto model);
        Task<ApiResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto model);
        Task<UserProfileResponseDto> UpdateProfilePictureAsync(Guid userId, IFormFile file);
        Task<ApiResponseDto> DeleteAccountAsync(Guid userId);
    }
} 