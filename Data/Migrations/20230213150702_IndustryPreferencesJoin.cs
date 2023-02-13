﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobBoard.Data.Migrations
{
    /// <inheritdoc />
    public partial class IndustryPreferencesJoin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationUserIndustryModel",
                columns: table => new
                {
                    IndustryPreferencesId = table.Column<int>(type: "int", nullable: false),
                    UsersId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserIndustryModel", x => new { x.IndustryPreferencesId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserIndustryModel_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserIndustryModel_Industries_IndustryPreferencesId",
                        column: x => x.IndustryPreferencesId,
                        principalTable: "Industries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserIndustryModel_UsersId",
                table: "ApplicationUserIndustryModel",
                column: "UsersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationUserIndustryModel");
        }
    }
}
