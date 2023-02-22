import React from 'react';
import Markdown from './Markdown';
import Timer from './Timer';

// Displays a card containing information about the competition
// The description is capped to a (non-responsive) height of 15 em and fades out as a simple way of hiding the rest without ellipses
// Automation, tags, and countdown are shown if they exist
export default function CompetitionCard({ comp }) {
	return (
		<div class="card border-info mb-3">
			{comp.automated && <div class="card-header">Automated</div>}
			<div class={`card-body ${comp.startTime && 'pb-1'}`}>
				<h4 class="card-title">{comp.name}</h4>
				{comp.tags.length !== 0 && (
					<h6 class="card-subtitle mb-2 text-muted">
						Tags: {comp.tags.map(tag => ( tag &&
							<a class="btn btn-sm btn-outline-light me-1" href={`/tag?id=${tag.id}`}>{tag.name}</a>
						))}
					</h6>
				)}
				{/* https://stackoverflow.com/questions/15597167/css3-opacity-gradient */}
				<div class="overflow-hidden" style={{maxHeight: "15em", WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), 85%, rgba(0,0,0,0)'}}>
					<Markdown contents={comp.description}/>
				</div>
				<a href={`/competition?id=${comp.id}`} class="card-link">Read more</a>
			</div>
			{(comp.startTime) && (
				<div class="card-footer">
					<Timer comp={comp}/>
				</div>
			)}
		</div>
	)
}