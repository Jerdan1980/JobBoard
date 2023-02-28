import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import authService from '../../components/api-authorization/AuthorizeService';
import Timer from '../../components/Timer';
import AwardListItem from '../../components/AwardListItem';

export default function CompetitionHome() {
	// Grabs id and type from the url (technically the queryString)
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');

	// Competition information
	const [competition, setCompetition] = useState({ name: "", description: "", tags: [], awards: [] });
	
	// Stores login status
	const [loggedIn, setLoggedIn] = useState(false);

	// GETs the competition and login status
	useEffect(() => {
		fetch(`/api/competitions/${id}`)
			.then(response => response.json())
			.then(data => setCompetition(data));
				
		(async function() {
			const token = await authService.getAccessToken()
			setLoggedIn(token != null);
		})();
	}, [id]);

	return (
		<div>
			<div class="row">
				<div class="col">
					<h1>{competition.name}</h1>
				</div>
				<div class="col position-relative">
					<div class="position-absolute top-0 end-0">
						<a class={"btn btn-primary mx-1" + (!loggedIn ? " disabled" : "")} href={`/competitions/award?id=${competition.id}`}>Edit Awards</a>
						<a class={"btn btn-primary mx-1" + (!loggedIn ? " disabled" : "")} href={`/competitions/edit?id=${competition.id}`}>Edit Competition</a>
					</div>
				</div>
			</div>

			{/* Displays tags if there are any */}
			{competition.tags.length !== 0 && (
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

			
			{(competition.endTime && new Date(competition.endTime) < new Date()) && (
				<>
					<h2>Awards</h2>
					{competition.awards.length == 0 ?
						<p>No awards have been submitted.</p>
					:
					<div class="list-group">
						{competition.awards.map(award => {
							// have to fill in the gaps
							award.competition = competition;
							return (
								<AwardListItem award={award} linked={false} key={award.id}/>
							);
						})}
					</div>
					}
				</>
			)}
			
		</div>
	);
}