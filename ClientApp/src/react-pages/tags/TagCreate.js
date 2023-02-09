import React, { useEffect, useState } from 'react';
import Markdown from '../../components/Markdown';

export default function TagCreate() {
	//Tag information
	const [ name, setName ] = useState();
	const [ description, setDescription] = useState();

	// POSTs the tag
	const submit = (event) => {
		let body = {
			'id': 0,
			'name': name,
			'description': description,
		};

		fetch('/api/tags', {
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
				window.location.href = '/tags';
			})
	}

	return (
		<div>
			<h1>Create Tag</h1>

			<div class="row">
				{/* Left Column */}
				<div class="col">
					<h2>Form:</h2>
					<form>

						{/* Name */}
						<div class="form-group mb-2">
							<label for="tagName" class="form-label">Tag Name</label>
							<input 
								type="text" 
								class={"form-control " + (name ? "" : "is-invalid")} 
								id="tagName" 
								value={name} 
								onChange={(e) => setName(e.target.value)} 
								placeholder="Enter name here."
							/>
							<div class="invalid-feedback">Name is required!</div>
						</div>
						
						{/* Description */}
						<div class="form-group mb-2">
							<label for="tagDescription" class="form-label">Tag Description</label>
							<textarea 
								class="form-control" 
								rows="10" cols="80" 
								id="tagDescription" 
								value={description} 
								onChange={(e) => setDescription(e.target.value)} 
								placeholder="Enter your description here. This uses markdown!"
							/>
						</div>
						
						{/* Submit button */}
						<btn type="submit" onClick={submit} class={"btn btn-primary " + (name ? "" : "disabled")}>Submit</btn>
					</form>
				</div>

				{/* Right column */}
				<div class="col">
					<h2>Display:</h2>
					<div class="p-2 border">
						<h1>{name}</h1>
						<Markdown contents={description}/>
					</div>
				</div>
			</div>

			
		</div>
	)
}