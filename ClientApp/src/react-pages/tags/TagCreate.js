import React, { useState } from 'react';
import { TextAreaFG, TextInputFG } from '../../components/FormGroups';
import Markdown from '../../components/Markdown';

export default function TagCreate() {
  //Tag information
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  // POSTs the tag
  const submit = (event) => {
    let body = {
      id: 0,
      name: name,
      description: description,
    };

    fetch('/api/tags', {
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
      window.location.href = '/tags';
    });
  };

  return (
    <div>
      <h1>Create Tag</h1>

      <div class="row">
        {/* Left Column */}
        <div class="col">
          <h2>Form:</h2>
          <form>
            {/* Name */}
            <TextInputFG
              label="Tag Name"
              value={name}
              onChange={setName}
              isRequired={true}
            />

            {/* Description */}
            <TextAreaFG
              label="Tag Description"
              value={description}
              onChange={setDescription}
            />

            {/* Submit button */}
            <btn
              type="submit"
              onClick={submit}
              class={'btn btn-primary ' + (name ? '' : 'disabled')}
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
            <Markdown contents={description} />
          </div>
        </div>
      </div>
    </div>
  );
}
