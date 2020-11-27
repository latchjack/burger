import React from 'react';
import classes from './Input.module.css'

const input = (props) => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];

  if(props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch(props.elementType) {
    case('input'):
      inputElement = <input 
        className={inputClasses.join(' ')} 
        {...props.elementConfig} 
        value={props.value}
        onChange={props.changed} />;
      break;
    case('textarea'):
      inputElement = <textarea 
        className={inputClasses.join(' ')} 
        {...props.elementConfig} 
        value={props.value}
        onChange={props.changed} />;
      break;
      case('select'):
      inputElement = (
        <select 
          className={inputClasses.join(' ')} 
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = <input 
        className={inputClasses.join(' ')} 
        {...props.elementConfig} 
        value={props.value}
        onChange={props.changed} />;
  }

  let validationError = null;
  if (props.invalid && props.touched) {
    validationError = (
      <p 
        style={{
          fontSize: '12px', 
          color: 'red', 
          marginTop: '4px', 
          marginBottom: '1px', 
          boxSizing: 'border-box'
        }}
      >
        Please enter a valid {props.valueType}!
      </p>
    );
  }

  return(
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  );
}

export default input;