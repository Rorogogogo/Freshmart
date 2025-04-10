using System.ComponentModel.DataAnnotations;

namespace Freshmart.Core.DTOs.Auth
{
    public class GoogleLoginDto
    {
        [Required]
        public string IdToken { get; set; }
    }
} 