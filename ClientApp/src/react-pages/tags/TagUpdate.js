import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Markdown from '../../components/Markdown';
import { TextAreaFG, TextInputFG } from '../../components/FormGroups';

export default function TagUpdate() {
	// Grabs id from the url (technically the queryString)
	const id = new URLSearchParams(useLocation().search).get('id');

	//Tag information
	const [ name, setName ] = useState();
	const [ description, setDescription] = useState();

	// GETS the tag on page load
	useEffect(() => {
		fetch(`/api/tags/${id}`)
			.then(async (response) => {
				if (!response.ok) {
					alert(response.statusText);
					return;
				}

				let data = await response.json();
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
					<form>
						{/* Name */}
						<TextInputFG label="Tag Name" value={name} onChange={setName} isRequired={true}/>
						
						{/* Description */}
						<TextAreaFG label="Tag Description" value={description} onChange={setDescription} />
						
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