import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import { useSelect } from '../../components/CustomHooks';
import { CreateableMultiSelectFG, TextAreaFG, TextInputFG, TimeFG } from '../../components/FormGroups';


export default function CompetitionUpdate() {
	// Grabs id and type from the url (technically the queryString)
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');
	
	// Competition information
	const [ name, setName ] = useState();
	const [ description, setDescription] = useState();
	const [ startTime, setStartTime ] = useState();
	const [ endTime, setEndTime ] = useState();
	const [ automated, setAutomated ] = useState();

	// Handles tags, loading in new tags, and keeping track of what tags were selected
	const [tags, setTags, isLoading, setIsLoading] = useSelect('/api/tags', "id", "name");
	const [selectedTags, setSelectedTags] = useState([]);

	// Used for deleting the competition
	const [ oldName, setOldName ] = useState('');
	const [ deleteString, setDeleteString ] = useState('');

	// Loads both the tags and competition on page load
	// Requires id as a dependency despite it being const...
	useEffect(() => {
		// GETs the competition
		fetch(`/api/competitions/${id}`)
			.then(response => {
				if (!response.ok) {
					alert(response.statusText);
					window.location.href = `/competition?id=${id}`;
					return;
				}
				return response.json();
			})
			.then(data => {
				setName(data.name);
				setDescription(data.description);
				setStartTime(data.startTime);
				setEndTime(data.endTime);
				setAutomated(data.automated);
				if (data.tags.length > 0) {
					setSelectedTags(data.tags.map(tag => ({value: tag.id, label: tag.name})));
				}
				setOldName(data.name);
			});
	}, [id]);

	// Handles creation of a new tag
	// POSTS a new tag and then loads the tags back in
	const handleCreate = (inputValue) =>
	{
		setIsLoading(true);
		fetch('/api/tags', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: inputValue })
		})
			.then(async (response) => {
				if (response.ok) {
					let response = await fetch('/api/tags')
					if (!response.ok) {
						alert(response.statusText);
						return;
					}

					let data = await response.json();
					setTags(data.map(tag => ({value: tag.id, label: tag.name})));
				}
				setIsLoading(false);
			})
	}

	// POSTS the competition
	const submit = (event) => {
		let body = {
			'id': id,
			'name': name,
			'description': description,
			'tagIds': selectedTags.map(tag => tag.value),
			'automated': automated
		};

		if (startTime)
			body.startTime = startTime;
		
		if (endTime)
			body.endTime = endTime

		fetch(`/api/competitions`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				//'Authorization': something something Identity
			},
			body: JSON.stringify(body)
		})
			.then(response => {
				if (!response.ok) {
					alert(response.statusText);
					return;
				}
				window.location.href = `/competition?id=${id}`;
			})
	}

	// DELETEs the competition
	const remove = (event) => {
		if (oldName === deleteString)
			fetch(`/api/competitions/${id}`, { method: 'delete' })
				.then(response => {
					if (response.ok) {
						window.location.href = "/competitions";
						alert("Delete successful!");
						return;
					}
					alert(response.statusText);
				})
	}

	return (
		<>
			<h1>Update Competition</h1>

			<div class="row">
				{/* Left Column */}
				<div class="col">
					<h2>Form:</h2>
					<form>
						{/* Name */}
						<TextInputFG label="Competition Name" value={name} onChange={setName} isRequired={true} />

						{/* Description */}
						<TextAreaFG label="Competition Description" value={description} onChange={setDescription} />

						{/* Start Time */}
						<TimeFG label="Competition Start Time (in UTC)" value={startTime} onChange={setStartTime} />

						{/* End Time */}
						<TimeFG label="Competition End Time (in UTC)" value={endTime} onChange={setEndTime} />

						{/* Tags section */}
						<CreateableMultiSelectFG
							label="Competition Tags" 
							isLoading={isLoading} 
							options={tags}
							value={selectedTags}
							onChange={setSelectedTags}
							onCreate={handleCreate}
						/>

						{/* Submit button */}
						<btn type="submit" onClick={submit} class={"btn btn-primary mb-2 " + (name ? "" : "disabled")}>Submit</btn>
					</form>

					{/* Delete Section */}
					<div class="mb-2">
						<h2 class="text-danger">DELETE COMPETITION</h2>
						<div class="form-group mb-2">
							<label class="form-label"><em><strong>Warning:</strong> This action is irreversible!</em></label>
							<input type="text" class={"form-control " + ((deleteString === oldName) ? "is-valid" : "is-invalid")} id="compDelete" value={deleteString} onChange={(e) => setDeleteString(e.target.value)}></input>
							<div class="invalid-feedback">Type `<span class="text-primary">{oldName}</span>` to delete this Contest.</div>
						</div>
						<button class={"btn btn-danger " + ((deleteString === oldName) ? "" : "disabled")} onClick={remove}>Delete</button>
					</div>

				</div>

				{/* Right column */}
				<div class="col">
					<h2>Display:</h2>
					<div class="p-3 border rounded-3">
						<h1>{name}</h1>

						{/* Tags */}
						{selectedTags.length !== 0 && (
							<div class="mb-1">
								Tags: {selectedTags.map(tag => (
									<button class="btn btn-sm btn-outline-light me-1">{tag.label}</button>
								))}
							</div>
						)}

						<Markdown contents={description}/>
					</div>
				</div>
			</div>

			
		</>
	)
}