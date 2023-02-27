import React from 'react';

export default function AwardListItem({ award, linked }) {
	const contents = (
		<>
			<div class="d-flex w-100 justify-content-between">
				<h5 class="mb-1">{award.competitionName}</h5>
				<small class="text-muted">{(new Date(award.competitionEndTime)).toString()}</small>
			</div>
			<p class="mb-0">Award: {award.rank}</p>
			<small class="text-muted">{award.userName}</small>
		</>
	)

	if (linked)
		return (
			<a href={`/competition?id=${award.competitionId}`} class="list-group-item list-group-item-action flex-column align-items-start">
				{contents}
			</a>
		);
	else
		return (
			<span class="list-group-item list-group-item-action flex-column align-items-start">
				{contents}
			</span>
		)
}