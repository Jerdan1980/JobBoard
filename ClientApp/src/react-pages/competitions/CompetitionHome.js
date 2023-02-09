import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import authService from '../../components/api-authorization/AuthorizeService';
import Timer from '../../components/Timer';

export default function CompetitionHome({  }) {
	// Grabs id and type from the url (technically the queryString)
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');
	const auto = queryString.get('type');

	// Competition information
	const [competition, setCompetition] = useState({ name: "", description: "", tags: [] });
	
	// Stores login status
	const [loggedIn, setLoggedIn] = useState(false);

	// GETs the competition and login status
	useEffect(() => {
		fetch(`/api/comps/${auto}/${id}`)
			.then(response => response.json())
			.then(data => setCompetition(data));
				
		(async function() {
			const token = await authService.getAccessToken()
			setLoggedIn(token != null);
		})();
	}, []);

	return (
		<div>
			<div class="row">
				<div class="col">
					<h1>{competition.name}</h1>
				</div>
				<div class="col position-relative">
					<a class={"btn btn-primary position-absolute top-0 end-0" + (!loggedIn ? " disabled" : "")} href={`/competitions/edit?id=${competition.id}&type=${auto}`}>Edit</a>
				</div>
			</div>

			{/* Displays tags if there are any */}
			{competition.tags.length != 0 && (
				<p>
					Tags: {competition.tags.map(tag => (
						<a class="btn btn-sm btn-outline-light me-1" href={`/tag?id=${tag.id}`}>{tag.name}</a>
					))}
				</p>
			)}

			{/* Displays the timer if there is one */}
			{(competition.startTime) && (
				<div class="mb-2">
						<Timer comp={competition}/>
				</div>
			)}

			<Markdown contents={competition.description} />
			
		</div>
	);
}