import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';

export default function Jobs() {
	// Query params that carry from other pages
	const queryParams = new URLSearchParams(useLocation().search);
	const industryIdParam = queryParams.get('industry');

	// Jobs and selected jobs (id, job)
	const [jobs, setJobs] = useState([]);
	const [id, setId] = useState(-1);
	const [job, setJob] = useState(null);

	// Industries and selected Industries
	const [isIndustriesLoading, setIsIndustriesLoading] = useState(false);
	const [industries, setIndustries] = useState([]);
	const [selectedIndustries, setSelectedIndustries] = useState([]);

	// Loads jobs on page load
	useEffect(() => {
		fetch("/api/jobs")
			.then(async (response) => {
				if (!response.ok) {
					alert("Response not ok!");
					window.location.href = "/";
					return;
				}

				let data = await response.json();
				
				setJobs(data);
			})
	}, []);

	// Loads industries on page load
	useEffect(() => {
		setIsIndustriesLoading(true);
		fetch('/api/industries/min')
			.then(response => {
				if (!response.ok)
				{
					alert(response.statusText);
					return;
				}
				return response.json();
			})
			.then(data => {
				setIndustries(data.map(industry => ({value: industry.id, label: `${industry.name} (${industry.count})` })));
				setIsIndustriesLoading(false);
			})
	}, []);

	// When setIndustries is done, load in query param
	useEffect(() => {
		// return if that queryparam doesnt exist
		if (!industryIdParam || industries.length == 0)
			return;
		
		// filter by said queryparam
		let industry = industries.find(i => i.value == industryIdParam);
		setSelectedIndustries([industry]);
	}, [industries]);

	// Filter settings
	const [showFilter, setShowFilter] = useState(false);
	const [showOngoing, setShowOngoing] = useState(true);
	const [showCompleted, setShowCompleted] = useState(true);
	const [showUser, setShowUser] = useState(true);
	const [showAutomated, setShowAutomated] = useState(true);
	const [query, setQuery] = useState("");

	function filter(job) {
		const hasIndustry = selectedIndustries.length == 0 || selectedIndustries.map(industry => industry.value).includes(job.industryId);
		if (!hasIndustry)
			return false;
		
		const inQuery = job.name.toLowerCase().includes(query.toLowerCase()) || job.contents.toLowerCase().includes(query.toLowerCase());
		return inQuery;
	}

	return (
		<div class="">
			<h1>Job listing</h1>
			<h2>There are {jobs.filter(job => filter(job)).length} jobs!</h2>

			<div class="hstack gap-3">
				{/* Left Column */}
				<div class="col-4">
					{jobs.filter((job) => filter(job)).map((job) => {
						return (
							<JobCard job={job} />
						)
					})}
					{/* Floating button to open the filter side panel */}
					<div class="sticky-bottom d-flex justify-content-end">
						<button class="btn btn-info m-2 shadow-lg" type="button" onClick={() => setShowFilter(!showFilter)}>Filter Jobs</button>
					</div>
				</div>
				<div class="vr"></div>
				{/* Right column */}
				<div class="col vh-100 overflow-auto sticky-top sticky-bottom" >
					{ (job !== null) && (
						<>
							<AlwaysScrollToTop />
							<br/>
							<br/>
							<h2>{job.name}</h2>
							<h5 class="text-info">{job.company.name}</h5>
							<h5 class="text-muted">{job.locations[0].name}</h5>
							<div dangerouslySetInnerHTML={{ __html: job.contents }}/>
							<br/>
							<br/>
						</>
					)}
				</div>
			</div>

			{/* Filter side panel */}
			<div class={"offcanvas offcanvas-end" + (showFilter ? " show" : "")} tabindex="-1" id="offcanvasFilter">
				<div class="offcanvas-header">
					<h5 class="offcanvas-title" id="offcanvasFilterTitle">Filter Competitions</h5>
					<button type="button" class="btn-close text-reset" onClick={() => setShowFilter(false)}></button>
				</div>
				<div class="offcanvas-body">

					{/* Text Search Bar */}
					<div class="form-group mb-2">
						<label htmlFor="searchQuery" class="form-label">Search</label>
						<input type="text" class="form-control" id="searchQuery" placeholder="Search for a job" value={query} onChange={(event) => setQuery(event.target.value)}/>
					</div>

					{/* Industries section */}
					<div class="form-group mb-2">
						<label for="industries" class="form-label">Industries (OR)</label>
						<Select
							isClearable
							isMulti
							isDisabled={isIndustriesLoading}
							isLoading={isIndustriesLoading}
							onChange={(newValue) => setSelectedIndustries(newValue)}
							options={industries}
							value={selectedIndustries}
						/>
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

	function JobCard({ job }) {
		function changeSelected()
		{
			setJob(job);
			setId(job.id);
		}

		return (
			<div class={"card mb-3 " + (job.id === id ? "border-light" : "border-primary")} >
				{job.fromApi &&	(
					<div class="card-header">Automated</div>
				)}
				<div class="card-body">
					<h5 class="card-title">{job.name}</h5>
					<h6 class="card-subtitle text-muted">
						{job.company.name} - {job.locations[0].name}
						<br/>
						Insert full/part time here
					</h6>
					<a onClick={changeSelected} class="stretched-link">Read More</a>
				</div>
			</div>
		)
	}
}

//https://stackoverflow.com/questions/45719909/scroll-to-bottom-of-an-overflowing-div-in-react
const AlwaysScrollToTop = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth' }));
	return <div ref={elementRef}/>;
}