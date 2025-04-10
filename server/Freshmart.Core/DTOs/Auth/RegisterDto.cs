using System.ComponentModel.DataAnnotations;

namespace Freshmart.Core.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
        
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
        
        public string? ImageUrl { get; set; }
    }
} 