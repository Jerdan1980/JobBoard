namespace JobBoard.Models.Muse
{
	public class MuseJobPage
	{
		public int Page { get; set; }
		public int Page_Count { get; set; }
		public int Items_Per_Page { get; set; }
		public int Took { get; set; }
		public bool Timed_Out { get; set; }
		public long Total { get; set; }
		public List<MuseJob> Results { get; set; }
	}
}