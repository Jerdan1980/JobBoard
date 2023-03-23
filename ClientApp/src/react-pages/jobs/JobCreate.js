import React, { useState } from 'react';
import Countdown from 'react-countdown';
import { useLocation } from 'react-router-dom';
import { useSelect } from '../../components/CustomHooks';
import { IntInputFG, MultiSelectFG, SelectFG, TextAreaFG, TextInputFG, TimeFG } from '../../components/FormGroups';
import Markdown from '../../components/Markdown';


export default function JobCreate() {
	// Grabs id and type from the url (technically the queryString)
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');

	// Job information
	const [name, setName] = useState();
	const [contents, setContents] = useState();
	const [jobType, setJobType] = useState();
	//const [publicationDate, setPublicationDate] = useState();
	const [expirationDate, setExpirationDate] = useState();
	const [salary, setSalary] = useState();
	const [locations, setLocations] = useState();
	const [industry, setIndustry] = useState();
	const [experience, setExperience] = useState();
	const [company, setCompany] = useState();
	//const [fromApi, setFromApi] = useState(false);
	const [applicationLink, setApplicationLink] = useState();
	const [selectedTags, setSelectedTags] = useState([]);

	// Various dropdown options
	const [industries, setIndustries, isIndustriesLoading, setIsIndustriesLoading] = useSelect('/api/industries', "id", "name");
	const [tags, setTags, isTagsLoading, setIsTagsLoading] = useSelect('/api/tags', 'id', 'name');

	const submit = (event) => {
		let body = {
			'id': id,
			'name': name,
			'contents': contents,
			'type': jobType,
			'date': new Date(),
			'expirationDate': expirationDate,
			'salary': salary,
			'locations': locations,
			'industryId': industry.value,
			'experience': experience,
			'company': company,
			'fromApi': true,
			'applicationLink': applicationLink,
			'tagIds': selectedTags.map(tag => tag.value),
		};

		fetch(`/api/jobs`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		})
			.then(response => {
				if (!response.ok) {
					alert (response.statusText);
					return;
				}
				window.location.href = "/jobs";
			});
	}

	const timerRenderer = ({ total, days, formatted, completed, props }) => {
		if (completed)
			return <div>Already Expired!</div>
		return <div>Expires in: {formatted.days}:{formatted.hours}:{formatted.minutes}:{formatted.seconds}</div>
	}

	return (
		<>
			<h1>Create Job</h1>

			<div class="row">
				{/* Left Column */}
				<div class="col">
					<h2>Form:</h2>
					<form>
						{/* Name */}
						<TextInputFG label="Job Name" value={name} onChange={setName} isRequired={true} />

						{/* Description */}
						<TextAreaFG label="Job Description" value={contents} onChange={setContents} />

						{/* Job Type */}
						<TextInputFG label="Job Type" value={jobType} onChnage={setJobType} />

						{/* Expiration Date */}
						<TimeFG label="Expiration Date (in UTC)" value={expirationDate} onChange={setExpirationDate} />

						{/* Salary */}
						<IntInputFG label="Salary" value={salary} onChange={setSalary} />

						{/* Locations */}
						<TextInputFG label="Locations" value={locations} onChange={setLocations} />

						{/* Industry */}
						<SelectFG 
							label="Industry"
							isLoading={isIndustriesLoading}
							options={industries}
							value={industry}
							onChange={setIndustry}
						/>

						{/* Experience */}
						<TextInputFG label="Job Experience Level" value={experience} onChange={setExperience} />

						{/* Company */}
						<TextInputFG label="Company" value={company} onChange={setCompany} />

						{/* Application Link */}
						<TextInputFG label="Application Link" value={applicationLink} onChange={setApplicationLink} />

						{/* Tags */}
						<MultiSelectFG
							label="Job Tags"
							isLoading={isTagsLoading}
							options={tags}
							value={selectedTags}
							onChange={setSelectedTags}
						/>

						{/* Submit button */}
						<btn type="submit" onClick={submit} class={"btn btn-primary mb-2 " + (name ? "" : "disabled")}>Submit</btn>
					</form>
				</div>

				{/* Right Column */}
				<div class="col">
					<h2>Job Card:</h2>
					<div class="card mb-3 border-primary">
						<div class="card-body">
							<h5 class="card-title">{name}</h5>
							<h6 class="card-subtitle text-muted">
								{company} - {locations}
								<br/>
								<Countdown date={expirationDate} renderer={timerRenderer} />
							</h6>
							<a class="stretched-link">Read More</a>
						</div>
					</div>

					<h2 class="mt-3">Job Description:</h2>
					<div class="p-3 border rounded-3">
						<h2>{name}</h2>
						<h4>
							<span class="text-info">{company}</span> - {locations}
						</h4>
						<Markdown contents={contents} />
						<div className="row gx-0 mx-0">
								<div className='col px-3'>
									<button type="button" class="btn btn-info w-100 disabled">Apply</button>
								</div>
								<div className='col px-3'>
									<a class="btn btn-primary w-100 disabled">Edit</a>
								</div>
							</div>
					</div>
				</div>
			</div>

		</>
	)
}