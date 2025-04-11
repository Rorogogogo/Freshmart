using Freshmart.Core.DTOs;
using System;

namespace Freshmart.Core.DTOs.Auth
{
    public class AuthResponseDto : ApiResponseDto
    {
        public AuthResultDto Data { get; set; }
    }

    public class AuthResultDto
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        public string[] Roles { get; set; }
    }
} 
using System;

namespace Freshmart.Core.DTOs.Auth
{
    public class AuthResponseDto : ApiResponseDto
    {
        public AuthResultDto Data { get; set; }
    }

    public class AuthResultDto
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public UserDto User { get; set; }
    }

    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        public string[] Roles { get; set; }
    }
} 