namespace JobBoard.Models.Industry
{
	public class Industries
	{
		// Industry to ID
		public static readonly Dictionary<string, int> Ids = new Dictionary<string, int>();
		static Industries()
		{
			Ids.Clear();
			Ids.Add("Accounting", 1);
			Ids.Add("Accounting and Finance", 2);
			Ids.Add("Account Management", 3);
			Ids.Add("Account Management/Customer Success", 4);
			Ids.Add("Administration and Office", 5);
			Ids.Add("Advertising and Marketing", 6);
			Ids.Add("Animal Care", 7);
			Ids.Add("Arts", 8);
			Ids.Add("Business Operations", 9);
			Ids.Add("Cleaning and Facilities", 10);
			Ids.Add("Computer and IT", 11);
			Ids.Add("Construction", 12);
			Ids.Add("Corporate", 13);
			Ids.Add("Customer Service", 14);
			Ids.Add("Data and Analytics", 15);
			Ids.Add("Data Science", 16);
			Ids.Add("Design", 17);
			Ids.Add("Design and UX", 18);
			Ids.Add("Editor", 19);
			Ids.Add("Education", 20);
			Ids.Add("Energy Generation and Mining", 21);
			Ids.Add("Entertainment and Travel Services", 22);
			Ids.Add("Farming and Outdoors", 23);
			Ids.Add("Food and Hospitality Services", 24);
			Ids.Add("Healthcare", 25);
			Ids.Add("HR", 26);
			Ids.Add("Human Resources and Recruitment", 27);
			Ids.Add("Installation, Maintenance, and Repairs", 28);
			Ids.Add("IT", 29);
			Ids.Add("Law", 30);
			Ids.Add("Legal Services", 31);
			Ids.Add("Management", 32);
			Ids.Add("Manufacturing and Warehouse", 33);
			Ids.Add("Marketing", 34);
			Ids.Add("Mechanic", 35);
			Ids.Add("Media, PR, and Communications", 36);
			Ids.Add("Mental Health", 37);
			Ids.Add("Nurses", 38);
			Ids.Add("Office Administration", 39);
			Ids.Add("Personal Care and Services", 40);
			Ids.Add("Physical Assistant", 41);
			Ids.Add("Product", 42);
			Ids.Add("Product Management", 43);
			Ids.Add("Project Management", 44);
			Ids.Add("Protective Services", 45);
			Ids.Add("Public Relations", 46);
			Ids.Add("Real Estate", 47);
			Ids.Add("Recruiting", 48);
			Ids.Add("Retail", 49);
			Ids.Add("Sales", 50);
			Ids.Add("Science and Engieneering", 51);
			Ids.Add("Social Services", 52);
			Ids.Add("Software Engineering", 53);
			Ids.Add("Sports, Fitness, and Recreation", 54);
			Ids.Add("Transportation and Logistics", 55);
			Ids.Add("Unknown", 56);
			Ids.Add("UX", 57);
			Ids.Add("Videography", 58);
			Ids.Add("Writer", 59);
			Ids.Add("Writing and Editing", 60);
		}
	}
}
