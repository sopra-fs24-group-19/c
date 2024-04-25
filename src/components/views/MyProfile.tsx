import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import User from "models/User";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/MyProfile.scss";

const FormField = (props) => {
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <input
        className="myprofile input"
        id={props.id}
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
  placeholder: PropTypes.string,
  id: PropTypes.string
};

const RadiusDropdown = (props) => {
  const handleChange = (event) => {
    props.onChange(parseInt(event.target.value));
  };
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <div className="myprofile dropdown-container">
        <select
          className="myprofile input"
          value={props.value !== null ? props.value : ''}
          onChange={handleChange}
          style={{width: '410px', color: props.value === null ? '#999999' : '#553842'}}
        >
          <option value="" disabled >{props.placeholder}</option>
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="3">3 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="15">15 km</option>
          <option value="20">20 km</option>
          <option value="21">see all tasks</option>
        </select>
      </div>
    </div>
  );
};
RadiusDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
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

const MyProfile = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId");
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [addressFieldAdded, setAddressFieldAdded] = useState(false);

  // Define variables for the attributes that can be changed
  const [username, setUsername] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>(null);
  const [address, setAddress] = useState<string>(null);
  const [latitude, setLatitude] = useState<float>(null);
  const [longitude, setLongitude] = useState<float>(null);
  const [radius, setRadius] = useState<int>(null);

  const clearAddress = () => {
    setAddress(null);
    setLatitude(null);
    setLongitude(null);
  };

  useEffect(() => {
    const fetchUserData = async () => {
    try {
        const response = await api.get(`/users/${currentUserId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentUser(response.data);
        console.log(response.data);
        console.log(currentUser);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the tasks! See the console for details."
        );
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (currentUser && !addressFieldAdded) {
      console.log(currentUser);
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
      }, {placeholder: currentUser.address ? currentUser.address: "Add your location"}, clearAddress);
      setAddressFieldAdded(true);
    }
  }, [currentUser, addressFieldAdded]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const doSaveUpdates = async () => {
    console.log(latitude);
    try {
      // Specify if we send the current values or if the user has updated these values:
      const newName = name ? name: currentUser.name;
      const newAddress = address ? address: currentUser.address;
      const newPhoneNumber = phoneNumber ? phoneNumber: currentUser.phoneNumber;
      const newRadius = radius ? radius: currentUser.radius;
      const newLatitude = latitude ? latitude: currentUser.latitude;
      const newLongitude = longitude ? longitude: currentUser.longitude;
      const requestBody = JSON.stringify({"name":newName,"username":currentUser.username,"address":newAddress,"phoneNumber":newPhoneNumber,"radius":newRadius,"latitude":newLatitude,"longitude":newLongitude});
      const response = await api.put(`/users/${currentUser.id}`, requestBody, {headers: {"Authorization": localStorage.getItem("token")}});
      // Get the returned user and update a new object.
      const updatedUser = new User(response.data);
      console.log('Updated user:', updatedUser);
      // After successful update, reload the page
      window.location.href = "/myprofile";
    } catch (error) {
      alert(
        `Your updates could not be saved: \n${handleError(error)}`
      );
    }
  };

  return (
        <>
          <NavBar />
          <div className="myprofile container">
            <h1 >{currentUser.username}{"'"}s profile</h1>
            <p>Here, you can edit your profile</p>
            <div className="myprofile form">

              {/*Define all needed attributes that can be changed by a user*/}
              <FormField
                label="Name"
                placeholder={currentUser.name}
                value={name}
                onChange={(n: string) => setName(n)}
              />
              <FormField
                label="Phone Number"
                placeholder={currentUser.phoneNumber ? currentUser.phoneNumber: "Add your phone number"}
                value={phoneNumber}
                onChange={(pn: string) => setPhoneNumber(pn)}
              />
              <div className="myprofile field">
                <label className="myprofile label">Address</label>
                <div
                  id="autocomplete-container"
                />
              </div>
              <RadiusDropdown
                label="Radius in which to look for tasks"
                placeholder={currentUser.radius ? currentUser.radius : "Choose radius"}
                value={radius}
                onChange={(r: int) => setRadius(r)}
              />
              <div className="myprofile button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
                  onClick={() => navigate("/homefeed")}
                >
                  Back to homefeed
                </Button>
                <Button
                  width="100%"
                  disabled={!name && !phoneNumber && !address && !radius}
                  onClick={() => doSaveUpdates()}
                 >
                  Save changes
                </Button>
              </div>

            </div>
          </div>
         </>
  );
};

export default MyProfile;
