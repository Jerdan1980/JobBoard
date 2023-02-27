import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';
import Select from 'react-select';

export default function BioSettings() {
	// Stores auth token
	const [userToken, setUserToken] = useState(null);

	// Bio information
	const [name, setName] = useState();
	//const [bio, setBio] = useState();
	const [privacy, setPrivacy] = useState(0);

	const options = [
		{ value: 0, label: "Private" },
		{ value: 1, label: "Recruiters Only" },
		{ value: 2, label: "Public" }
	];

	useEffect(() => {
		(async function () {
			const token = await authService.getAccessToken();
			setUserToken(token);
			
			// check if the resume was already uploaded
			let response = await fetch(`api/self/bio`, { 
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});
			if (response.ok) {
				let data = await response.json();
				console.log(data);
				setName(data.name);
				//setBio(data.bio);
				setPrivacy(data.privacy);
			}
		})();
	}, []);

	const handleSubmit = () => {
		let body = {
			id: 0,
			userId: "asdf", // the backend will handle this ig
			name: name,
			//bio: bio,
			privacyLevel: privacy
		};
		
		fetch('/api/self/bio', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${userToken}`
			},
			body: JSON.stringify(body)
		})
			.then(response => {
				if (!response.ok) {
					alert(response.statusText);
					return;
				}
				window.location.reload();
			})
	}

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="bio"/>

				<div className="col">
					<h1>Bio</h1>

					<form>

						{/* Name */}
						<div class="form-group mb-2">
							<label htmlFor="name" class="form-label">Name</label>
							<input
								type="text"
								class={"form-control " + (name ? "" : "is-invalid")} 
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter public name here."
							/>
							<div class="invalid-feedback">Name is required!</div>
						</div>

						{/* Bio */}
						{/*
						<div class="form-group mb-2">
							<label htmlFor="bio" class="form-label">Bio</label>
							<textarea
								class="form-control"
								rows="10" cols="80"
								id="bio"
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Describe yourself"
							/>
						</div>
						*/}

						{/* Privacy Level */}
						<div class="form-group mb-2">
							<label class="form-label">Privacy Level</label>
							<Select
								defaultValue={options[0]}
								name="Privacy Level"
								options={options}
								value={options[privacy]}
								onChange={(e) => setPrivacy(e.value)}
							/>
						</div>
						
						<btn type="submit" onClick={handleSubmit} class={"btn btn-primary mb-2 " + (name ? "" : "disabled")}>Submit</btn>
					</form>

				</div>
			</div>
		</>
	)
}