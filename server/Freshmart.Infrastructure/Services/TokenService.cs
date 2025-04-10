using Freshmart.Core.Interfaces;
using Freshmart.Infrastructure.Data.DbEntities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Freshmart.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;

        public TokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        public async Task<string> GenerateJwtTokenAsync(Guid userId, string email, string firstName, string lastName, string imageUrl)
        {
            var claims = await GetClaimsAsync(userId, email, firstName, lastName, imageUrl);
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: GetTokenExpiration(),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<IEnumerable<Claim>> GetClaimsAsync(Guid userId, string email, string firstName, string lastName, string imageUrl)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, $"{firstName} {lastName}"),
                new Claim("FirstName", firstName),
                new Claim("LastName", lastName),
                new Claim("ImageUrl", imageUrl ?? string.Empty)
            };

            // Get user roles
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            return claims;
        }

        public DateTime GetTokenExpiration()
        {
            return DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["JWT:ExpiryInDays"]));
        }
    }
} 