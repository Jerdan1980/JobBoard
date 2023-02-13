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
		fetch(`/api/tags`)
			.then(response => response.json())
			.then(data => setNumTags(data.length));
		
		fetch(`/api/competitions`)
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
		
		fetch(`/api/industries/count`)
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
		<div>
			<h1>Hello, world!</h1>
			<p>Welcome to your new single-page application, built with:</p>
			<ul>
				<li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
				<li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
				<li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
			</ul>
			<p>To help you get started, we have also set up:</p>
			<ul>
				<li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
				<li><strong>Development server integration</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
				<li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
			</ul>
			<p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>
		
			<h2>Stats:</h2>
			<div class="row text-center">
				<div class="col">{numTags} Tags</div>
				<div class="col">{totalComps} Competitions</div>
				<div class="col">{totalJobs} Jobs</div>
				<div class="col">{industryCounts.length} Industries</div>
			</div>

			<br/>
			<h3>Competition status:</h3>
			{/* Need to make text responsive somehow (if the width is too small omit text) */}
			<div className="progress" style={{ height: "2em" }}>
				<div className="progress-bar text-dark" role="progress-bar" style={{width: `${startingComps / totalComps * 100}%`}}>{startingComps} Starting</div>
				<div className="progress-bar bg-warning text-dark" role="progress-bar" style={{width: `${ongoingComps / totalComps * 100}%`}}>{ongoingComps} Ongoing</div>
				<div className="progress-bar bg-success text-dark" role="progress-bar" style={{width: `${completedComps / totalComps * 100}%`}}>{completedComps} Completed</div>
				{/*<div class="">{totalComps - (startingComps + ongoingComps + completedComps)} N/A</div>*/}
			</div>

			<br/>
			<h3>Top 5 Industries:</h3>
			{industryCounts.slice(1, 6).map(industry => (
				<Progress className="mb-2" fraction={industry.count / totalJobs} name={industry.name}/>
			))}

		</div>
	);
}

function Progress({ fraction, name, className }) {
	return (
		<div class={className}>
			<span class="position-absolute inline-block start-50 translate-middle-x">{name}: {fraction * 100}%</span>
			<div class="progress" style={{ height: "2em" }}>
				<div class="progress-bar bg-info" role="progress-bar" style={{width: `${fraction * 100}%`}}></div>
			</div>
		</div>
	)
}
