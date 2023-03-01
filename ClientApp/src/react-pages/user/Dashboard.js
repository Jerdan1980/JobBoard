import React, { useState, useEffect } from 'react';
import { useAuthApi } from '../../components/CustomHooks';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function Dashboard() {

	// Stores user preferences
	const [preferences, setPreferences] = useAuthApi('api/self/preferences/count', { careersCount: 0, competitionsCount: 0, industryIds: [], tagIds: [] });

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="dashboard"/>

				<div className='col'>
					<h1>Dashboard</h1>

					<ul>
						<li>You have <strong>{preferences.careersCount}</strong> jobs matching your preferences. View them <a href={"/jobs?" + preferences.industryIds.map(i => `industry=${i}`).join('&')}>Here</a></li>
						<li>You have <strong>{preferences.competitionsCount}</strong> competitions matching your preferences. View them <a href={"/competitions?" + preferences.tagIds.map(t => `tag=${t}`).join('&')}>Here</a></li>
					</ul>
					
				</div>

			</div>
		</>
	)
}