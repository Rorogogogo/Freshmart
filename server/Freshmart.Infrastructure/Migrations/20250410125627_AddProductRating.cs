using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "products",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ReviewCount",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "0cfba2c3-1ac8-4397-a2af-d0ea970c5136");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "products");

            migrationBuilder.DropColumn(
                name: "ReviewCount",
                table: "products");

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "f048cfbc-fe4d-428f-8dbc-85fddac829b6");
        }
    }
}
