import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import CreatableSelect from 'react-select/creatable';

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
	const [isLoading, setIsLoading] = useState(false);
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	// Used for deleting the competition
	const [ oldName, setOldName ] = useState('');
	const [ deleteString, setDeleteString ] = useState('');

	// Loads both the tags and competition on page load
	// Requires id as a dependency despite it being const...
	useEffect(() => {
		// GETs the Tags
		setIsLoading(true);
		fetch('/api/tags')
			.then(response => {
				if (!response.ok)
				{
					alert(response.statusText);
					window.location.href = `/competition?id=${id}`;
					return;
				}
				return response.json();
			})
				.then(data => {
					//console.log(data);
					//console.log(data.map(tag => ({value: tag.id, label: tag.name})));
					setTags(data.map(tag => ({value: tag.id, label: tag.name})));
					setIsLoading(false);
				})
		
		// GETs the competition
		fetch(`/api/competitions/${id}`)
			.then(response => {
				if (!response.ok)
				{
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
				if (data.tags.length > 0)
				{
					console.log("original", data.tags);
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
			.then(response => {
				if (response.ok) {
					fetch('/api/tags')
						.then(response => {
							if (!response.ok)
							{
								alert(response.statusText);
								return;
							}
							return response.json();
						})
						.then(data => {
							//console.log(data);
							//console.log(data.map(tag => ({value: tag.id, label: tag.name})));
							setTags(data.map(tag => ({value: tag.id, label: tag.name})));
							setIsLoading(false);
						})
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
		<div>
			<h1>Update Competition</h1>

			<div class="row">
				{/* Left Column */}
				<div class="col">
					<h2>Form:</h2>
					<form>

						{/* Name */}
						<div class="form-group mb-2">
							<label for="compName" class="form-label">Competition Name</label>
							<input 
								type="text" 
								class={"form-control " + (name ? "" : "is-invalid")} 
								id="compName" 
								value={name} onChange={(e) => setName(e.target.value)} 
								placeholder="Enter name here."
							/>
							<div class="invalid-feedback">Name is required!</div>
						</div>

						{/* Description */}
						<div class="form-group mb-2">
							<label for="compDescription" class="form-label">Competition Description</label>
							<textarea 
								class="form-control" 
								rows="10" cols="80" 
								id="compDescription" 
								value={description} 
								onChange={(e) => setDescription(e.target.value)} 
								placeholder="Enter your description here. This uses markdown!"
							/>
						</div>

						{/* Start Time */}
						<div class="form-group mb-2">
							<label for="compStartTime" class="form-label">Competition Start Time (Local)</label>
							<input type="datetime-local" class="form-control" id="compStartTime" value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
						</div>

						{/* End Time */}
						<div class="form-group mb-2">
							<label for="compEndTime" class="form-label">Competition End Time (Local)</label>
							<input type="datetime-local" class="form-control" id="compEndTime" value={endTime} onChange={(e) => setEndTime(e.target.value)}></input>
						</div>

						{/* Tags section */}
						<div class="form-group mb-2">
							<label for="tags" class="form-label">Competition Tags</label>
							<CreatableSelect
								isClearable
								isMulti
								isDisabled={isLoading}
								isLoading={isLoading}
								onChange={(newValue) => setSelectedTags(newValue)}
								onCreateOption={handleCreate}
								options={tags}
								value={selectedTags}
								classNames={{
									control: (state) => 'bg-transparent form-control',
									menu: (state) => 'bg-transparent',
									option: (state) => state.isFocused ? 'text-light bg-primary' : 'text-dark bg-secondary',
									multiValue: (state) => 'bg-transparent border border-light',
									multiValueLabel: (state) => 'text-light',
									placeholder: (state) => 'text-light'
								}}
							/>
						</div>

						{/* Submit button */}
						<btn type="submit" onClick={submit} class={"btn btn-primary mb-2 " + (name ? "" : "disabled")}>Submit</btn>
					
					</form>

					{/* Delete Section */}
					<div class="alert alert-danger mb-2">
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
					<div class="p-2 border">
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

			
		</div>
	)
}