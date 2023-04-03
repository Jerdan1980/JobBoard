import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import authService from '../../components/api-authorization/AuthorizeService';
import { TextInputFG } from '../../components/FormGroups';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function BioSettings() {
  // Stores auth token
  const [userToken, setUserToken] = useState(null);

  // Bio information
  const [name, setName] = useState();
  const [privacy, setPrivacy] = useState(0);

  const options = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Recruiters Only' },
    { value: 2, label: 'Public' },
  ];

  useEffect(() => {
    (async function () {
      const token = await authService.getAccessToken();
      setUserToken(token);

      // check if the resume was already uploaded
      let response = await fetch('api/self/bio', {
        headers: !token ? {} : { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        setName(data.name);
        //setBio(data.bio);
        setPrivacy(data.privacy);
      }
    })();
  }, []);

  const handleSubmit = () => {
    let body = {
      id: 0,
      userId: 'asdf', // the backend will handle this ig
      name: name,
      //bio: bio,
      privacyLevel: privacy,
    };

    fetch('/api/self/bio', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(body),
    }).then((response) => {
      if (!response.ok) {
        alert(response.statusText);
        return;
      }
      window.location.reload();
    });
  };

  return (
    <>
      <div className="row">
        <ProfileSettingsSidebar active="bio" />

        <div className="col">
          <h1>Bio</h1>

          <form>
            {/* Name */}
            <TextInputFG
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Enter public name here."
              isRequired={true}
            />

            {/* Privacy Level */}
            <div class="form-group mb-2">
              <label class="form-label">Privacy Level</label>
              <Select
                defaultValue={options[0]}
                name="Privacy Level"
                options={options}
                value={options[privacy]}
                onChange={(e) => setPrivacy(e.value)}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              onClick={handleSubmit}
              class={'btn btn-primary mb-2 ' + (name ? '' : 'disabled')}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
