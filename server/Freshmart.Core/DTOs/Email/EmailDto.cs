using System.Collections.Generic;

namespace Freshmart.Core.DTOs.Email
{
    public class EmailDto
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<string> Cc { get; set; } = new List<string>();
        public List<string> Bcc { get; set; } = new List<string>();
    }
} 