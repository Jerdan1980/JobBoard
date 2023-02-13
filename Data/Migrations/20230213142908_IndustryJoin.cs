using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobBoard.Data.Migrations
{
    /// <inheritdoc />
    public partial class IndustryJoin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Jobs_IndustryId",
                table: "Jobs",
                column: "IndustryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Jobs_Industries_IndustryId",
                table: "Jobs",
                column: "IndustryId",
                principalTable: "Industries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Jobs_Industries_IndustryId",
                table: "Jobs");

            migrationBuilder.DropIndex(
                name: "IX_Jobs_IndustryId",
                table: "Jobs");
        }
    }
}
