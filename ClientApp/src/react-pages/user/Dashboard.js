import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function Dashboard() {
	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="dashboard"/>

				<div className='col'>
					<h1>Dashboard</h1>

					<ul>
						<li>You have <strong>10</strong> jobs matching your preferences</li>
						<li>You have <strong>10</strong> competitions matching your preferences</li>
						<li>You have <strong>10</strong> unreviewed job applications</li>
					</ul>
					
				</div>

			</div>
		</>
	)
}