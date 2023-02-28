import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';

export default function TagUpdate() {
	// Grabs id from the url (technically the queryString)
	const id = new URLSearchParams(useLocation().search).get('id');

	//Tag information
	const [ name, setName ] = useState();
	const [ description, setDescription] = useState();

	// GETS the tag on page load
	useEffect(() => {
		fetch(`/api/tags/${id}`)
			.then(response => {
				if (!response.ok) {
					alert(response.statusText);
					window.location.href = `/tags`;
					return;
				}
				return response.json();
			})
			.then(data => {
				setName(data.name);
				setDescription(data.description);
			});
	}, [id]);

	// POSTs the tag
	const submit = (event) => {
		let body = {
			'id': id,
			'name': name,
			'description': description,
		};

		fetch(`/api/tags`, {
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
				window.location.href = '/tags';
			})
	}

	return (
		<div>
			<h1>Update Tag</h1>

			<div class="row">
				{/* Left Column */}
				<div class="col">
					<h2>Form:</h2>
					
						{/* Name */}
						<form>
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
					<div class="p-3 border rounded-3">
						<h1>{name}</h1>
						<Markdown contents={description}/>
					</div>
				</div>
			</div>

			
		</div>
	)
}