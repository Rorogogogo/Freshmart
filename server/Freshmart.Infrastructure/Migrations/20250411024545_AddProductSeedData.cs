using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "ImageUrl", "IsDeleted", "Name", "Price", "Rating", "ReviewCount", "StockQuantity", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991880"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh red apples", "/images/products/apple.jpg", false, "Apple", 1.99m, 4.5m, 28, 100, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991881"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh yellow bananas", "/images/products/banana.jpg", false, "Banana", 0.99m, 4.8m, 32, 150, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991882"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh juicy oranges", "/images/products/orange.jpg", false, "Orange", 1.49m, 4.6m, 24, 80, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991883"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991871"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh organic carrots", "/images/products/carrot.jpg", false, "Carrot", 1.29m, 4.4m, 18, 120, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991884"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991871"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh green broccoli", "/images/products/broccoli.jpg", false, "Broccoli", 1.99m, 4.3m, 15, 70, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991885"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991871"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh leafy spinach", "/images/products/spinach.jpg", false, "Spinach", 2.49m, 4.7m, 22, 60, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991886"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991872"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh whole milk", "/images/products/milk.jpg", false, "Milk", 2.99m, 4.9m, 37, 50, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991887"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991872"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Premium cheddar cheese", "/images/products/cheese.jpg", false, "Cheese", 3.99m, 4.8m, 29, 40, null },
                    { new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991888"), new Guid("c9d4c053-49b6-410c-bc78-2d54a9991872"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Natural Greek yogurt", "/images/products/yogurt.jpg", false, "Yogurt", 1.79m, 4.6m, 26, 90, null }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "dfd92623-8828-4d7f-ba7f-d25b5fbfb978");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991880"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991881"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991882"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991883"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991884"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991885"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991886"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991887"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "Id",
                keyValue: new Guid("7a4b1c53-49b6-410c-bc78-2d54a9991888"));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "281f4e3e-1013-4e3c-80f4-5cc07de46cfb");
        }
    }
}
