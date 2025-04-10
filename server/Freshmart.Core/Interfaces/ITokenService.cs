using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateJwtTokenAsync(Guid userId, string email, string firstName, string lastName, string imageUrl);
        Task<IEnumerable<Claim>> GetClaimsAsync(Guid userId, string email, string firstName, string lastName, string imageUrl);
        DateTime GetTokenExpiration();
    }
} 