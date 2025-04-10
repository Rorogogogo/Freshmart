using Freshmart.Core.DTOs.Email;
using Freshmart.Core.Interfaces;
using Freshmart.Core.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Freshmart.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
        {
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(EmailDto emailDto)
        {
            try
            {
                var message = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.DisplayName),
                    Subject = emailDto.Subject,
                    Body = emailDto.Body,
                    IsBodyHtml = true
                };

                message.To.Add(new MailAddress(emailDto.To));

                foreach (var cc in emailDto.Cc)
                {
                    message.CC.Add(new MailAddress(cc));
                }

                foreach (var bcc in emailDto.Bcc)
                {
                    message.Bcc.Add(new MailAddress(bcc));
                }

                using (var client = new SmtpClient(_emailSettings.SmtpServer))
                {
                    client.Port = _emailSettings.Port;
                    client.Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password);
                    client.EnableSsl = _emailSettings.EnableSsl;
                    client.UseDefaultCredentials = _emailSettings.UseDefaultCredentials;
                    
                    await client.SendMailAsync(message);
                }

                _logger.LogInformation($"Email sent successfully to {emailDto.To}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {emailDto.To}: {ex.Message}");
                return false;
            }
        }
    }
} 