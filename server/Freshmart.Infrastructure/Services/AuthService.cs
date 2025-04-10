using Freshmart.Core.DTOs.Auth;
using Freshmart.Core.DTOs.Email;
using Freshmart.Core.Interfaces;
using Freshmart.Infrastructure.Data.DbEntities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Freshmart.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto model)
        {
            var response = new AuthResponseDto();

            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                response.Success = false;
                response.Message = "User with this email already exists";
                response.StatusCode = 400;
                return response;
            }

            // Create new user
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                ImageUrl = model.ImageUrl ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = false,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                response.Success = false;
                response.Message = string.Join(", ", result.Errors.Select(e => e.Description));
                response.StatusCode = 400;
                return response;
            }

            // Add user to Customer role by default (case-sensitive)
            await _userManager.AddToRoleAsync(user, "CUSTOMER");

            // Generate email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var encodedUserId = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Id.ToString()));

            // Generate confirmation link
            var clientUrl = _configuration["ClientSettings:BaseUrl"];
            var confirmationLink = $"{clientUrl}/confirm-email?userId={encodedUserId}&token={encodedToken}";

            // Send confirmation email
            await SendConfirmationEmail(user.Email, user.FirstName, confirmationLink);

            // Generate JWT token
            var jwtToken = await _tokenService.GenerateJwtTokenAsync(
                user.Id, 
                user.Email,
                user.FirstName,
                user.LastName,
                user.ImageUrl
            );

            // Return success response
            response.Data = new AuthResultDto
            {
                Token = jwtToken,
                Expiration = _tokenService.GetTokenExpiration(),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl,
                    Roles = new[] { "CUSTOMER" }
                }
            };

            response.Message = "Registration successful! Please check your email to confirm your account.";
            return response;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto model)
        {
            var response = new AuthResponseDto();

            // Find user by email
            var user = await _userManager.FindByEmailAsync(model.Email);
            
            if (user == null)
            {
                response.Success = false;
                response.Message = "Invalid email or password";
                response.StatusCode = 401;
                return response;
            }

            // Check if email is confirmed
            if (!user.EmailConfirmed)
            {
                response.Success = false;
                response.Message = "Email not confirmed. Please check your inbox for the confirmation email.";
                response.StatusCode = 401;
                return response;
            }

            // Check if user is marked as deleted
            if (user.IsDeleted)
            {
                response.Success = false;
                response.Message = "Account has been deactivated";
                response.StatusCode = 401;
                return response;
            }

            // Check password
            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!signInResult.Succeeded)
            {
                response.Success = false;
                response.Message = "Invalid email or password";
                response.StatusCode = 401;
                return response;
            }

            // Generate JWT token
            var token = await _tokenService.GenerateJwtTokenAsync(
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.ImageUrl
            );
            
            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            // Return success response
            response.Data = new AuthResultDto
            {
                Token = token,
                Expiration = _tokenService.GetTokenExpiration(),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ImageUrl = user.ImageUrl,
                    Roles = roles.ToArray()
                }
            };

            response.Message = "Login successful";
            return response;
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto model)
        {
            var response = new AuthResponseDto();

            try
            {
                // Validate Google ID token
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _configuration["Google:ClientId"] }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(model.IdToken, validationSettings);
                
                // Check if user exists
                var user = await _userManager.FindByEmailAsync(payload.Email);
                
                if (user == null)
                {
                    // Create new user if not exists
                    user = new ApplicationUser
                    {
                        UserName = payload.Email,
                        Email = payload.Email,
                        FirstName = payload.GivenName,
                        LastName = payload.FamilyName,
                        ImageUrl = payload.Picture,
                        EmailConfirmed = payload.EmailVerified,
                        SecurityStamp = Guid.NewGuid().ToString()
                    };

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        response.Success = false;
                        response.Message = "Failed to create user account";
                        response.StatusCode = 400;
                        return response;
                    }

                    // Add user to Customer role
                    await _userManager.AddToRoleAsync(user, "CUSTOMER");
                }
                else if (user.IsDeleted)
                {
                    response.Success = false;
                    response.Message = "Account has been deactivated";
                    response.StatusCode = 401;
                    return response;
                }

                // Generate JWT token
                var token = await _tokenService.GenerateJwtTokenAsync(
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.ImageUrl
                );
                
                // Get user roles
                var roles = await _userManager.GetRolesAsync(user);

                // Return success response
                response.Data = new AuthResultDto
                {
                    Token = token,
                    Expiration = _tokenService.GetTokenExpiration(),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        ImageUrl = user.ImageUrl,
                        Roles = roles.ToArray()
                    }
                };

                response.Message = "Google login successful";
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Google login failed: {ex.Message}");
                response.Success = false;
                response.Message = "Invalid Google token";
                response.StatusCode = 401;
                return response;
            }
        }

        public async Task<bool> ConfirmEmailAsync(string userId, string token)
        {
            try
            {
                var decodedUserId = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(userId));
                var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

                var user = await _userManager.FindByIdAsync(decodedUserId);
                if (user == null)
                {
                    return false;
                }

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error confirming email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || user.IsDeleted)
            {
                return false;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var encodedEmail = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Email));

            var clientUrl = _configuration["ClientSettings:BaseUrl"];
            var resetLink = $"{clientUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

            var emailDto = new EmailDto
            {
                To = user.Email,
                Subject = "Reset Your Password - Freshmart",
                Body = $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Reset Your Password</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                }}
                .header {{
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #f0f0f0;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #4F46E5;
                }}
                .content {{
                    padding: 30px 20px;
                }}
                h2 {{
                    color: #4F46E5;
                    margin-top: 0;
                }}
                .button {{
                    display: inline-block;
                    background-color: #4F46E5;
                    color: white !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: 600;
                    margin: 20px 0;
                    transition: background-color 0.3s;
                }}
                .button:hover {{
                    background-color: #3c35c9;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    color: #777;
                    font-size: 14px;
                    border-top: 1px solid #f0f0f0;
                }}
                .text-highlight {{
                    color: #4F46E5;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='logo'>Freshmart</div>
                </div>
                <div class='content'>
                    <h2>Reset Your Password</h2>
                    <p>Hello {user.FirstName},</p>
                    <p>We received a request to reset the password for your Freshmart account. To create a new password, click the button below:</p>
                    
                    <div style='text-align: center;'>
                        <a href='{resetLink}' class='button'>Reset My Password</a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style='word-break: break-all; font-size: 14px;'><a href='{resetLink}'>{resetLink}</a></p>
                    
                    <p>This link will expire in 24 hours for security reasons.</p>
                    
                    <p><strong>Important:</strong> If you didn't request this password reset, please ignore this email or contact our support team if you have concerns about your account security.</p>
                </div>
                <div class='footer'>
                    <p>Thank you for shopping with <span class='text-highlight'>Freshmart</span>!</p>
                    <p>&copy; {DateTime.UtcNow.Year} Freshmart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>"
            };

            return await _emailService.SendEmailAsync(emailDto);
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            try
            {
                var decodedEmail = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(email));
                var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

                var user = await _userManager.FindByEmailAsync(decodedEmail);
                if (user == null || user.IsDeleted)
                {
                    return false;
                }

                var result = await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error resetting password: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> SendConfirmationEmail(string email, string firstName, string confirmationLink)
        {
            var emailDto = new EmailDto
            {
                To = email,
                Subject = "Confirm Your Email - Freshmart",
                Body = $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Confirm Your Email</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                }}
                .header {{
                    text-align: center;
                    padding: 20px 0;
                    border-bottom: 1px solid #f0f0f0;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #4F46E5;
                }}
                .content {{
                    padding: 30px 20px;
                }}
                h2 {{
                    color: #4F46E5;
                    margin-top: 0;
                }}
                .button {{
                    display: inline-block;
                    background-color: #4F46E5;
                    color: white !important;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 5px;
                    font-weight: 600;
                    margin: 20px 0;
                    transition: background-color 0.3s;
                }}
                .button:hover {{
                    background-color: #3c35c9;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    color: #777;
                    font-size: 14px;
                    border-top: 1px solid #f0f0f0;
                }}
                .text-highlight {{
                    color: #4F46E5;
                    font-weight: 600;
                }}
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='logo'>Freshmart</div>
                </div>
                <div class='content'>
                    <h2>Almost there, {firstName}!</h2>
                    <p>Thank you for creating an account with Freshmart. We're excited to have you join our community!</p>
                    <p>To complete your registration and start enjoying our fresh products, please confirm your email address by clicking the button below:</p>
                    
                    <div style='text-align: center;'>
                        <a href='{confirmationLink}' class='button'>Confirm My Email</a>
                    </div>
                    
                    <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style='word-break: break-all; font-size: 14px;'><a href='{confirmationLink}'>{confirmationLink}</a></p>
                    
                    <p>This link will expire in 24 hours for security reasons.</p>
                    
                    <p>If you didn't create an account with us, please ignore this email.</p>
                </div>
                <div class='footer'>
                    <p>Thank you for choosing <span class='text-highlight'>Freshmart</span>!</p>
                    <p>&copy; {DateTime.UtcNow.Year} Freshmart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>"
            };

            return await _emailService.SendEmailAsync(emailDto);
        }
    }
} 