import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function Dashboard() {
	// Stores auth token
	const [userToken, setUserToken] = useState(null);

	// Stores user preferences
	const [preferences, setPreferences] = useState({ careersCount: 0, competitionsCount: 0, industryIds: [], tagIds: [] });

	useEffect(() => {
		(async function () {
			const token = await authService.getAccessToken();
			setUserToken(token);
			
			// check if the resume was already uploaded
			let response = await fetch(`api/self/preferences/count`, { 
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});
			if (response.ok) {
				let data = await response.json();
				console.log(data);
				setPreferences(data)
			}
		})();
	}, []);

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="dashboard"/>

				<div className='col'>
					<h1>Dashboard</h1>

					<ul>
						<li>You have <strong>{preferences.careersCount}</strong> jobs matching your preferences. View them <a href={"/jobs?" + preferences.industryIds.map(i => `industry=${i}`).join('&')}>Here</a></li>
						<li>You have <strong>{preferences.competitionsCount}</strong> competitions matching your preferences. View them <a href={"/competitions?" + preferences.tagIds.map(t => `tag=${t}`).join('&')}>Here</a></li>
						<li>You have <strong>INSERT NUMBER HERE</strong> unreviewed job applications</li>
					</ul>
					
				</div>

			</div>
		</>
	)
}