using Freshmart.Core.DTOs;
using Freshmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Freshmart.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImagesController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ProductImagesController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponseDto<string>>> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ApiResponseDto<string>
                {
                    Success = false,
                    Message = "No file uploaded",
                    StatusCode = 400
                });
            }

            // Check if file is an image
            if (!file.ContentType.StartsWith("image/"))
            {
                return BadRequest(new ApiResponseDto<string>
                {
                    Success = false,
                    Message = "File is not an image",
                    StatusCode = 400
                });
            }

            string imageUrl = await _imageService.UploadImageAsync(file);

            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, new ApiResponseDto<string>
                {
                    Success = false,
                    Message = "Failed to upload image",
                    StatusCode = 500
                });
            }

            return Ok(new ApiResponseDto<string>
            {
                Data = imageUrl,
                Success = true,
                Message = "Image uploaded successfully",
                StatusCode = 200
            });
        }

        [HttpPost("upload-base64")]
        // [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponseDto<string>>> UploadBase64Image([FromBody] Base64ImageDto imageDto)
        {
            if (string.IsNullOrEmpty(imageDto.Base64Image))
            {
                return BadRequest(new ApiResponseDto<string>
                {
                    Success = false,
                    Message = "No image data provided",
                    StatusCode = 400
                });
            }

            string imageUrl = await _imageService.UploadImageAsync(imageDto.Base64Image, imageDto.FileName);

            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, new ApiResponseDto<string>
                {
                    Success = false,
                    Message = "Failed to upload image",
                    StatusCode = 500
                });
            }

            return Ok(new ApiResponseDto<string>
            {
                Data = imageUrl,
                Success = true,
                Message = "Image uploaded successfully",
                StatusCode = 200
            });
        }
    }

    public class Base64ImageDto
    {
        public string Base64Image { get; set; }
        public string FileName { get; set; }
    }
} 