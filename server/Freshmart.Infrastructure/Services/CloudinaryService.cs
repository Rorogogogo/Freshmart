using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Freshmart.Core.Interfaces;
using Freshmart.Core.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Freshmart.Infrastructure.Services
{
    public class CloudinaryService : IImageService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IOptions<CloudinarySettings> config, ILogger<CloudinaryService> logger)
        {
            _logger = logger;
            
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    _logger.LogWarning("No file was uploaded");
                    return null;
                }

                using var stream = file.OpenReadStream();
                
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    return null;
                }

                return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading image: {ex.Message}");
                return null;
            }
        }

        public async Task<string> UploadImageAsync(string base64Image, string fileName = null)
        {
            try
            {
                if (string.IsNullOrEmpty(base64Image))
                {
                    _logger.LogWarning("No base64 image was provided");
                    return null;
                }

                // Remove the data URI prefix if present (e.g., "data:image/jpeg;base64,")
                if (base64Image.Contains(","))
                {
                    base64Image = base64Image.Split(',')[1];
                }

                byte[] imageBytes = Convert.FromBase64String(base64Image);
                
                using var stream = new MemoryStream(imageBytes);
                
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(fileName ?? Guid.NewGuid().ToString(), stream),
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    return null;
                }

                return uploadResult.SecureUrl.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error uploading base64 image: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteImageAsync(string publicId)
        {
            try
            {
                if (string.IsNullOrEmpty(publicId))
                {
                    _logger.LogWarning("No public ID was provided for deletion");
                    return false;
                }

                // Extract public ID from URL if necessary
                if (publicId.StartsWith("http"))
                {
                    publicId = publicId.Split('/').Last().Split('.').First();
                }

                var deleteParams = new DeletionParams(publicId);
                var result = await _cloudinary.DestroyAsync(deleteParams);

                if (result.Error != null)
                {
                    _logger.LogError($"Cloudinary delete error: {result.Error.Message}");
                    return false;
                }

                return result.Result == "ok";
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting image: {ex.Message}");
                return false;
            }
        }
    }
} 