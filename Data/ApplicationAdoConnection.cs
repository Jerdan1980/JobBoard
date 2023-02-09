using JobBoard.Models.Competitions;
using Microsoft.Data.SqlClient;

namespace JobBoard.Data
{
	public class ApplicationAdoConnection
	{
		private static bool _isConnectionStringSet = false;
		private static string _connectionString = string.Empty;

		// Ensures that only one ConnectionString exists
		// Workaround to mimic the controller database injection
		public static string ConnectionString
		{
			get
			{
				// Throw an error if the connection string hasn't been set yet
				if (!_isConnectionStringSet)
					throw new NullReferenceException();

				return _connectionString;
			}
			set
			{
				if (!_isConnectionStringSet)
				{
					_connectionString = value;
					_isConnectionStringSet = true;
				}
			}
		}

		public static async Task UpsertCompetitions(List<CompetitionModification> competitions)
		{
			foreach (CompetitionModification competition in competitions)
			{
				await UpsertCompetition(competition);
				await InsertCompetitionTags(competition);
			}
		}

		public static async Task<bool> UpsertCompetition(CompetitionModification competition)
		{
			try
			{
				SqlConnection connection = new SqlConnection(ConnectionString);
				SqlCommand command = connection.CreateCommand();

				// Not guaranteed but can expect Name and automation to stay the same
				// Mainly updates description, start time, end time, and tags
				command.CommandText = """
					MERGE INTO Competitions AS tgt
					USING (SELECT @name, @description, @starttime, @endtime, @automated) AS src (Name, Description, StartTime, EndTime, Automated)
					ON (tgt.Name = src.Name AND tgt.Automated = src.Automated)
					WHEN MATCHED THEN
						UPDATE SET Description = src.Description, StartTime = src.StartTime, EndTime = src.EndTime, Automated = src.Automated
					WHEN NOT MATCHED THEN
						INSERT (Name, Description, StartTime, EndTime, Automated) VALUES (src.Name, src.Description, src.StartTime, src.EndTime, src.Automated);
				""";

				// Note: SQL takes STRING for DATETIME and BOOL
				command.Parameters.AddWithValue("@name", competition.Name);
				command.Parameters.AddWithValue("@description", competition.Description);
				command.Parameters.AddWithValue("@starttime", competition.StartTime.ToString());
				command.Parameters.AddWithValue("@endtime", competition.EndTime.ToString());
				command.Parameters.AddWithValue("@automated", competition.Automated.ToString());

				await connection.OpenAsync();
				await command.ExecuteNonQueryAsync();
				await connection.CloseAsync();
				return true;
			}
			catch (Exception ex)
			{
				return false;
			}
		}

		public static async Task<bool> InsertCompetitionTags(CompetitionModification competition)
		{
			try
			{
				SqlConnection connection = new SqlConnection(ConnectionString);
				SqlCommand command0 = connection.CreateCommand();

				// Not guaranteed but can expect Name and automation to stay the same
				// Mainly updates description, start time, end time, and tags
				command0.CommandText = """
					SELECT Id from Competitions WHERE Name = @name AND Automated = @automated
				""";

				command0.Parameters.AddWithValue("@name", competition.Name);
				command0.Parameters.AddWithValue("@automated", competition.Automated);

				await connection.OpenAsync();
				SqlDataReader reader = await command0.ExecuteReaderAsync();
				int id = -1;
				if (reader.HasRows && reader.Read())
					id = reader.GetInt32(0);
				// Need to close the connection because it was read from
				await connection.CloseAsync();

				if (id == -1)
				{
					return false;
				}

				await connection.OpenAsync();
				foreach (int tagId in competition.TagIds ?? new int[] { })
				{
					SqlCommand command = connection.CreateCommand();

					// Only insert tags if they don't already exist
					// Don't have to worry about removing tags - that can be done by an admin
					command.CommandText = """
						BEGIN
							IF NOT EXISTS (
								SELECT * FROM CompetitionModelTagModel
								WHERE CompetitionsId = @compId AND TagsId = @tagId
							)
							BEGIN
								INSERT INTO CompetitionModelTagModel (CompetitionsId, TagsId)
								VALUES (@compId, @tagId)
							END
						END;
					""";

					command.Parameters.AddWithValue("@compId", id);
					command.Parameters.AddWithValue("@tagId", tagId);
					await command.ExecuteNonQueryAsync();
				}

				await connection.CloseAsync();
				return true;
			}
			catch (Exception ex)
			{
				return false;
			}
		}
	}
}
