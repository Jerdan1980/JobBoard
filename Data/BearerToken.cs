using Microsoft.IdentityModel.JsonWebTokens;

namespace JobBoard.Data
{
	public class BearerToken
	{
		private static JsonWebTokenHandler _tokenHandler;

		static BearerToken()
		{
			_tokenHandler = new JsonWebTokenHandler();
		}

		public static string GetUserId(HttpRequest request)
		{
			string authHeader = request.Headers["Authorization"][0];
			if (!authHeader.StartsWith("Bearer "))
				return null;

			var token = authHeader.Substring("Bearer ".Length);
			//https://stackoverflow.com/questions/38340078/how-to-decode-jwt-token
			//JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
			//var jst = handler.ReadJwtToken(token);
			var jwt = _tokenHandler.ReadJsonWebToken(token);

			return jwt.Claims.First(claim => claim.Type == "sub").Value;
		}
	}
}
