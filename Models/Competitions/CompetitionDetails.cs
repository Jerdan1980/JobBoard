using JobBoard.Models.Users;

namespace JobBoard.Models.Competitions
{
	public class CompetitionDetails : CompetitionModel
    {
		public List<AwardDTO> Awards { get; set; } = new List<AwardDTO>();

		// C# doesn't like implicit constructors due to compiler not being able to pick what to do
		// Instead replace with a Function
		//https://stackoverflow.com/questions/3401084/user-defined-conversion-operator-from-base-class
		public override CompetitionDetails ToCompetitionDetails()
		{
			return this;
		}
    }
}
