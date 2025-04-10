using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeImageUrlNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "categories",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "281f4e3e-1013-4e3c-80f4-5cc07de46cfb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "categories",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "0cfba2c3-1ac8-4397-a2af-d0ea970c5136");
        }
    }
}
