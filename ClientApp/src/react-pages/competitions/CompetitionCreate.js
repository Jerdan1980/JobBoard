import React, { useState } from 'react';
import { useSelect } from '../../components/CustomHooks';
import {
  CreateableMultiSelectFG,
  TextAreaFG,
  TextInputFG,
  TimeFG,
} from '../../components/FormGroups';
import Markdown from '../../components/Markdown';

export default function CompetitionCreate() {
  // Competition information
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  // Handles tags, loading in new tags, and keeping track of what tags were selected
  const [tags, setTags, isLoading, setIsLoading] = useSelect(
    '/api/tags',
    'id',
    'name'
  );
  const [selectedTags, setSelectedTags] = useState([]);

  // Handles creation of a new tag
  // POSTS a new tag and then loads the tags back in
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    fetch('/api/tags', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: inputValue }),
    }).then(async (response) => {
      if (response.ok) {
        response = await fetch('/api/tags');
        if (!response.ok) {
          alert(response.statusText);
          return;
        }

        let data = await response.json();
        setTags(data.map((tag) => ({ value: tag.id, label: tag.name })));
      }
      setIsLoading(false);
    });
  };

  // POSTS the competition
  const submit = (event) => {
    let body = {
      id: 0,
      name: name,
      description: description,
      tagIds: selectedTags.map((tag) => tag.value),
    };

    if (startTime) body.startTime = startTime;

    if (endTime) body.endTime = endTime;

    fetch('/api/competitions', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        alert(response.statusText);
        return;
      }
      window.location.href = '/competitions';
    });
  };

  return (
    <div>
      <h1>Create Competition</h1>

      <div class="row">
        {/* Left Column */}
        <div class="col">
          <h2>Form:</h2>
          <form>
            {/* Name */}
            <TextInputFG
              label="Competition Name"
              value={name}
              onChange={setName}
              isRequired={true}
            />

            {/* Description */}
            <TextAreaFG
              label="Competition Description"
              value={description}
              onChange={setDescription}
            />

            {/* Start Time */}
            <TimeFG
              label="Competition Start Time (in UTC)"
              value={startTime}
              onChange={setStartTime}
            />

            {/* End Time */}
            <TimeFG
              label="Competition End Time (in UTC)"
              value={endTime}
              onChange={setEndTime}
            />

            {/* Tags section */}
            <CreateableMultiSelectFG
              label="Competition Tags"
              isLoading={isLoading}
              options={tags}
              value={selectedTags}
              onChange={setSelectedTags}
              onCreate={handleCreate}
            />

            {/* Submit button */}
            <btn
              type="submit"
              onClick={submit}
              class={'btn btn-primary mb-2 ' + (name ? '' : 'disabled')}
            >
              Submit
            </btn>
          </form>
        </div>

        {/* Right column */}
        <div class="col">
          <h2>Display:</h2>
          <div class="p-3 border rounded-3">
            <h1>{name}</h1>

            {/* Tags */}
            {selectedTags.length !== 0 && (
              <div class="mb-1">
                Tags:{' '}
                {selectedTags.map((tag) => (
                  <button class="btn btn-sm btn-outline-light me-1">
                    {tag.label}
                  </button>
                ))}
              </div>
            )}

            <Markdown contents={description} />
          </div>
        </div>
      </div>
    </div>
  );
}
