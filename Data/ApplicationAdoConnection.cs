using JobBoard.Models.Competitions;
using JobBoard.Models.Jobs;
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
				return !_isConnectionStringSet ? throw new NullReferenceException() : _connectionString;
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
			catch (Exception)
			{
				return false;
			}
		}

        public static async Task UpsertJobs(List<JobModel> jobs)
        {
            foreach (JobModel job in jobs)
            {
                await UpsertJob(job);
            }
        }

        public static async Task<bool> UpsertJob(JobModel job)
        {
            try
            {
                SqlConnection connection = new SqlConnection(ConnectionString);
                SqlCommand command = connection.CreateCommand();

                // Not guaranteed but can expect Name and automation to stay the same
                // Mainly updates description, start time, end time, and tags
                command.CommandText = """
					MERGE INTO Jobs AS tgt
					USING (SELECT @contents, @name, @type, @date, @expirationDate, @locations, @industryId, @experience, @company, @fromApi, @appLink) AS src (Contents, Name, Type, Date, ExpirationDate, Locations, IndustryId, Experience, Company, FromApi, ApplicationLink)
					ON (tgt.Name = src.Name AND tgt.FromApi = src.FromApi)
					WHEN MATCHED THEN
						UPDATE SET Contents = src.Contents, Name = src.Name, Type = src.Type, Date = src.Date, ExpirationDate = src.ExpirationDate, Locations = src.Locations, IndustryId = src.IndustryId, Experience = src.Experience, Company = src.Company, FromApi = src.FromApi, ApplicationLink = src.ApplicationLink
					WHEN NOT MATCHED THEN
						INSERT (Contents, Name, Type, Date, ExpirationDate, Locations, IndustryId, Experience, Company, FromApi, ApplicationLink) VALUES (src.Contents, src.Name, src.Type, src.Date, src.ExpirationDate, src.Locations, src.IndustryId, src.Experience, src.Company, src.FromApi, src.ApplicationLink);
				""";

                // Note: SQL takes STRING for DATETIME and BOOL
                command.Parameters.AddWithValue("@contents", job.Contents);
                command.Parameters.AddWithValue("@name", job.Name);
                command.Parameters.AddWithValue("@type", job.Type);
                command.Parameters.AddWithValue("@date", job.Date.ToString());
				command.Parameters.AddWithValue("@expirationDate", job.ExpirationDate.ToString());
                command.Parameters.AddWithValue("@locations", job.Locations);
                command.Parameters.AddWithValue("@industryId", job.IndustryId);
                command.Parameters.AddWithValue("@experience", job.Experience); 
				command.Parameters.AddWithValue("@company", job.Company);
                command.Parameters.AddWithValue("@fromApi", job.FromApi.ToString());
				command.Parameters.AddWithValue("@appLink", job.ApplicationLink);
                
                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();
                await connection.CloseAsync();
                return true;
            }
            catch (Exception)
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
			catch (Exception)
			{
				return false;
			}
		}
	}
}
