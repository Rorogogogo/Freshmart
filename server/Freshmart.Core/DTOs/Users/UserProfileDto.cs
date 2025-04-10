using System;

namespace Freshmart.Core.DTOs.Users
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
    }
} 