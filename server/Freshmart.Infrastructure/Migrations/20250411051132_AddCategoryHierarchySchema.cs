using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryHierarchySchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991871"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991872"));

            migrationBuilder.AddColumn<Guid>(
                name: "ParentId",
                table: "categories",
                type: "uuid",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "c9d4c053-49b6-410c-bc78-2d54a9991875", "AQAAAAIAAYagAAAAEE0jo/HFHDTvK8/Rnf7jUS8iCb4W0I9cDQc1XAkFZLHlJwLYU/BHdNhsQtE/gdS7xA==" });

            migrationBuilder.CreateIndex(
                name: "IX_categories_ParentId",
                table: "categories",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_categories_categories_ParentId",
                table: "categories",
                column: "ParentId",
                principalTable: "categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categories_categories_ParentId",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "IX_categories_ParentId",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "ParentId",
                table: "categories");

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "Id", "CreatedAt", "Description", "ImageUrl", "IsDeleted", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("c9d4c053-49b6-410c-bc78-2d54a9991870"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh fruits", "/images/categories/fruits.jpg", false, "Fruits", null },
                    { new Guid("c9d4c053-49b6-410c-bc78-2d54a9991871"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh vegetables", "/images/categories/vegetables.jpg", false, "Vegetables", null },
                    { new Guid("c9d4c053-49b6-410c-bc78-2d54a9991872"), new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Dairy products", "/images/categories/dairy.jpg", false, "Dairy", null }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "5a329576-053b-4764-868b-07d34ba48618", "AQAAAAIAAYagAAAAEH8K562A1KbQYmrHj9PZ3VsosoF+OKRZWkF3rJihV+LsDn0bPLLnOIaEcCAwyBdUvw==" });
        }
    }
}
