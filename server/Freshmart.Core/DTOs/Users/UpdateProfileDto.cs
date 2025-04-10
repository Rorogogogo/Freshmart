using System.ComponentModel.DataAnnotations;

namespace Freshmart.Core.DTOs.Users
{
    public class UpdateProfileDto
    {
        [Required]
        public string FirstName { get; set; }
        
        [Required]
        public string LastName { get; set; }
    }
} 