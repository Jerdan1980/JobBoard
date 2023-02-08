import React, { useEffect, useState } from 'react';

export default function Jobs() {
	const [jobs, setJobs] = useState([]);
	const [index, setIndex] = useState(-1);

	useEffect(() => {
		fetch("https://www.themuse.com/api/public/jobs?page=1")
			.then(async (response) => {
				if (!response.ok) {
					alert("Response not ok!");
					window.location.href = "/";
					return;
				}

				let data = await response.json();

				setJobs(data.results);
			})
	}, []);

	// Filter settings
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

	return (
		<div>
			<h1>Job listing</h1>
			<h2>There are {jobs.length} jobs!</h2>

			<div class="row">
				{/* Left Column */}
				<div class="col-4">
					{jobs.map((job, i) => {
						return (
							<JobCard job={job} i={i} />
						)
					})}
				</div>
				{/* Right column */}
				<div class="col">
					{ (index != -1) && (
						<>
							<h2>{jobs[index].name}</h2>
							<h5 class="text-info">{jobs[index].company.name}</h5>
							<h5 class="text-muted">{jobs[index].locations[0].name}</h5>
							<div dangerouslySetInnerHTML={{ __html: jobs[index].contents }} />
						</>
					)}
				</div>
			</div>

			{/* Floating button to open the filter side panel */}
			<div class="sticky-bottom d-flex justify-content-end">
				<button class="btn btn-info m-2 shadow-lg" type="button" onClick={() => setShowFilter(!showFilter)}>Filter Competitions</button>
			</div>

			{/* Filter side panel */}
			<div class={"offcanvas offcanvas-start" + (showFilter ? " show" : "")} tabindex="-1" id="offcanvasFilter">
				<div class="offcanvas-header">
					<h5 class="offcanvas-title" id="offcanvasFilterTitle">Filter Competitions</h5>
					<button type="button" class="btn-close text-reset" onClick={() => setShowFilter(false)}></button>
				</div>
				<div class="offcanvas-body">

					{/* Competition Status */}
					<div class="form-group mb-2">
						<label for="exampleInputEmail1" class="form-label">Search</label>
						<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Search for a job"/>
					</div>

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
	)

	function JobCard({ job, i }) {
		return (
			<div class={"card mb-3 " + (i == index ? "border-light" : "border-primary")} >
				<div class="card-header"></div>
				<div class="card-body">
					<h5 class="card-title">{job.name}</h5>
					<h6 class="card-subtitle text-muted">
						{job.company.name} - {job.locations[0].name}
						<br/>
						Insert full/part time here
					</h6>
					<a onClick={() => setIndex(i)} class="stretched-link">Read More</a>
				</div>
			</div>
		)
	}
}

