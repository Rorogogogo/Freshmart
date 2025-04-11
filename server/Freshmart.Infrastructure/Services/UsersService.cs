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
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Freshmart.Infrastructure.Services
{
    public class UsersService : IUsersService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<UsersService> _logger;

        public UsersService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<Guid>> roleManager,
            IWebHostEnvironment webHostEnvironment,
            ILogger<UsersService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
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

        // New admin methods
        public async Task<DataCollectionApiResponseDto<UserDto>> GetAllUsersAsync(int page = 1, int pageSize = 10, string searchTerm = null)
        {
            var response = new DataCollectionApiResponseDto<UserDto>();
            
            try
            {
                var query = _userManager.Users.Where(u => !u.IsDeleted);
                
                // Apply search if provided
                if (!string.IsNullOrWhiteSpace(searchTerm))
                {
                    searchTerm = searchTerm.ToLower();
                    query = query.Where(u => 
                        u.Email.ToLower().Contains(searchTerm) ||
                        u.FirstName.ToLower().Contains(searchTerm) ||
                        u.LastName.ToLower().Contains(searchTerm)
                    );
                }
                
                // Get total count for pagination
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
                
                // Apply pagination
                var users = await query
                    .OrderBy(u => u.Email)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                
                // Map to DTOs
                var userDtos = new List<UserDto>();
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    
                    userDtos.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        ImageUrl = user.ImageUrl,
                        Roles = roles,
                        EmailConfirmed = user.EmailConfirmed,
                        IsDeleted = user.IsDeleted,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt
                    });
                }
                
                response.Data = userDtos;
                response.Page = page;
                response.PageSize = pageSize;
                response.TotalCount = totalCount;
                response.TotalPages = totalPages;
                response.Message = "Users retrieved successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving users: {ex.Message}");
                response.Success = false;
                response.Message = "Error retrieving users";
                response.StatusCode = 500;
            }
            
            return response;
        }
        
        public async Task<ApiResponseDto<UserDto>> GetUserByIdAsync(Guid id)
        {
            var response = new ApiResponseDto<UserDto>();
            
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null || user.IsDeleted)
                {
                    response.Success = false;
                    response.Message = "User not found";
                    response.StatusCode = 404;
                    return response;
                }
                
                var roles = await _userManager.GetRolesAsync(user);
                
                response.Data = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl,
                    Roles = roles,
                    EmailConfirmed = user.EmailConfirmed,
                    IsDeleted = user.IsDeleted,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };
                
                response.Message = "User retrieved successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving user with ID {id}: {ex.Message}");
                response.Success = false;
                response.Message = "Error retrieving user";
                response.StatusCode = 500;
            }
            
            return response;
        }
        
        public async Task<ApiResponseDto<UserDto>> UpdateUserAsync(Guid id, AdminUpdateUserDto model)
        {
            var response = new ApiResponseDto<UserDto>();
            
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null || user.IsDeleted)
                {
                    response.Success = false;
                    response.Message = "User not found";
                    response.StatusCode = 404;
                    return response;
                }
                
                // Update basic info
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.UpdatedAt = DateTime.UtcNow;
                
                // Update email if it changed
                if (!string.Equals(user.Email, model.Email, StringComparison.OrdinalIgnoreCase))
                {
                    var emailExists = await _userManager.FindByEmailAsync(model.Email) != null;
                    if (emailExists)
                    {
                        response.Success = false;
                        response.Message = "Email is already in use";
                        response.StatusCode = 400;
                        return response;
                    }
                    
                    user.Email = model.Email;
                    user.UserName = model.Email; // UserName is the same as Email in our app
                    user.NormalizedEmail = model.Email.ToUpper();
                    user.NormalizedUserName = model.Email.ToUpper();
                }
                
                // Update user
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    response.Success = false;
                    response.Message = "Failed to update user information";
                    response.StatusCode = 400;
                    return response;
                }
                
                // Update roles
                var currentRoles = await _userManager.GetRolesAsync(user);
                var rolesToRemove = currentRoles.Except(model.Roles).ToList();
                var rolesToAdd = model.Roles.Except(currentRoles).ToList();
                
                if (rolesToRemove.Any())
                {
                    var removeResult = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                    if (!removeResult.Succeeded)
                    {
                        response.Success = false;
                        response.Message = "Failed to update user roles";
                        response.StatusCode = 400;
                        return response;
                    }
                }
                
                if (rolesToAdd.Any())
                {
                    // Ensure roles exist before adding
                    foreach (var role in rolesToAdd)
                    {
                        if (!await _roleManager.RoleExistsAsync(role))
                        {
                            await _roleManager.CreateAsync(new IdentityRole<Guid>(role));
                        }
                    }
                    
                    var addResult = await _userManager.AddToRolesAsync(user, rolesToAdd);
                    if (!addResult.Succeeded)
                    {
                        response.Success = false;
                        response.Message = "Failed to update user roles";
                        response.StatusCode = 400;
                        return response;
                    }
                }
                
                // Get updated roles
                var updatedRoles = await _userManager.GetRolesAsync(user);
                
                // Return updated user
                response.Data = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl,
                    Roles = updatedRoles,
                    EmailConfirmed = user.EmailConfirmed,
                    IsDeleted = user.IsDeleted,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                };
                
                response.Message = "User updated successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating user with ID {id}: {ex.Message}");
                response.Success = false;
                response.Message = "Error updating user";
                response.StatusCode = 500;
            }
            
            return response;
        }
        
        public async Task<ApiResponseDto<bool>> DeleteUserAsync(Guid id)
        {
            var response = new ApiResponseDto<bool>();
            
            try
            {
                var user = await _userManager.FindByIdAsync(id.ToString());
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
                user.Email = $"{user.Email}.deleted.{DateTime.UtcNow.Ticks}";
                user.NormalizedEmail = user.Email.ToUpper();
                user.UserName = user.Email;
                user.NormalizedUserName = user.NormalizedEmail;
                
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    response.Success = false;
                    response.Message = "Failed to delete user";
                    response.StatusCode = 400;
                    return response;
                }
                
                response.Data = true;
                response.Message = "User deleted successfully";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user with ID {id}: {ex.Message}");
                response.Success = false;
                response.Message = "Error deleting user";
                response.StatusCode = 500;
            }
            
            return response;
        }
    }
} 