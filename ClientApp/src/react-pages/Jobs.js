import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { useApi, useQueryParams, useSelect } from '../components/CustomHooks';

export default function Jobs() {
	// Query params that carry from other pages
	//https://medium.com/raml-api/arrays-in-query-params-33189628fa68
	//https://developer.mozilla.org/en-US/docs/web/api/urlsearchparams
	const queryParams = new URLSearchParams(useLocation().search);
	const industryIdParam = queryParams.getAll('industry').map(str => Number.parseInt(str));

	// Jobs and selected jobs (id, job)
	const [jobs, setJobs] = useApi('/api/jobs');
	const [id, setId] = useState(-1);
	const [job, setJob] = useState(null);

	// Industries and selected Industries
	const [industries, setIndustries, isIndustriesLoading, setIsIndustriesLoading] = useSelect('/api/industries/min', "id", (industry) => `${industry.name} (${industry.count})`);
	const [selectedIndustries, setSelectedIndustries] = useQueryParams(industryIdParam, industries);

	// Filter settings
	const [showFilter, setShowFilter] = useState(false);
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
			<h2>There are {jobs.filter(job => filter(job)).length} Jobs that match your settings!</h2>

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

					<p>{jobs.filter(job => filter(job)).length} Jobs that match your settings!</p>

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

// Scrolls the job description to the top hwenever you click on a job card and load a new job
//https://stackoverflow.com/questions/45719909/scroll-to-bottom-of-an-overflowing-div-in-react
const AlwaysScrollToTop = () => {
	const elementRef = useRef();
	useEffect(() => elementRef.current.scrollIntoView({ behavior: 'smooth' }));
	return <div ref={elementRef}/>;
}