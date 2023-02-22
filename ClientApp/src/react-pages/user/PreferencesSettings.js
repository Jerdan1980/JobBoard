import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';
import Select from 'react-select';

export default function PreferencesSettings() {

	// Handles tags, loading in new tags, and keeping track of what tags were selected
	const [isTagsLoading, setIsTagsLoading] = useState(false);
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	// Handles industries, loading in new industries, and keeping track of what industries were selected
	const [isIndustriesLoading, setIsIndustriesLoading] = useState(false);
	const [industries, setIndustries] = useState([]);
	const [selectedIndustries, setSelectedIndustries] = useState([]);

	// Loads tags on page load
	useEffect(() => {
		setIsTagsLoading(true);
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
				setTags(data.map(tag => ({value: tag.id, label: tag.name})));
				setIsTagsLoading(false);
			})
	}, []);

	// Loads industries on page load
	useEffect(() => {
		setIsIndustriesLoading(true);
		fetch('/api/industries')
			.then(response => {
				if (!response.ok)
				{
					alert(response.statusText);
					return;
				}
				return response.json();
			})
			.then(data => {
				setIndustries(data.map(industry => ({value: industry.id, label: industry.name})));
				setIsIndustriesLoading(false);
			})
	}, []);

	return (
		<>
			<div className='row'>
				<ProfileSettingsSidebar active="preferences"/>

				<div className='col'>
					<h1>Preferences</h1>

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

					<button class="btn btn-primary">Save</button>

				</div>
			</div>
		</>
	)
}