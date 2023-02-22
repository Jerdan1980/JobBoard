import React, { useState, useEffect } from 'react';
import Markdown from '../../components/Markdown';
import authService from '../../components/api-authorization/AuthorizeService';

export default function Tags() {
	// List of tagss
	const [tags, setTags] = useState([]);

	// Stores login status
	const [loggedIn, setLoggedIn] = useState(false);

	// Filter settings
	const [showEmpty, setShowEmpty] = useState(false);

	// Grabs the list of tags and if a user is logged in
	useEffect(() => {
		fetch(`/api/tags`)
			.then(response => response.json())
			.then(data => setTags(data));
				
		(async function() {
			const token = await authService.getAccessToken()
			setLoggedIn(token != null);
		})();
	}, []);

	return (
		<div>
			<div class="row">
				<div class="col">
					<h1>Tags</h1>
				</div>
				<div class="col position-relative">
					<a class={"btn btn-primary position-absolute top-0 end-0" + (!loggedIn ? " disabled" : "")} href="/tags/create">Create</a>
				</div>
			</div>

			{/* css-grid responsive array of tags */}
			{/* Has 1 column on small screens, 2 on phones and stuff, 3 on larger screens, and 4 on higher resolution screens */}
			<div class="grid">
				{tags.filter(tag => !(!showEmpty && (tag.competitions.length === 0))).map(tag => (
					<div class="g-col-12 g-col-sm-6 g-col-lg-4 g-col-xxl-3">
						<TagCard tag={tag} loggedIn={loggedIn}/>
					</div>
				))}
			</div>

			{/* Toggles empty filter */}
			<div class="sticky-bottom d-flex justify-content-end">
				<button class="btn btn-info m-2 shadow-lg" type="button" onClick={() => setShowEmpty(!showEmpty)}>
					{showEmpty ? "Hide empty tags" : "Show empty tags"}
				</button>
			</div>

		</div>
	);
}

// The tag equivalent of the CompetitionCard file
// Only used here so I didn't make it its own file
function TagCard({ tag, loggedIn }) {
	return (
		<div class="card mb-3">
			<div class="card-body">
				<h4 class="card-title">{tag.name}</h4>
				<h6 class="card-subtitle mb-2 text-muted"># of comps: {tag.competitions.length}</h6>
				{tag.description &&
					<Markdown contents={tag.description} />
				}
				<a href={`/competitions?tag=${tag.id}`} class="card-link">Explore tag</a>
				{loggedIn && (
					<a href={`/tags/edit?id=${tag.id}`} class="card-link">Edit tag</a>
				)}
			</div>
		</div>
	)
}
