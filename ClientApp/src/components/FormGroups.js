import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

export function TextInputFG({
  label,
  value,
  onChange,
  isRequired = false,
  placeholder = `Enter your ${label} here.`,
}) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`txtfg-${label}`} class="form-label">
        {label}
      </label>
      <input
        type="text"
        class={'form-control ' + (isRequired && !value ? 'is-invalid' : '')}
        id={`txtfg-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div class="invalid-feedback">Name is required!</div>
    </div>
  );
}

export function IntInputFG({
  label,
  value,
  onChange,
  isRequired = false,
  placeholder = `Enter your ${label} here.`,
}) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`intfg-${label}`} class="form-label">
        {label}
      </label>
      <input
        type="number"
        step="1"
        pattern="\d+"
        class={'form-control ' + (isRequired && !value ? 'is-invalid' : '')}
        id={`intfg-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div class="invalid-feedback">Name is required!</div>
    </div>
  );
}

export function TextAreaFG({
  label,
  value,
  onChange,
  placeholder = `Enter your ${label} here. This uses markdown!`,
}) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`txtareafg-${label}`} class="form-label">
        {label}
      </label>
      <textarea
        class="form-control"
        rows="10"
        cols="80"
        id={`txtareafg-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function TimeFG({ label, value, onChange }) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`timefg-${label}`} class="form-label">
        {label}
      </label>
      <input
        type="datetime-local"
        class="form-control"
        id={`timefg-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      ></input>
    </div>
  );
}

export function CreateableMultiSelectFG({
  label,
  isLoading,
  options,
  value,
  onChange,
  onCreate,
}) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`createmultiselfg-${label}`} class="form-label">
        {label}
      </label>
      <CreatableSelect
        id={`createmultiselfg-${label}`}
        isClearable
        isMulti
        isDisabled={isLoading}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={(newValue) => onChange(newValue)}
        onCreateOption={onCreate}
      />
    </div>
  );
}

export function MultiSelectFG({ label, isLoading, options, value, onChange }) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`multiselfg-${label}`} class="form-label">
        {label}
      </label>
      <Select
        id={`multiselfg-${label}`}
        isClearable
        isMulti
        isDisabled={isLoading}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={(newValue) => onChange(newValue)}
      />
    </div>
  );
}

export function SelectFG({ label, isLoading, options, value, onChange }) {
  return (
    <div class="form-group mb-2">
      <label htmlFor={`selfg-${label}`} class="form-label">
        {label}
      </label>
      <Select
        id={`multiselfg-${label}`}
        isDisabled={isLoading}
        isLoading={isLoading}
        options={options}
        value={value}
        onChange={(newValue) => onChange(newValue)}
      />
    </div>
  );
}

export function SwitchFG({ label, checked, onChange }) {
  return (
    <div class="form-check form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        id={`switchfg-${label}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label class="form-check-label" htmlFor={`switchfg-${label}`}>
        {label}
      </label>
    </div>
  );
}
