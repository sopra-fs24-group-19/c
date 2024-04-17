import NavBar from 'components/ui/NavBar';
import Header from 'components/ui/Header';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Task from "models/Task"
import "styles/views/AddTasks.scss";
//In order to work with the DatePicker, type in the terminal: "npm install react-datepicker --save"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FormField = (props) => {
  return (
    <div className="addtasks field">
      <label className="addtasks label">{props.label}</label>
      <input
        className="addtasks input"
        type={"text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};


const PriceDropdown = (props) => {
  const handleChange = (event) => {
    props.onChange(parseInt(event.target.value));
  };
  return (
    <div className="addtasks field">
      <label className="addtasks label">{props.label}</label>
      <div className="addtasks dropdown-container">
        <select
          className="addtasks input"
          value={props.value !== null ? props.value : ''}
          onChange={handleChange}
          style={{color: props.value === null ? '#999999' : '#553842'}}
        >
          <option value="" disabled >{props.placeholder}</option>
          {[...Array(20)].map((_, index) => (
            <option key={index + 1} value={index + 1} >
              {index + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
PriceDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};


const DurationDropdown = (props) => {
  const handleChange = (event) => {
    props.onChange(parseInt(event.target.value));
  };
  return (
    <div className="addtasks field">
      <label className="addtasks label">{props.label}</label>
      <div className="addtasks dropdown-container">
        <select
          className="addtasks input"
          value={props.value !== null ? props.value : ''}
          onChange={handleChange}
          style={{color: props.value === null ? '#999999' : '#553842'}}
        >
          <option value="" disabled hidden>{props.placeholder}</option>
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20">20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
          <option value="240">4 hours</option>
          <option value="241">more than 4 hours</option>
        </select>
      </div>
    </div>
  );
};
DurationDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};


const OurDatePicker = (props) => {
  return (
    <div className="addtasks field">
      <label className="addtasks label">{props.label}</label>
          <DatePicker
            className="addtasks input"
            selected={props.value}
            onChange={props.onChange}
            placeholderText={props.placeholder}
            minDate={new Date()}
            showTimeSelect // Add this prop to enable time selection
            dateFormat="yyyy-MM-dd HH:mm"
            style={{width: "410px !important"}}
          />
    </div>
  );
};
OurDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};


const AddTasks = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId")
  const [title, setTitle] = useState<string>(null);
  const [description, setDescription] = useState<string>(null);
  const [compensation, setCompensation] = useState<int>(null);
  const [address, setAddress] = useState<string>(null);
  const [date, setDate] = useState<Date>(null);
  const [duration, setDuration] = useState<float>(null);

  const doCreateTask = async () => {
    // Send all the info for the new task to the backend
    try {
      const requestBody = JSON.stringify({description, title, compensation, date, address, duration, "creatorId":currentUserId });
      const response = await api.post("/tasks", requestBody);

    // After successful task creation --> navigate to the homefeed
          navigate("/homefeed");

    } catch (error) {
            alert(
              //"We're sorry, you don't have enough coins at the moment, please reduce the compensation or help your neighbors to receive more coins."
              `Something went wrong during the task creation: \n${handleError(error)}`
            );
    }
  }
  return (
        <>
          <NavBar />
          <div className="addtasks container">
            <h1 >Create a new task</h1>
            <p>Ask your community for help by creating a task that you need help with</p>
            <div className="addtasks form">

              {/*Define all needed attributes for a new task*/}
              <FormField
                label="Title of task"
                placeholder={"Give your task a name to find it quickly"}
                value={title}
                onChange={(t: string) => setTitle(t)}
              />
              <FormField
                label="Description"
                placeholder={"Please describe the task in detail"}
                value={description}
                onChange={(desc: string) => setDescription(desc)}
              />
              <PriceDropdown
                label="Compensation"
                placeholder={"How many coins will you offer to your helper?"}
                value={compensation}
                onChange={(p: int) => setCompensation(p)}
                />
              <FormField
                label="Address"
                placeholder={"Where will the task task place?"}
                value={address}
                onChange={(a: int) => setAddress(a)}
              />
              <OurDatePicker
                label="Date"
                placeholder={"When should this task be done?"}
                value={date}
                onChange={(d: Date) => setDate(d)}
              />
              <DurationDropdown
                label="Estimated duration"
                placeholder={"How long will the task approximately take?"}
                value={duration}
                onChange={(du: float) => setDuration(du)}
              />



              <div className="addtasks button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
                  onClick={() => navigate("/homefeed")}
                >
                  Cancel
                </Button>
                <Button
                  width="100%"
                  disabled={!title || !description || !compensation || !address || !date || !duration}
                  onClick={() => doCreateTask()}
                 >
                  Create task
                </Button>
              </div>

            </div>
          </div>
         </>
  );
};

export default AddTasks;