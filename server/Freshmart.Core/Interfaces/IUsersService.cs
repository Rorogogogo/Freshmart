using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Users;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Freshmart.Core.Interfaces
{
    public interface IUsersService
    {
        Task<UserProfileResponseDto> GetUserProfileAsync(Guid userId);
        Task<UserProfileResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileDto model);
        Task<ApiResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto model);
        Task<UserProfileResponseDto> UpdateProfilePictureAsync(Guid userId, IFormFile file);
        Task<ApiResponseDto> DeleteAccountAsync(Guid userId);
        
        Task<DataCollectionApiResponseDto<UserDto>> GetAllUsersAsync(int page = 1, int pageSize = 10, string searchTerm = null);
        Task<ApiResponseDto<UserDto>> GetUserByIdAsync(Guid id);
        Task<ApiResponseDto<UserDto>> UpdateUserAsync(Guid id, AdminUpdateUserDto model);
        Task<ApiResponseDto<bool>> DeleteUserAsync(Guid id);
    }
} 