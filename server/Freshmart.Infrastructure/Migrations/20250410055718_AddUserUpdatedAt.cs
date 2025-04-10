using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                columns: new[] { "ConcurrencyStamp", "ImageUrl", "UpdatedAt" },
                values: new object[] { "5891416d-0199-428e-a3a5-d91bba63bfd2", "/images/default-profile.jpg", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "users");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "users");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "cb41868e-180f-446b-8fbd-69c0049c6ec4");
        }
    }
}
