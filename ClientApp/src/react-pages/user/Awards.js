import React from 'react';
import AwardListItem from '../../components/AwardListItem';
import { useAuthApi } from '../../components/CustomHooks';
import ProfileSettingsSidebar from '../../components/ProfileSettingsSidebar';

export default function Awards() {
  // Stores awards
  const [awards, setAwards] = useAuthApi('api/self/awards');

  return (
    <>
      <div className="row">
        <ProfileSettingsSidebar active="awards" />

        <div className="col">
          <h1>Awards</h1>
          {awards.length === 0 ? (
            <p>You don't have any awards yet.</p>
          ) : (
            <div class="list-group">
              {awards.map((award) => (
                <AwardListItem award={award} linked={true} key={award.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
