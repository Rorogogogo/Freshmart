namespace Freshmart.Core.Settings
{
    public class EmailSettings
    {
        public string FromEmail { get; set; }
        public string DisplayName { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public bool UseDefaultCredentials { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
} 