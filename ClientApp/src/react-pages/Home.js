import React, { useState, useEffect } from 'react';

export default function Home() {
	// Tags
	const [numTags, setNumTags] = useState(0);

	// Competitions
	const [totalComps, setTotalComps] = useState(0);
	const [startingComps, setStartingComps] = useState(0);
	const [completedComps, setCompletedComps] = useState(0);
	const [ongoingComps, setOngoingComps] = useState(0);

	// Jobs and Industries
	const [totalJobs, setTotalJobs] = useState(0);
	const [industryCounts, setIndustryCounts] = useState([]);

	// GETs the numbers and assigns it to the states
	useEffect(() => {
		fetch(`/api/tags/count`)
			.then(response => response.text())
			.then(data => setNumTags(parseInt(data)));
		
		fetch(`/api/competitions/status`)
			.then(response => response.json())
			.then(data => {
				setTotalComps(data.length);
				let starting = 0;
				let ongoing = 0;
				let completed = 0;

				// Sorts the function by starting, ongoing, ending, and unknown
				// Uses shortcircuting to ensure that completed gets counted before ongoing since both will be true
				data.forEach(comp => {
					const isStarting = comp.startTime ? Date.parse(comp.startTime) > Date.now() : false;
					const isCompleted = comp.endTime ? Date.parse(comp.endTime) < Date.now() : false;
					const isOngoing = comp.startTime ? Date.parse(comp.startTime) < Date.now() : false;

					if (isStarting) 
						return starting++;
					if (isCompleted)
						return completed++;
					if(isOngoing)
						return ongoing++;
				});

				setStartingComps(starting);
				setCompletedComps(completed);
				setOngoingComps(ongoing);
			});
		
		fetch(`/api/industries/min`)
			.then(response => response.json())
			.then(data => {
				setIndustryCounts(data);
				let totJobs = 0;

				data.forEach(industry => {
					totJobs += industry.count;
				});

				setTotalJobs(totJobs);
			})
	}, []);

	return (
		<>
			<h1>Careers N Competitions</h1>
			<p>
				Welcome to CNC! 
				Our goal is to help you jumpstart your career in an industry of interest. 
				Competitions are a good way of showing your interest <em>and</em> proving your skill.
			</p>
			<p>To help you get started, here are some quick links:</p>
			<ul>
				<li key="jobs">Looking for jobs? Here are our <a href="/jobs">careers</a></li>
				<li key="comp">Want to get involved? Here are our <a href="/competitions">competitions</a></li>
				<li key="tags">Have an interest in mind? Here are our <a href="/tags">tags</a></li>
			</ul>
			<p>Contact us for more information!</p>
		
			<h2>Website Stats:</h2>
			<div className="row text-center">
				<a class="col" href="/tags">{numTags} Tags</a>
				<a class="col" href="/competitions">{totalComps} Competitions</a>
				<a class="col" href="/jobs">{totalJobs} Jobs</a>
				<a class="col" href="/industries">{industryCounts.length} Industries</a>
			</div>

			<br/>
			<h3>Competition status:</h3>
			{/* Need to make text responsive somehow (if the width is too small omit text) */}
			<div className="progress" style={{ height: "2em" }}>
				<div className="progress-bar text-dark" style={{width: `${startingComps / totalComps * 100}%`}}>{startingComps} Starting</div>
				<div className="progress-bar bg-warning text-dark" style={{width: `${ongoingComps / totalComps * 100}%`}}>{ongoingComps} Ongoing</div>
				<div className="progress-bar bg-success text-dark" style={{width: `${completedComps / totalComps * 100}%`}}>{completedComps} Completed</div>
			</div>
			<p><small>Last updated: {Date()}</small></p>

			<br/>
			<h3>Top 5 Industries:</h3>
			{industryCounts.slice(0, 5).map(industry => (
				<Progress className="mb-2" fraction={industry.count / totalJobs} name={industry.name} key={industry.name}/>
			))}

		</>
	);
}

function Progress({ fraction, name, className }) {
	return (
		<div className={className}>
			<span className="position-absolute inline-block start-50 translate-middle-x">{name}: {(fraction * 100).toFixed(2)}%</span>
			<div className="progress" style={{ height: "2em" }}>
				<div className="progress-bar bg-info" style={{width: `${fraction * 100}%`}}></div>
			</div>
		</div>
	)
}
