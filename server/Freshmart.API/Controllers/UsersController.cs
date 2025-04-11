using Freshmart.Core.DTOs.Users;
using Freshmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freshmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        // Admin endpoints

        [HttpGet]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string searchTerm = null)
        {
            var result = await _usersService.GetAllUsersAsync(page, pageSize, searchTerm);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var result = await _usersService.GetUserByIdAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] AdminUpdateUserDto model)
        {
            var result = await _usersService.UpdateUserAsync(id, model);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _usersService.DeleteUserAsync(id);
            return StatusCode(result.StatusCode, result);
        }

        // User profile endpoints

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var result = await _usersService.GetUserProfileAsync(userId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }

            return Ok(result);
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var result = await _usersService.UpdateProfileAsync(userId, model);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }

            return Ok(result);
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var result = await _usersService.ChangePasswordAsync(userId, model);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }

            return Ok(result);
        }

        [HttpPost("profile-picture")]
        [Authorize]
        public async Task<IActionResult> UpdateProfilePicture([FromForm] IFormFile file)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var result = await _usersService.UpdateProfilePictureAsync(userId, file);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }

            return Ok(result);
        }

        [HttpDelete("account")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }

            var result = await _usersService.DeleteAccountAsync(userId);
            
            if (!result.Success)
            {
                return StatusCode(result.StatusCode, result);
            }

            return Ok(result);
        }

        private Guid GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userId, out Guid id) ? id : Guid.Empty;
        }
    }
} 