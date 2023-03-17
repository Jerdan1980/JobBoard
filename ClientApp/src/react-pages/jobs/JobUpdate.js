import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import { useSelect } from '../../components/CustomHooks';
import { IntInputFG, MultiSelectFG, SelectFG, TextAreaFG, TextInputFG, TimeFG } from '../../components/FormGroups';
import Countdown from 'react-countdown';


export default function JobUpdate() {
	// Grabs id and type from the url (technically the queryString)
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');

	// Job information
	const [name, setName] = useState();
	const [contents, setContents] = useState();
	const [jobType, setJobType] = useState();
	const [publicationDate, setPublicationDate] = useState();
	const [expirationDate, setExpirationDate] = useState();
	const [salary, setSalary] = useState();
	const [locations, setLocations] = useState();
	const [industry, setIndustry] = useState();
	const [experience, setExperience] = useState();
	const [company, setCompany] = useState();
	const [fromApi, setFromApi] = useState(false);
	const [selectedTags, setSelectedTags] = useState([]);

	// Various dropdown options
	const [industries, setIndustries, isIndustriesLoading, setIsIndustriesLoading] = useSelect('/api/industries', "id", "name");
	const [tags, setTags, isTagsLoading, setIsTagsLoading] = useSelect('/api/tags', 'id', 'name');

	// For deleting
	const [oldName, setOldName] = useState('');
	const [deleteString, setDeleteString] = useState('');

	// Loads the job information on page load
	useEffect(() => {
		fetch(`/api/jobs/${id}`)
			.then(response => {
				if (!response.ok) {
					alert(response.statusText);
					window.location.href = `/jobs`;
					return;
				}
				return response.json();
			})
			.then(data => {
				setName(data.name);
				setContents(data.contents);
				setJobType(data.type);
				setPublicationDate(data.date);
				setExpirationDate(data.expirationDate);
				setSalary(data.salary);
				setLocations(data.locations);
				var ind = { value: data.industry.id, label: data.industry.name };
				setIndustry(ind);
				setExperience(data.experience);
				setCompany(data.company);
				setFromApi(data.fromApi);
				if (data.tags.length > 0) {
					setSelectedTags(data.tags.map(tag => ({ value: tag.id, label: tag.name })))
				}
				setOldName(data.name);
			});
	}, [id]);

	const submit = (event) => {
		let body = {
			'id': id,
			'name': name,
			'contents': contents,
			'type': jobType,
			'date': publicationDate,
			'expirationDate': expirationDate,
			'salary': salary,
			'locations': locations,
			'industryId': industry.value,
			'experience': experience,
			'company': company,
			'fromApi': fromApi,
			'tagIds': selectedTags.map(tag => tag.value),
		};

		console.log(body);

		fetch(`/api/jobs`, {
			method: 'put',
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

	const remove = (event) => {
		if (oldName === deleteString)
			fetch(`/api/jobs/${id}`, { method: 'delete' })
					.then(response => {
						if (response.ok) {
							window.location.href = "/jobs";
							alert("Delete successful!");
							return;
						}
						alert(response.statusText);
					})
	}

	const timerRenderer = ({ total, days, formatted, completed, props }) => {
		if (completed)
			return <div>Already Expired!</div>
		return <div>Expires in: {formatted.days}:{formatted.hours}:{formatted.minutes}:{formatted.seconds}</div>
	}

	return (
		<>
			<h1>Update Job</h1>

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

					{/* Delete Section */}
					<div class="mb-2">
						<h2 class="text-danger">DELETE JOB</h2>
						<div class="form-group mb-2">
						<label class="form-label"><em><strong>Warning:</strong> This action is irreversible!</em></label>
							<input type="text" class={"form-control " + ((deleteString === oldName) ? "is-valid" : "is-invalid")} id="compDelete" value={deleteString} onChange={(e) => setDeleteString(e.target.value)}></input>
							<div class="invalid-feedback">Type `<span class="text-primary">{oldName}</span>` to delete this Contest.</div>
						</div>
						<button class={"btn btn-danger " + ((deleteString === oldName) ? "" : "disabled")} onClick={remove}>Delete</button>
					</div>
				</div>

				{/* Right Column */}
				<div class="col">
					<h2>Job Card:</h2>
					<div class="card mb-3 border-primary">
						{fromApi &&	(
							<div class="card-header">Automated</div>
						)}
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