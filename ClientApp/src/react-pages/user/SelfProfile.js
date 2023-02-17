import React, { useState, useEffect } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';

export default function SelfProfile() {
	// Stores auth token
	const [userToken, setUserToken] = useState(null);
	const [lastModified, setLastModified] = useState(null);

	useEffect(() => {
		(async function () {
			const token = await authService.getAccessToken();
			setUserToken(token);
			
			// check if the resume was already uploaded
			let response = await fetch(`api/resumes/self/date`, { 
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});
			if (response.ok) {
				let date = await response.text();
				setLastModified(new Date(date));
			}

			/*let pdf = await fetch(`api/resumes/self/file`, { 
				headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
			});
			console.log(pdf);*/
		})();
	}, []);

	//https://www.pluralsight.com/guides/uploading-files-with-reactjs
	// File upload
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [fileValidation, setFileValidation] = useState(null);

	const changeHandler = (event) => {
		let file = event.target.files[0];
		//https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&tabs=visual-studio
		if (!file) {
			setFileValidation("Must upload a file to submit!");
			setIsFilePicked(false);
		}
		else if (file.size < 256000) {
			setSelectedFile(event.target.files[0]);
			setIsFilePicked(true);
			console.log(event.target.files[0]);
			setFileValidation(null);
		}
		else {
			setFileValidation("File must be less than 256 KB!");
		}
	}

	const handleSubmission = () => {
		if (!isFilePicked) {
			setFileValidation("Must upload a file to submit!");
			return;
		}

		const formData = new FormData();
		formData.append('File', selectedFile);

		fetch(`api/resumes/self`, {
			method: 'post',
			headers: !userToken ? {} : { 'Authorization': `Bearer ${userToken}`},
			body: formData
		})
			.then(async (response) => console.log(response));
	};

	return (
		<>
			<h1>Profile page</h1>
			<h5>
				<em>
					{lastModified ?	<>Your resume was last modified at: <br/> {lastModified.toString()}</> : "You have not uploaded a resume yet." }
				</em>
			</h5>
			<br/>
			<div className="form-group">
				<label htmlFor='resumeFile' class="form-label">Upload your resume here:</label>
				<input 
					id="resumeFile"
					class={`form-control ${fileValidation ? "is-invalid" : ""}`}
					type="file"
					accept=".pdf"
					name="file"
					onChange={changeHandler}
				/>
				<div class="invalid-feedback">{fileValidation}</div>
			</div>
			<button class="btn" onClick={handleSubmission}>Submit</button>
			
		</>
	)
}