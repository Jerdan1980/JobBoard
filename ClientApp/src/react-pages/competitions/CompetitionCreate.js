import React, { useEffect, useState } from 'react';
import Markdown from '../../components/Markdown';
import CreatableSelect from 'react-select/creatable';

export default function CompetitionCreate() {
	// Competition information
	const [ name, setName ] = useState();
	const [ description, setDescription] = useState();
	const [ startTime, setStartTime ] = useState();
	const [ endTime, setEndTime ] = useState();

	// Handles tags, loading in new tags, and keeping track of what tags were selected
	const [isLoading, setIsLoading] = useState(false);
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	// Loads tags on page load
	useEffect(() => {
		setIsLoading(true);
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
	}, []);

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

	useEffect(() => {
		console.log(startTime);
	}, [startTime]);

	// POSTS the competition
	const submit = (event) => {
		let body = {
			'id': 0,
			'name': name,
			'description': description,
			'tagIds': selectedTags.map(tag => tag.value)
		};

		if (startTime)
			body.startTime = startTime;
		
		if (endTime)
			body.endTime = endTime

		fetch('/api/competitions', {
			method: 'post',
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
				window.location.href = '/competitions';
			})
	}

	return (
		<div>
			<h1>Create Competition</h1>

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
								value={name} 
								onChange={(e) => setName(e.target.value)}  
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
							<input type="datetime-local" class="form-control" id="compStartTime" onChange={(e) => setStartTime(e.target.value)}></input>
						</div>

						{/* End Time */}
						<div class="form-group mb-2">
							<label for="compEndTime" class="form-label">Competition End Time (Local)</label>
							<input type="datetime-local" class="form-control" id="compEndTime" onChange={(e) => setEndTime(e.target.value)}></input>
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