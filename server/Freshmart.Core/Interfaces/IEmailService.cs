using Freshmart.Core.DTOs.Email;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailDto emailDto);
    }
} 