import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import { useAwards, useSelect } from '../../components/CustomHooks';

export default function CompetitionAward() {
	// Gets id from the url
	const queryString = new URLSearchParams(useLocation().search);
	const id = queryString.get('id');

	// List of bios
	const [bios, setBios, isLoading, setIsLoading] = useSelect('api/bios', 'userId', 'name');

	// Handle creating a new award
	const [selectedUser, setSelectedUser] = useState();
	const [rank, setRank] = useState("");

	// Award information
	const [awards, setAwards, updateAward, removeAward] = useAwards(id);

	const createAward = (e) => {
		if (selectedUser == null && rank == null)
			return;

		let award = {
			id: 0,
			userName: selectedUser.label,
			rank: rank,
			userId: selectedUser.value,
		};

		updateAward(award);
	}

	const submit = () => {
		console.log(JSON.stringify(awards));
		fetch(`/api/awards`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(awards)
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
			<h1>Edit Awards</h1>

			<div class="list-group mb-2">
				{awards.map((award, index) => (
					<AwardItem award={award} key={award.userId} updateAward={updateAward} removeAward={removeAward}/>
				))}

				<span class="list-group-item flex-column align-items-start">
					<div class="d-flex w-100 justify-content-between mb-2">
						<h5>Add Award</h5>
						<button type="button" class="btn btn-sm btn-outline-primary" onClick={createAward}>
								Create
						</button>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="user" class="col-sm-2 col-form-label">User:</label>
						<div class="col-sm-10">
							<Select
								id="user"
								isClearable
								isSearchable
								isLoading={isLoading}
								options={bios}
								value={selectedUser}
								onChange={(newValue) => setSelectedUser(newValue)}
								classNames={{
									option: (state) => state.isSelected ? 'text-light' : 'text-muted'
								}}
							/>
						</div>
					</div>
					<div class="form-group row mb-2">
						<label htmlFor="rank" class="col-sm-2 col-form-label">Rank:</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="rank" value={rank} onChange={(e) => setRank(e.target.value)}></input>
						</div>
					</div>
				</span>

			</div>

			<button type="submit" class="btn btn-primary" onClick={submit}>Save</button>
		</>
	)
}

// SO link doesnt actually work for whatever reason, but this is fine.
//https://stackoverflow.com/questions/33080657/react-update-one-item-in-a-list-without-recreating-all-items
function AwardItem({ award, updateAward, removeAward }) {
	const update = (e) => {
		let temp = award;
		temp.rank = e.target.value;
		updateAward(temp);
	}

	return (
		<span class="list-group-item flex-column align-items-start">
			<div class="d-flex w-100 justify-content-between mb-2">
				<h5>Award</h5>
				<button type="button" class="btn btn-sm btn-outline-danger" onClick={() => removeAward(award)}>
						Delete
				</button>
			</div>
			<div class="form-group row mb-2">
				<label htmlFor="user" class="col-sm-2 col-form-label">User:</label>
				<div class="col-sm-10">
					<input type="text" class="form-control-plaintext" id="user" value={`${award.userName} (${award.userId})`} readOnly></input>
				</div>
			</div>
			<div class="form-group row mb-2">
				<label htmlFor="rank" class="col-sm-2 col-form-label">Rank:</label>
				<div class="col-sm-10">
					<input type="text" class="form-control" id="rank" value={award.rank} onChange={update}></input>
				</div>
			</div>
		</span>
	);
}