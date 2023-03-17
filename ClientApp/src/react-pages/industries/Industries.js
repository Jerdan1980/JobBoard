import React, { useState } from 'react';
import { useApi } from '../../components/CustomHooks';

export default function Industries() {
	// List of industries
	const [industries, setIndustries] = useApi('api/industries/min');

	// Filter settings
	const [showEmpty, setShowEmpty] = useState(false);

	return (
		<>
			<div className="row">
				<div className="col">
					<h1>Industries</h1>
				</div>
				{/* Not going to create extra industries */}
			</div>

			{/* css-grid responsive array of tags */}
			{/* Has 1 column on small screens, 2 on phones and stuff, 3 on larger screens, and 4 on higher resolution screens */}
			<div className="grid">
				{industries.filter(industry => !(!showEmpty && (industry.count === 0))).map(industry => (
					<div className="g-col-12 g-col-sm-6 g-col-lg-4 g-col-xxl-3" key={industry.name}>
						<IndustryCard industry={industry}/>
					</div>
				))}
			</div>

			{/* Toggles empty filter */}
			<div className="sticky-bottom d-flex justify-content-end">
				<button class="btn btn-info m-2 shadow-lg" type="button" onClick={() => setShowEmpty(!showEmpty)}>
					{showEmpty ? "Hide empty industry" : "Show empty industry"}
				</button>
			</div>

		</>
	)
}

// The Industry equivalent of the CompetitionCard file
// Only used here so I didn't make it its own file
function IndustryCard({ industry }) {
	return (
		<div className="card mb-3">
			<div className="card-body">
				<h4 class="card-title">{industry.name}</h4>
				<h6 class="card-subtitle mb-2 text-muted"># of careers: {industry.count}</h6>
				<a href={`/jobs?industry=${industry.id}`} class="card-link">Explore industry</a>
			</div>
		</div>
	)
}
