import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi, useLoginStatus, useQueryParams, useSelect } from '../../components/CustomHooks';
import { MultiSelectFG, TextInputFG, SwitchFG } from '../../components/FormGroups';
import Countdown from 'react-countdown';
import Markdown from '../../components/Markdown';

export default function Jobs() {
	// Query params that carry from other pages
	//https://medium.com/raml-api/arrays-in-query-params-33189628fa68
	//https://developer.mozilla.org/en-US/docs/web/api/urlsearchparams
	const queryParams = new URLSearchParams(useLocation().search);
	const industryIdParam = queryParams.getAll('industry').map(str => Number.parseInt(str));

	// stores login status
	const loggedIn = useLoginStatus();

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
	const [showOngoing, setShowOngoing] = useState(true);
	const [showExpired, setShowExpired] = useState(false);

	function filter(job) {
		const isExpired = Date.parse(job.expirationDate) < Date.now();
		const isOngoing = Date.parse(job.expirationDate) > Date.now();
		if ((!showExpired && isExpired) || (!showOngoing && isOngoing))
			return false;

		const hasIndustry = selectedIndustries.length == 0 || selectedIndustries.map(industry => industry.value).includes(job.industryId);
		if (!hasIndustry)
			return false;
		
		const inQuery = job.name.toLowerCase().includes(query.toLowerCase()) || job.contents.toLowerCase().includes(query.toLowerCase());
		return inQuery;
	}

	return (
		<div class="">
			<h1>Job listing</h1>
			<div class="row">
				<div class="col">
					<h2>There are {jobs.filter(job => filter(job)).length} Jobs that match your settings!</h2>
				</div>
				<div class="col position-relative">
					<a class={"btn btn-primary position-absolute top-0 end-0" + (!loggedIn ? " disabled" : "")} href="/jobs/create">Create</a>
				</div>
			</div>

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
							<h4>
								<span class="text-info">{job.company}</span> - {job.locations}
							</h4>
							<Markdown contents={job.contents} />
							<div className="row gx-0 mx-0">
								<div className='col px-3'>
									<button type="button" class="btn btn-info w-100">Apply</button>
								</div>
								<div className='col px-3'>
									<a class="btn btn-primary w-100" href={`/jobs/edit?id=${job.id}`}>Edit</a>
								</div>
							</div>
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
					{/* Number after filtering */}
					<p>{jobs.filter(job => filter(job)).length} Jobs that match your settings!</p>

					{/* Text Search Bar */}
					<TextInputFG label="Search" value={query} onChange={setQuery} placeholder="Search for a job." />

					{/* Industries section */}
					<MultiSelectFG 
						label="Industries (OR)" 
						isLoading={isIndustriesLoading} 
						options={industries} 
						value={selectedIndustries} 
						onChange={setSelectedIndustries} 
					/>

					{/* Job Status */}
					<fieldset class="form-group mb-2">
						<legend>Job Status</legend>
						<SwitchFG label="Show ongoing jobs" checked={showOngoing} onChange={setShowOngoing} />
						<SwitchFG label="Show expired jobs" checked={showExpired} onChange={setShowExpired} />
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

		const timerRenderer = ({ total, days, formatted, completed, props }) => {
			if (completed)
				return <div>Already Expired!</div>
			return <div>Expires in: {formatted.days}:{formatted.hours}:{formatted.minutes}:{formatted.seconds}</div>
		}

		return (
			<div class={"card mb-3 " + (job.id === id ? "border-light" : "border-primary")} >
				{job.fromApi &&	(
					<div class="card-header">Automated</div>
				)}
				<div class="card-body">
					<h5 class="card-title">{job.name}</h5>
					<h6 class="card-subtitle text-muted">
						{job.company} - {job.locations}
						<br/>
						<Countdown date={job.expirationDate} renderer={timerRenderer} />
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