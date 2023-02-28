import React, { useState, useEffect } from 'react';

export function useAwards(compId) {
	const [awards, setAwards] = useState([]);

	useEffect(() => {
		fetch(`api/awards/comp/${compId}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				setAwards(data)
			});
	}, []);

	const updateAward = (toUpdate) => {
		// If its an array, assume its replacing the list
		if (Array.isArray(toUpdate)) {
			setAwards(toUpdate);
			return;
		}
		// Find if it has a match
		let index = awards.findIndex(award => award.userId == toUpdate.userId);
		// No match means update
		if (index == -1) {
			setAwards([...awards, toUpdate]);
			return;
		}
		// Else update the item
		// It looks wierd but properly triggers the update
		setAwards(awards.map((award, i) => i == index ? toUpdate : award));
	}

	const removeAward = (toRemove) => {
		setAwards(awards.filter(award => award.userId != toRemove.userId));
	}

	return [awards, setAwards, updateAward, removeAward]
}