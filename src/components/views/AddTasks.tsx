import NavBar from 'components/ui/NavBar';
import Header from 'components/ui/Header';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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

function addressAutocomplete(containerElement, callback, options, clearAddress) {

  // Create a box where all elements will be put together
  const inputContainerElement = document.createElement("div");
  inputContainerElement.setAttribute("class", "myprofile input-container");
  containerElement.appendChild(inputContainerElement);

  // create input element (actual box in which users type)
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("class", "myprofile input")
  inputElement.setAttribute("placeholder", options.placeholder);
  inputContainerElement.appendChild(inputElement);

  let currentTimeout;
  let currentPromiseReject;

  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;

  /* Current autocomplete items data */
  var currentItems;

  // add input field clear button to the container
  const clearButton = document.createElement("div");
  clearButton.setAttribute("class", "myprofile clear-button");
  console.log(clearButton.classList)
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    closeDropDownList();
    clearAddress();
    clearButton.classList.remove("visible");
  });
  inputContainerElement.appendChild(clearButton);

  /* Process a user input: */
  inputElement.addEventListener("input", function(e) {
      const currentValue = this.value;
      if (!currentValue) {
        clearButton.classList.remove("visible");
      }

      // Show clearButton when there is a text
      if (currentValue) {
        clearButton.classList.add("visible");
      }

      // Cancel previous timeout
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }

      // Cancel previous request promise
      if (currentPromiseReject) {
        currentPromiseReject({
          canceled: true
        });
      }

      // Skip empty or short address strings
      if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
        return false;
      }

      /* Call the Address Autocomplete API with a delay */
      currentTimeout = setTimeout(() => {
      	currentTimeout = null;

        /* Create a new promise and send geocoding request */
        const promise = new Promise((resolve, reject) => {
          currentPromiseReject = reject;

          // Get an API Key on https://myprojects.geoapify.com
          const apiKey = "b2c7062794cf4157a379b72fefdae945";

          var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

          fetch(url)
            .then(response => {
              currentPromiseReject = null;

              // check if the call was successful
              if (response.ok) {
                response.json().then(data => resolve(data));
              } else {
                response.json().then(data => reject(data));
              }
            });
        });

        promise.then((data) => {
          // here we get address suggestions
          currentItems = data.results;

        /*create a DIV element that will contain the proposed items*/
        const autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "myprofile autocomplete-items");
        inputContainerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.results.forEach((result, index) => {
          /* Create a DIV element for each element: */
          const itemElement = document.createElement("div");
          /* Set formatted address as item value */
          itemElement.innerHTML = result.formatted;
          autocompleteItemsElement.appendChild(itemElement);
          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].formatted;
            callback(currentItems[index]);
            /* Close the list of autocompleted values: */
            closeDropDownList();
          });
        });

        }, (err) => {
          if (!err.canceled) {
            console.log(err);
          }
        });
      }, DEBOUNCE_DELAY);
    });
  function closeDropDownList() {
    var autocompleteItemsElement = inputContainerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      inputContainerElement.removeChild(autocompleteItemsElement);
    }
  }

  // Function that sets the value of the textbox to the selected item
  function setActive(items, index) {
    if (!items || !items.length) return false;

    // Only mark the currently selected item as active
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }
    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].formatted;
    callback(currentItems[index]);
    closeDropDownList();
  }

  function addIcon(buttonElement) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");
    svgElement.style.marginTop = "-20px";

    const iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
  /* Close the autocomplete dropdown when the document is clicked.
      Skip, when a user clicks on the input field */
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });
}

const AddTasks = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId")
  const [addressFieldAdded, setAddressFieldAdded] = useState(false);
  const [title, setTitle] = useState<string>(null);
  const [description, setDescription] = useState<string>(null);
  const [compensation, setCompensation] = useState<int>(null);
  const [address, setAddress] = useState<string>(null);
  const [latitude, setLatitude] = useState<float>(null);
  const [longitude, setLongitude] = useState<float>(null);
  const [date, setDate] = useState<Date>(null);
  const [duration, setDuration] = useState<float>(null);

  const clearAddress = () => {
    setAddress(null);
    setLatitude(null);
    setLongitude(null);
  };

  const doCreateTask = async () => {
    // Send all the info for the new task to the backend
    try {
      //const requestBody = JSON.stringify({description, title, compensation, date, address, "latitude":latitude, "longitude":longitude, duration, "creatorId":currentUserId });
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

  useEffect(() => {
    console.log(!addressFieldAdded)
    if (!addressFieldAdded) {
      addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
        if (data) {
        console.log("Selected option: ");
                // Access to input by using "data"
                console.log(data.formatted);
                console.log(data.lat);
                console.log(data.lon);
                // Set the three values
                setAddress(data.formatted);
                setLatitude(data.lat);
                setLongitude(data.lon);
        }
      }, {placeholder: "Where will you need your helper?"}, clearAddress);
      //setAddressFieldAdded(true);
    }
  }, [addressFieldAdded]);

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
              <div className="myprofile field">
                <label className="myprofile label">Address</label>
                <div
                  id="autocomplete-container"
                />
              </div>
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