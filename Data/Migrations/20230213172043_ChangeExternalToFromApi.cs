using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobBoard.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeExternalToFromApi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "External",
                table: "Jobs",
                newName: "FromApi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FromApi",
                table: "Jobs",
                newName: "External");
        }
    }
}
