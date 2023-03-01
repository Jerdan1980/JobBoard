import React from 'react';
import { PersonVcard, FileEarmarkPerson, PersonGear, PersonBoundingBox, Award, Sliders, House } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { NavLink } from 'reactstrap';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';

export default function ProfileSettingsSidebar({ active }) {

	function isActive(key) {
		return (key === active) ? "active" : "";
	}

	return (
		<div class="d-flex flex-column flex-shrink-0 p-3 bg-dark" style={{width: "280px"}}>
			<a href="/self" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-light text-decoration-none">
				<PersonBoundingBox size={32} className="me-2" />
				<span class="fs-4">Profile Settings</span>
			</a>
			<hr/>
			<ul class="nav nav-pills flex-column mb-auto">
				<li class="nav-item">
					<a href="/self" class={`nav-link ${isActive("dashboard")}`}>
						<House size={16} className="me-2 mb-1" />
						Dashboard
					</a>
				</li>
				<li class="nav-item">
					<a href="/self/bio" class={`nav-link ${isActive("bio")}`}>
						<PersonVcard size={16} className="me-2 mb-1" />
						Bio
					</a>
				</li>
				<li>
					<a href="/self/resume" class={`nav-link ${isActive("resume")}`}>
						<FileEarmarkPerson size={16} className="me-2 mb-1" />
						Resume
					</a>
				</li>
				<li>
					<a href="/self/preferences" class={`nav-link ${isActive("preferences")}`}>
						<PersonGear size={16} className="me-2 mb-1"/>
						Preferences
					</a>
				</li>
				{/*
				<li>
					<a href="#" class="nav-link">
						<ListCheck size={16} className="me-2 mb-1" />
						Careers
					</a>
				</li>
				*/}
				<li>
					<a href="/self/awards" class={`nav-link ${isActive("awards")}`}>
						<Award size={16} className="me-2 mb-1" />
						Awards
					</a>
				</li>
				<li>
					<NavLink tag={Link} className="" to={`${ApplicationPaths.Profile}`}>
						<Sliders size={16} className="me-2 mb-1" />
						Account Settings
					</NavLink>
				</li>
			</ul>
		</div>
	)
}