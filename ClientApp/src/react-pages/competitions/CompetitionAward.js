import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import authService from '../../components/api-authorization/AuthorizeService';
import AwardListItem from '../../components/AwardListItem';
import Select from 'react-select';
import { BookmarkPlus } from 'react-bootstrap-icons';

export default function CompetitionAward() {

	const [bios, setBios] = useState([]);
	const [selectedUser, setSelectedUser] = useState();

	useEffect(() => {
		fetch('api/bios')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setBios(data.map(bio => ({ value: bio.userId, label: bio.name })))
			});
	}, []);

	return (
		<>
			<h1>Edit Awards</h1>

			<div class="list-group">
				<span class="list-group-item flex-column align-items-start">
					<div class="d-flex w-100 justify-content-between">
						<h5 class="mb-1">Award</h5>
						<small class="text-muted">
							Delete
						</small>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="user" class="col-sm-2 col-form-label">User:</label>
						<div class="col-sm-10">
							<input type="text" class="form-control-plaintext" id="user" value="USERNAME (USERID)"></input>
						</div>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="rank" class="col-sm-2 col-form-label">Rank:</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="rank"></input>
						</div>
					</div>
				</span>


				<span class="list-group-item flex-column align-items-start">
					<div class="d-flex w-100 justify-content-between">
						<h5 class="mb-1">Add Award</h5>
						<small class="text-muted">
							Create
						</small>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="user" class="col-sm-2 col-form-label">User:</label>
						<div class="col-sm-10">
							<Select
								id="user"
								isClearable
								isSearchable
								onChange={(newValue) => setSelectedUser(newValue)}
								options={bios}
								value={selectedUser}
							/>
						</div>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="rank" class="col-sm-2 col-form-label">Rank:</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="rank"></input>
						</div>
					</div>
				</span>


				<span class="list-group-item flex-column align-items-start">
					<div class="d-flex w-100 justify-content-between">
						<div class="col-sm-11 mx-0">
							<div class="form-group row mb-2">
								<label htmlFor="user" class="col-sm-2 col-form-label">User:</label>
								<div class="col-sm-10">
									<Select
										id="user"
										isClearable
										isSearchable
										onChange={(newValue) => setSelectedUser(newValue)}
										options={bios}
										value={selectedUser}
									/>
								</div>
							</div>
							<div class="form-group row mb-2">
								<label htmlFor="rank" class="col-sm-2 col-form-label">Rank:</label>
								<div class="col-sm-10">
									<input type="text" class="form-control" id="rank"></input>
								</div>
							</div>
						</div>
						<div class="col-sm-1 position-relative">
							<BookmarkPlus size={72} className="position-absolute top-50 end-0 translate-middle-y mx-0" />
						</div>
					</div>
					
				</span>
			</div>
		</>
	)
}