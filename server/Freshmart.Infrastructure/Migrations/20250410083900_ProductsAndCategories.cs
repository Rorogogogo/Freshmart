using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Freshmart.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ProductsAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "f048cfbc-fe4d-428f-8dbc-85fddac829b6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "Id",
                keyValue: new Guid("c9d4c053-49b6-410c-bc78-2d54a9991873"),
                column: "ConcurrencyStamp",
                value: "5891416d-0199-428e-a3a5-d91bba63bfd2");
        }
    }
}
