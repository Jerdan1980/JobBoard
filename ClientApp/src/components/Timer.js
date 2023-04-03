import React from 'react';
import Countdown from 'react-countdown';

const daysWarning = 1;
const milisecondsWarning = Math.round(daysWarning * 24 * 60 * 60 * 1000);

// Handles the common timer display for competitions
// If the competition is starting before daysWarning, displays just numbers, otherwise includes a progress bar
// If the competition is ongoing, will try to display a progress bar til completion, otherwise will just say 'status unknown'
export default function Timer({ comp }) {
  return (
    <Countdown date={comp.startTime} renderer={render2Start} comp={comp} />
  );
}

// Renders the start timer. If there is less than 24 hours, it will show a progress bar
// If the competition has started, will display either an unknown status or an ending timer
const render2Start = ({ total, days, formatted, completed, props }) => {
  // Handles displaying the ongoing/completed status
  if (completed) {
    if (props.comp.endTime) {
      //https://stackoverflow.com/questions/1968167/difference-between-dates-in-javascript
      let start = new Date(props.comp.startTime);
      let end = new Date(props.comp.endTime);
      return (
        <Countdown
          date={props.comp.endTime}
          renderer={render2End}
          duration={end - start}
        />
      );
    }
    return (
      <div class="text-center">
        Competition has started, but finish time is unknown!
      </div>
    );
  }

  // Displays a progress bar if its less than daysWarning away
  if (days < daysWarning) {
    return (
      <div>
        <span class="position-absolute inline-block start-50 translate-middle-x">
          Starts in: {formatted.days}:{formatted.hours}:{formatted.minutes}:
          {formatted.seconds}
        </span>
        <div class="progress" style={{ height: '2em' }}>
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${(total / milisecondsWarning) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }
  return (
    <div class="text-center">
      Starts in: {formatted.days}:{formatted.hours}:{formatted.minutes}:
      {formatted.seconds}
    </div>
  );
};

// Renders the end timer
const render2End = ({ total, formatted, completed, props }) => {
  // Announces that the competition is completed
  if (completed) {
    return <div class="text-center">Competition has ended!</div>;
  }

  // Displays a progress bar
  return (
    <div>
      <span class="position-absolute inline-block start-50 translate-middle-x">
        Finishes in: {formatted.days}:{formatted.hours}:{formatted.minutes}:
        {formatted.seconds}
      </span>
      <div class="progress" style={{ height: '2em' }}>
        <div
          class="progress-bar progress-bar-striped progress-bar-animated bg-danger"
          role="progressbar"
          style={{ width: `${(total / props.duration) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
