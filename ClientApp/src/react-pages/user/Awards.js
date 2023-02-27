import React, { useEffect, useState } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';
import AwardListItem from '../../components/AwardListItem';

export default function Awards() {
	// Stores auth token
	const [userToken, setUserToken] = useState(null);

	// Stores awards
	const [awards, setAwards] = useState([]);

	useEffect(() => {
		(async function () {
			const token = await authService.getAccessToken();
			setUserToken(token);

			let response = await fetch(`api/self/awards`, {
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});

			if (response.ok) {
				let data = await response.json();
				console.log(data);
				setAwards(data);
			}
		})();
	}, []);

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="awards"/>

				<div className="col">
					<h1>Awards</h1>
					{awards.length == 0 ? 
						<p>You don't have any awards yet.</p>
					:
						<div class="list-group">
							{awards.map(award => (
								<AwardListItem award={award} linked={true} key={award.id}/>
							))}
						</div>
					}
				</div>
			</div>
		</>
	)
}