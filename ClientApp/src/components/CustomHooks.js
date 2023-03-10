import React, { useState, useEffect } from 'react';
import authService from './api-authorization/AuthorizeService';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';

export function useSelect(url, value, label) {
	const [options, setOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch(url)
			.then(async (response) => {
				if (!response.ok) {
					alert(response.statusText);
					return;
				}

				let data = await response.json();
				let isValueString = (typeof value === 'string' || value instanceof String);
				let isLabelString = (typeof label === 'string' || label instanceof String);
				setOptions(data.map(data => ({
					value: isValueString ? data[value] : value(data),
					label: isLabelString ? data[label] : label(data)
				})));
				setIsLoading(false);
			});
	}, []);

	return [options, setOptions, isLoading, setIsLoading];
}

export function useQueryParams(queryParams, source, filter = (src) => queryParams.includes(src.value)) {
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		if (!queryParams || queryParams.length == 0)
			return;
		
		setSelected(source.filter(src => filter(src)));
	}, [source]);

	return [selected, setSelected];
}

export function useApi(url, defaultValue = []) {
	const [data, setData] = useState(defaultValue);

	useEffect(() => {
		fetch(url)
			.then(async (response) => {
				if (!response.ok) {
					alert(response.statusText);
					return;
				}

				let data = await response.json();
				setData(data);
			});
	}, []);

	return [data, setData];
}

export function useAuthApi(url, defaultValue = []) {
	const [data, setData] = useState(defaultValue);

	useEffect(() => {
		(async function() {
			const token = await authService.getAccessToken();
			if (!token) {
				alert("You are not logged in!");
				return;
			}
			
			let response = await fetch(url, {
				headers: { 'Authorization': `Bearer ${token}`}
			});

			// Could also follow SO:
			//https://stackoverflow.com/questions/65388990/auto-logout-after-access-token-expires-in-react-application
			// However, we only want to log them out if they need to do something while being logged in
			// Otherwise it would be annoying to have to re-login after every hourish
			if (response.status == 401) {
				alert("Your login session expired!");
				await authService.signOut();
				return;
			}

			if (!response.ok) {
				alert(response.statusText);
				return;
			}

			let data = await response.json();
			setData(data);
		})();
	}, []);

	return [data, setData];
}

export function useLoginStatus() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	useEffect(() => {
		(async function() {
			const token = await authService.getAccessToken();
			if (!token)
				setIsLoggedIn(false);
			else
				setIsLoggedIn(true);
		})();
	}, []);

	return isLoggedIn;
}

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