using Freshmart.Core.DTOs.Auth;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto model);
        Task<AuthResponseDto> LoginAsync(LoginDto model);
        Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto model);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<bool> SendPasswordResetEmailAsync(string email);
        Task<bool> ResetPasswordAsync(string userId, string token, string newPassword);
    }
} 