import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CompetitionCard from '../../components/CompetitionCard';
import {
  useApi,
  useLoginStatus,
  useQueryParams,
  useSelect,
} from '../../components/CustomHooks';
import {
  MultiSelectFG,
  SwitchFG,
  TextInputFG,
} from '../../components/FormGroups';

export default function Competitions() {
  // Query params that carry from other pages
  const queryParams = new URLSearchParams(useLocation().search);
  const tagIdParam = queryParams
    .getAll('tag')
    .map((str) => Number.parseInt(str));

  // Competition Information
  const [competitions] = useApi('/api/competitions');

  // Stores login status
  const loggedIn = useLoginStatus();

  // Tags and selectedTags
  const [tags, isLoading] = useSelect(
    '/api/tags/min',
    'id',
    (data) => `${data.name} (${data.count})`
  );
  const [selectedTags, setSelectedTags] = useQueryParams(tagIdParam, tags);

  // Filter settings
  const [showFilter, setShowFilter] = useState(false);
  const [showOngoing, setShowOngoing] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showUser, setShowUser] = useState(true);
  const [showAutomated, setShowAutomated] = useState(true);
  const [query, setQuery] = useState('');

  // Returns a bool depending on what the user wants.
  //		Works by filtering out any unwanted competitions.
  //		Uses shortcircuiting to quickly remove competitions
  function filter(comp) {
    const isCompleted = comp.endTime
      ? Date.parse(comp.endTime) < Date.now()
      : false;
    const isOngoing = comp.startTime
      ? Date.parse(comp.startTime) < Date.now()
      : false;
    const hasTag =
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        comp.tags.map((tag) => tag.id).includes(tag.value)
      );
    const inQuery =
      comp.name.toLowerCase().includes(query.toLowerCase()) ||
      comp.description.toLowerCase().includes(query.toLowerCase());

    return (
      hasTag &&
      ((showUser && !comp.automated) || (showAutomated && comp.automated)) &&
      !(!showCompleted && isCompleted) &&
      !(!showOngoing && isOngoing) &&
      inQuery
    );
  }

  return (
    <div>
      <div class="row">
        <div class="col">
          <h1>Competitions</h1>
        </div>
        <div class="col position-relative">
          <a
            class={
              'btn btn-primary position-absolute top-0 end-0' +
              (!loggedIn ? ' disabled' : '')
            }
            href="/competitions/create"
          >
            Create
          </a>
        </div>
      </div>

      {/* List of competitions */}
      {competitions
        .filter((comp) => filter(comp))
        .map((comp) => {
          return <CompetitionCard comp={comp} />;
        })}

      {/* Floating button to open the filter side panel */}
      <div class="sticky-bottom d-flex justify-content-end">
        <button
          class="btn btn-info m-2 shadow-lg"
          type="button"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter Competitions
        </button>
      </div>

      {/* Filter side panel */}
      <div
        class={'offcanvas offcanvas-end' + (showFilter ? ' show' : '')}
        tabindex="-1"
        id="offcanvasFilter"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasFilterTitle">
            Filter Competitions
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            onClick={() => setShowFilter(false)}
          ></button>
        </div>
        <div class="offcanvas-body">
          {/* Number after filtering */}
          <p>
            {competitions.filter((comp) => filter(comp)).length} Competitions
            match your settings!
          </p>

          {/* Text Search Bar */}
          <TextInputFG
            label="Search"
            value={query}
            onChange={setQuery}
            placeholder="Search for a competition."
          />

          {/* Tags section */}
          <MultiSelectFG
            label="CompetitionTags (OR)"
            isLoading={isLoading}
            options={tags}
            value={selectedTags}
            onChange={setSelectedTags}
          />

          {/* Competition Status */}
          <fieldset class="form-group mb-2">
            <legend>Competition Status</legend>
            <SwitchFG
              label="Show ongoing competitions"
              checked={showOngoing}
              onChange={setShowOngoing}
            />
            <SwitchFG
              label="Show completed competitions"
              checked={showCompleted}
              onChange={setShowCompleted}
            />
          </fieldset>

          {/* Competition Type */}
          <fieldset class="form-group mb-2">
            <legend>Competition Type</legend>
            <SwitchFG
              label="Show user-made competitions"
              checked={showUser}
              onChange={setShowUser}
            />
            <SwitchFG
              label="Show automated competitions"
              checked={showAutomated}
              onChange={setShowAutomated}
            />
          </fieldset>
        </div>
      </div>
    </div>
  );
}
