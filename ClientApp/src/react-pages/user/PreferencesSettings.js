import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';
import Select from 'react-select';
import { useSelect } from '../../components/CustomHooks';

export default function PreferencesSettings() {
	// Stores auth token
	const [userToken, setUserToken] = useState(null);

	// Handles tags, loading in new tags, and keeping track of what tags were selected
	const [tags, setTags, isTagsLoading, setIsTagsLoading] = useSelect('/api/tags', "id", "name");
	const [selectedTags, setSelectedTags] = useState([]);

	// Handles industries, loading in new industries, and keeping track of what industries were selected
	const [industries, setIndustries, isIndustriesLoading, setIsIndustriesLoading] = useSelect('/api/industries', "id", "name");
	const [selectedIndustries, setSelectedIndustries] = useState([]);

	// Loads user preferences on page load
	useEffect(() => {
		// Don't bother if they haven't loaded in yet
		if(industries.length === 0 || tags.length === 0)
			return;

		(async function () {
			const token = await authService.getAccessToken();
			setUserToken(token);
			
			// check if the resume was already uploaded
			let response = await fetch(`api/self/preferences`, { 
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});
			if (response.ok) {
				let data = await response.json();

				// TODO: update the current selection based off of the recieved data
				let selIndustries = industries.filter(industry => data.industryIds.includes(industry.value))
				setSelectedIndustries(selIndustries);

				let selTags = tags.filter(tag => data.tagIds.includes(tag.value));
				setSelectedTags(selTags);
			}
		})();
	}, [industries, tags]);

	// Update the new userpreferences
	const handleSubmission = () => {
		let body = {
			industryIds: selectedIndustries.map(industry => industry.value),
			tagIds: selectedTags.map(tag => tag.value)
		}

		fetch(`api/self/preferences`, {
			method: 'post',
			headers: {
				'Content-type': 'application/json',
				'Authorization': `Bearer ${userToken}`
			},
			body: JSON.stringify(body)
		})
			.then(response => {
				if (response.ok) {
					alert("Successfully saved!");
					window.location.reload();
				}
				else
					alert(`There was an error!`);
			});
	}

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="preferences"/>

				<div className='col'>
					<h1>Preferences</h1>

					{/* Industries section */}
					<div class="form-group mb-2">
						<label for="industries" class="form-label">Industries</label>
						<Select
							isClearable
							isMulti
							isDisabled={isIndustriesLoading}
							isLoading={isIndustriesLoading}
							onChange={(newValue) => setSelectedIndustries(newValue)}
							options={industries}
							value={selectedIndustries}
						/>
					</div>

					{/* Tags section */}
					<div class="form-group mb-2">
						<label for="tags" class="form-label">Tags</label>
						<Select
							isClearable
							isMulti
							isDisabled={isTagsLoading}
							isLoading={isTagsLoading}
							onChange={(newValue) => setSelectedTags(newValue)}
							options={tags}
							value={selectedTags}
						/>
					</div>

					<button class="btn btn-primary" onClick={handleSubmission}>Save</button>

				</div>
			</div>
		</>
	)
}