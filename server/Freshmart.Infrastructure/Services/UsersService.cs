using Freshmart.Core.DTOs;
using Freshmart.Core.DTOs.Users;
using Freshmart.Core.Interfaces;
using Freshmart.Infrastructure.Data.DbEntities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Freshmart.Infrastructure.Services
{
    public class UsersService : IUsersService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<UsersService> _logger;

        public UsersService(
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment webHostEnvironment,
            ILogger<UsersService> logger)
        {
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        public async Task<UserProfileResponseDto> GetUserProfileAsync(Guid userId)
        {
            var response = new UserProfileResponseDto();
            
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
            {
                response.Success = false;
                response.Message = "User not found";
                response.StatusCode = 404;
                return response;
            }

            response.Data = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ImageUrl = user.ImageUrl
            };

            return response;
        }

        public async Task<UserProfileResponseDto> UpdateProfileAsync(Guid userId, UpdateProfileDto model)
        {
            var response = new UserProfileResponseDto();
            
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
            {
                response.Success = false;
                response.Message = "User not found";
                response.StatusCode = 404;
                return response;
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = "Failed to update profile";
                response.StatusCode = 400;
                return response;
            }

            response.Data = new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ImageUrl = user.ImageUrl
            };
            
            response.Message = "Profile updated successfully";
            return response;
        }

        public async Task<ApiResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto model)
        {
            var response = new ApiResponseDto();
            
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
            {
                response.Success = false;
                response.Message = "User not found";
                response.StatusCode = 404;
                return response;
            }

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = "Failed to change password. Please check your current password.";
                response.StatusCode = 400;
                return response;
            }

            response.Message = "Password changed successfully";
            return response;
        }

        public async Task<UserProfileResponseDto> UpdateProfilePictureAsync(Guid userId, IFormFile file)
        {
            var response = new UserProfileResponseDto();
            
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
            {
                response.Success = false;
                response.Message = "User not found";
                response.StatusCode = 404;
                return response;
            }

            if (file == null || file.Length == 0)
            {
                response.Success = false;
                response.Message = "No file was uploaded";
                response.StatusCode = 400;
                return response;
            }

            try
            {
                // Check if file is an image
                if (!file.ContentType.StartsWith("image/"))
                {
                    response.Success = false;
                    response.Message = "The uploaded file is not an image";
                    response.StatusCode = 400;
                    return response;
                }

                // Create uploads directory if it doesn't exist
                string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "profile-pictures");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                string uniqueFileName = $"{userId}_{DateTime.UtcNow.Ticks}{Path.GetExtension(file.FileName)}";
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update user's profile picture URL
                string imageUrl = $"/uploads/profile-pictures/{uniqueFileName}";
                user.ImageUrl = imageUrl;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    response.Success = false;
                    response.Message = "Failed to update profile picture";
                    response.StatusCode = 400;
                    return response;
                }

                response.Data = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl
                };
                
                response.Message = "Profile picture updated successfully";
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating profile picture: {ex.Message}");
                response.Success = false;
                response.Message = "Failed to update profile picture";
                response.StatusCode = 500;
                return response;
            }
        }

        public async Task<ApiResponseDto> DeleteAccountAsync(Guid userId)
        {
            var response = new ApiResponseDto();
            
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || user.IsDeleted)
            {
                response.Success = false;
                response.Message = "User not found";
                response.StatusCode = 404;
                return response;
            }

            // Perform soft delete
            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;

            // Keep email but make it inactive by appending timestamp to ensure uniqueness
            // This allows the user to register again with the same email in the future
            user.Email = $"{user.Email}.deleted.{DateTime.UtcNow.Ticks}";
            user.NormalizedEmail = user.Email.ToUpper();
            user.UserName = user.Email;
            user.NormalizedUserName = user.NormalizedEmail;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = "Failed to delete account";
                response.StatusCode = 400;
                return response;
            }

            response.Message = "Account deleted successfully";
            return response;
        }
    }
} 