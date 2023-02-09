import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import CompetitionCard from '../../components/CompetitionCard';
import authService from '../../components/api-authorization/AuthorizeService';

export default function TagHome({  }) {
	// Grabs id from the url (technically the queryString)
	const id = new URLSearchParams(useLocation().search).get('id');

	// Tag information
	const [tag, setTag] = useState({id: 0, name: "", description: "", competitions: []});
	
	// Stores login status
	const [loggedIn, setLoggedIn] = useState(false);

	// Handles filter options
	const [showFilter, setShowFilter] = useState(false);
	const [showOngoing, setShowOngoing] = useState(true);
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUser, setShowUser] = useState(true);
	const [showAutomated, setShowAutomated] = useState(true);

	// Returns a bool depending on what the user wants.
	//		Works by filtering out any unwanted competitions.
	//		Uses shortcircuiting to quickly remove competitions
	function filter(comp) {
		const isCompleted = comp.endTime ? Date.parse(comp.endTime) < Date.now() : false;
		const isOngoing = comp.startTime ? Date.parse(comp.startTime) < Date.now() : false;

		return (
			(
				(showUser && !comp.automated) || (showAutomated && comp.automated)
			) && (
				!(!showCompleted && isCompleted) && !(!showOngoing && isOngoing)
			)
		)
	}

	// Grabs the list of comps and if a user is logged in
	useEffect(() => {
		fetch(`/api/tags/${id}`)
			.then(response => response.json())
			.then(data => setTag(data));
					
		(async function() {
			const token = await authService.getAccessToken()
			setLoggedIn(token != null);
		})();
	}, []);

	return (
		<div>
			<div class="row">
				<div class="col">
					<h1>Tag: {tag.name}</h1>
				</div>
				<div class="col position-relative">
					<a class={"btn btn-primary position-absolute top-0 end-0" + (!loggedIn ? " disabled" : "")} href={`/tags/edit?id=${id}`}>Edit</a>
				</div>
			</div>

			{tag.description &&
				<Markdown contents={tag.description} />
			}
			
			{/* List of competitions */}
			{tag.competitions.filter(comp => filter(comp)).map(comp => {
				return (
					<CompetitionCard comp={comp} />
				);
			})}

			{/* Floating button to open the filter side panel */}
			<div class="sticky-bottom d-flex justify-content-end">
				<button class="btn btn-dark m-2 shadow-lg" type="button" onClick={() => setShowFilter(!showFilter)}>Filter Competitions</button>
			</div>

			{/* Filter side panel */}
			<div class={"offcanvas offcanvas-start text-dark" + (showFilter ? " show" : "")} tabindex="-1" id="offcanvasFilter">
				<div class="offcanvas-header">
					<h5 class="offcanvas-title" id="offcanvasFilterTitle">Filter Competitions</h5>
					<button type="button" class="btn-close text-reset" onClick={() => setShowFilter(false)}></button>
				</div>
				<div class="offcanvas-body">
					
					{/* Competition Status */}
					<fieldset class="form-group mb-2">
						<legend>Competition Status</legend>
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableOngoing" checked={showOngoing} onChange={(e) => setShowOngoing(e.target.checked)}/>
							<label class="form-check-label" for="enableOngoing">Show ongoing competitions</label>
						</div>
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableCompleted" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)}/>
							<label class="form-check-label" for="enableCompleted">Show completed competitions</label>
						</div>
					</fieldset>

					{/* Competition Type */}
					<fieldset class="form-group mb-2">
						<legend>Competition Type</legend>
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableUser" checked={showUser} onChange={(e) => setShowUser(e.target.checked)}/>
							<label class="form-check-label" for="enableUser">Show user-made competitions</label>
						</div>
						<div class="form-check form-switch">
							<input class="form-check-input" type="checkbox" id="enableAutomated" checked={showAutomated} onChange={(e) => setShowAutomated(e.target.checked)}/>
							<label class="form-check-label" for="enableAutomated">Show automated competitions</label>
						</div>
					</fieldset>

				</div>
			</div>


		</div>
	);
}
