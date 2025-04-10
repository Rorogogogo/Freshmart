using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Freshmart.Core.Interfaces
{
    public interface IImageService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task<string> UploadImageAsync(string base64Image, string fileName = null);
        Task<bool> DeleteImageAsync(string publicId);
    }
} 