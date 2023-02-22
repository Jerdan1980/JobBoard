import React from 'react';
import { PersonVcard, FileEarmarkPerson, PersonGear, PersonBoundingBox, Award, ListCheck, House } from 'react-bootstrap-icons';



export default function ProfileSettingsSidebar({ active }) {

	function isActive(key) {
		return (key === active) ? "active" : "";
	}

	return (
		<div class="d-flex flex-column flex-shrink-0 p-3 bg-dark" style={{width: "280px"}}>
			<a href="/self/dashboard" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-light text-decoration-none">
				<PersonBoundingBox size={32} className="me-2" />
				<span class="fs-4">Profile Settings</span>
			</a>
			<hr/>
			<ul class="nav nav-pills flex-column mb-auto">
				<li class="nav-item">
					<a href="/self/dashboard" class={`nav-link ${isActive("dashboard")}`}>
						<House size={16} className="me-2 mb-1" />
						Dashboard
					</a>
				</li>
				<li class="nav-item">
					<a href="#" class="nav-link">
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
				<li>
					<a href="#" class="nav-link">
						<ListCheck size={16} className="me-2 mb-1" />
						Careers
					</a>
				</li>
				<li>
					<a href="#" class="nav-link">
						<Award size={16} className="me-2 mb-1" />
						Awards
					</a>
				</li>
			</ul>
		</div>
	)
}