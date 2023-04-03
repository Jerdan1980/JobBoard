import React, { useEffect, useState } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';
import Pdf from '../../components/Pdf';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function ResumeSettings() {
  // Stores auth token
  const [userToken, setUserToken] = useState(null);

  // Holds Resume data
  const [lastModified, setLastModified] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    (async function () {
      const token = await authService.getAccessToken();
      setUserToken(token);

      // check if the resume was already uploaded
      let response = await fetch('api/self/resume/date', {
        headers: !token ? {} : { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        let date = await response.text();
        setLastModified(new Date(date));

        // Only get the resume if it exists
        response = await fetch('api/self/resume/file', {
          headers: !token ? {} : { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          let pdf = await response.blob();
          setResume(pdf);
        }
      }
    })();
  }, []);

  // Used for deleting the resume
  const oldName = 'DELETE';
  const [deleteString, setDeleteString] = useState('');

  // DELETEs the competition
  const remove = (event) => {
    if (oldName === deleteString)
      fetch('/api/self/resume', {
        method: 'delete',
        headers: !userToken ? {} : { Authorization: `Bearer ${userToken}` },
      }).then((response) => {
        if (response.ok) {
          window.location.reload();
          alert('Delete successful!');
          return;
        }
        alert(response.statusText);
      });
  };

  //https://www.pluralsight.com/guides/uploading-files-with-reactjs
  // File upload
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [fileValidation, setFileValidation] = useState(null);

  const changeHandler = (event) => {
    let file = event.target.files[0];
    //https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&tabs=visual-studio
    if (!file) {
      setFileValidation('Must upload a file to submit!');
      setIsFilePicked(false);
    } else if (file.size < 256000) {
      setSelectedFile(event.target.files[0]);
      setIsFilePicked(true);
      console.log(event.target.files[0]);
      setFileValidation(null);
    } else {
      setFileValidation('File must be less than 256 KB!');
    }
  };

  const handleSubmission = () => {
    if (!isFilePicked) {
      setFileValidation('Must upload a file to submit!');
      return;
    }

    const formData = new FormData();
    formData.append('File', selectedFile);

    fetch('api/self/resume', {
      method: 'post',
      headers: !userToken ? {} : { Authorization: `Bearer ${userToken}` },
      body: formData,
    }).then(async (response) => {
      if (response.ok) {
        alert('File successfully uploaded!');
        window.location.reload();
      } else {
        alert('File failed to upload!');
      }
    });
  };

  return (
    <>
      <div class="row">
        <ProfileSettingsSidebar active="resume" />

        <div class="col">
          <h1>Resume</h1>
          <p>
            {lastModified ? (
              <>
                Last modified at: <em>{lastModified.toString()}</em>
              </>
            ) : (
              'You have not uploaded a resume yet.'
            )}
          </p>

          <div class="row">
            {/* POST resume */}
            <div class="col">
              <h4>{lastModified ? 'Update' : 'Upload'} Resume</h4>
              <div className="form-group mb-2">
                <label class="form-label" htmlFor="resumeFile">
                  Select file to upload here:
                </label>
                <input
                  id="resumeFile"
                  class={`form-control ${fileValidation ? 'is-invalid' : ''}`}
                  type="file"
                  accept=".pdf"
                  name="file"
                  onChange={changeHandler}
                />
                <div class="invalid-feedback">{fileValidation}</div>
              </div>
              <button class="btn btn-primary" onClick={handleSubmission}>
                Submit
              </button>
            </div>

            {/* DELETE resume */}
            {lastModified && (
              <div class="col">
                <h4 class="text-danger">Delete Resume</h4>
                <div className="form-group mb-2">
                  <label class="form-label" htmlFor="resumeDelete">
                    <em>
                      <strong>Warning:</strong> This action is irreversible!
                    </em>
                  </label>
                  <input
                    type="text"
                    class={
                      'form-control ' +
                      (deleteString === oldName ? 'is-valid' : 'is-invalid')
                    }
                    id="resumeDelete"
                    value={deleteString}
                    onChange={(e) => setDeleteString(e.target.value)}
                  ></input>
                  <div class="invalid-feedback">
                    Type `<span class="text-primary">{oldName}</span>` to delete
                    this Contest.
                  </div>
                </div>
                <button
                  class={
                    'btn btn-danger ' +
                    (deleteString === oldName ? '' : 'disabled')
                  }
                  onClick={remove}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Resume Preview */}
          {lastModified && (
            <>
              <br />
              <h2>Your resume: </h2>
              <div className="vh-100 overflow-auto">
                <Pdf src={resume} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
