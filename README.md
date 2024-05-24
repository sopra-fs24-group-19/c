# Helping Hands - Reinventing Community Solidarity

## Introduction
In an age where technology dominates our lives, the sense of community in our neighborhoods has sadly diminished. It’s not uncommon today for people to not know the names of their neighbors, with greetings reduced to mere formalities. The Helping Hands project is born out of the necessity to revive that lost sense of community, reminiscent of the times of our parents and grandparents.
### About the App

Helping Hands is designed to strengthen community bonds by enabling users to request and offer help within their local neighborhoods. At the heart of our platform is the belief that communities thrive when neighbors support each other. Users can define their search radius to find or offer help nearby, making assistance both timely and relevant to local needs. To facilitate a fair exchange of services, our app uses a virtual coin system. Users earn coins by helping others, which they can then use to request help for themselves. This coin-based economy not only incentivizes participation but also ensures that the exchange of services remains balanced. Here’s how it works:

1. **Registration**: Users can sign up and create a profile.
2. **Posting Tasks**: Users can post requests for help with specific tasks, such as grocery shopping, pet sitting, or any other daily activities.
3. **Specifying a radius**: Users can specify their search radius in order to make sure they see only tasks that are nearby.
4. **Finding Tasks**: By entering their home address, users can view tasks nearby. This ensures that help is always close at hand.
5. **Filtering Tasks**: Users can specify their search criteria in order to make sure they see only the tasks that align with their needs.
6. **Applying for tasks**: Users can select tasks that match their skills and preferences and offer their help.
7. **Selecting a helper**: A user that has posted a task can select the most suited candidate from a list of users that have applied.
8. **Shared to-do list**: In order to better organize the work, while a task is ongoing, both parties have access to a real-time shared to-do list section.
9. **Earning Coins**: Upon completing tasks, users earn symbolic coins. These coins incentivize helping others and can be used to post their own tasks.
10. **Community Feedback**: A review system ensures that the individuals offering help are trustworthy and competent.
11. **Leaderboard**: There is a leaderboard where users can see the most helpful people in the community, fostering a spirit of friendly competition and recognition.

### Vision

Our vision is to restore the neighborly spirit of mutual assistance and goodwill. In a world increasingly disconnected by technology, Helping Hands aims to bring people together, fostering a community where everyone looks out for one another.

### Conclusion

Helping Hands is more than just an app; it’s a movement to rekindle the sense of community and solidarity that seems to have faded in our modern world. Join us in making neighborhoods friendlier and more supportive places to live. Together, we can make a difference, one helping hand at a time.

## Frontend Technologies

- [React](https://reactjs.org/): React is a JavaScript library to create user interfaces, particularly single-page applications where data changes over time. React facilitates the development of interactive UIs by efficiently updating and rendering components as data changes.
- [TypeScript](https://www.typescriptlang.org/): TypeScript is a programming language that is built upon [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript). It enhances development efficiency and code quality by enabling developers to catch errors early.
- [Axios](https://axios-http.com/): A popular library used for making asynchronous HTTP requests.
- [Bootstrap](https://getbootstrap.com/): A front-end framework that provides a collection of CSS and JavaScript tools for building responsive, mobile-first websites quickly.
- [CRACO](https://github.com/gsoft-inc/craco): Craco is a tool that allows easy configuration and customization of Create React App (CRA) without ejecting.
- [React Icons](https://react-icons.github.io/react-icons/): A library that provides a collection of popular icons for React applications.
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS): CSS is a style sheet language used for describing the presentation of a document written in HTML or XML.
- [Geoapify](https://www.geoapify.com/): Geoapify is an API tailored for applications using geolocations and mapping services.

## High-level Components
The primary components of the frontend are the core pages enabling the user to take advantage of the functionalities of the website Helping Hands. In the following we will look at the most important pages.

### Login / Registration page
Both login and registation pages serve as entry point to our application. The user can either create a new account or log into his existing account. Upon successful login or registration, he is directed to the Homefeed from which he has access to all functionalities.

For more information visit the page [Login](https://sopra-fs24-group-19-client.oa.r.appspot.com/login) or [Registration](https://sopra-fs24-group-19-client.oa.r.appspot.com/register) on our website and have a look at the related [codebase for Login](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/Login.tsx) or the related [codebase for registration](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/Register.tsx).

### My Profile
On this page the user can edit his profile. This includes the adjustment of his name and phone number. But most importantly, the user can add his location and specify in which radius he is interested to help. This information is used to specify which tasks will be shown on the users homefeed to give him an individualized experience. The user is also able to get access to all available tasks by setting his radius specification to "see all tasks".

For more information visit the page [My Profile](https://sopra-fs24-group-19-client.oa.r.appspot.com/myprofile) on our website and have a look at the related [codebase](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/MyProfile.tsx).

### Homefeed
The homefeed is the core page of our application. From all pages the user can directly navigate here through a button on the bottom or simply clicking "Homefeed" in the navigation bar. The homefeed page gives the user an overview of all available tasks in the user's specified radius. If the radius has not yet been set, the user is informed about this missing information and is asked to set a radius and an address with an according link to the profile page.

On the homefeed users can scroll through available tasks to find one that is matching their criteria. If a task has been found, they can apply for it by simply pressing a button. The users information will then automatically be sent to the task creator. This page only shows tasks that are available for applications and have not yet been started.

For more information visit the page [Homefeed](https://sopra-fs24-group-19-client.oa.r.appspot.com/homefeed) on our website and have a look at the related [codebase](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/HomeFeed.tsx).

### Task creation page
The task creation page serves as the entry point to get help from your community. The page can be accessed through the button "Create new task" in the upper left of the header and is always available. Here, the user can specify what they need help with. For this purpose, they need to add a title, a description, a specified amount of coins their helper should receive upon completing the task, an address and finally a date and time as well as an estimated duration. By specifying the address, we make sure that the task will only be displayed to users who are willing to help in this location.
Once all fields are successfully filled, the user can click the "Create task" button upon which their task goes online and is displayed for all possible applicants.
The user can access their own tasks at a later point through the page "My Tasks".

For more information visit the page [Create a new task](https://sopra-fs24-group-19-client.oa.r.appspot.com/addtasks) on our website and have a look at the related [codebase](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/AddTasks.tsx).

### My Tasks / My applications
In these two pages, users can see all tasks that are somehow related to them. Either they created them or applied to them. This simplifies the process of finding tasks the user is currently working on. Both pages can additionally be filtered in order to only see tasks that have a specific status. Task creators can select their final helper from all applicants, helpers can withdraw their applications as long as they have not been chosen yet.
Once a helper is selected, both creator and helper have access to a shared ToDo list where the task can be defined in detail.
Additionally, upon completion of a task, users will be reminded to give feedback if that has not been done yet.

For more information visit the pages [My Tasks](https://sopra-fs24-group-19-client.oa.r.appspot.com/mytasks) and [My Applications](https://sopra-fs24-group-19-client.oa.r.appspot.com/myapplications) on our website and have a look at the related [codebase for My Tasks](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/MyTasks.tsx) or the related [codebase for My Applications](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/MyApplications.tsx).

### Shared ToDo list
Finally, we have a page which helps organizing each task efficiently. Both task creators and helpers can add steps that need to be done in order to finish the task. This way, one can keep track of the task's progress and make sure nothing is forgotten. Users can also delete or update their posted ToDo's. The task creator has the ability to mark each step as Done by clicking the tick on the right side. Once done, a step can no longer be adjusted. This way we make sure subtasks are not altered after completion.
When all steps are marked as complete, both parties have the option to mark the task as Done upon which they are being directed to a feedback form.
The shared ToDo list is accesible through either the "My Tasks" or the "My Applications" page. 

For more information visit the page [ToDo's](https://sopra-fs24-group-19-client.oa.r.appspot.com/todo) on our website and have a look at the related [codebase](https://github.com/sopra-fs24-group-19/client-group19/blob/main/src/components/views/ToDo.tsx).

## Launch & Development

The onboarding process is crucial for a new developer and it involves training to ensure the frontend components function properly.

### Cloning the Repositories

**Client:**
```sh
git clone https://github.com/sopra-fs24-group-19/client-group19
```

### Running the application

**Frontend**

For the client, the developer must ensure to have Node.js version 20.11.0 and npm version 10.4.0 installed.

Installing Dependencies:
It is important to ensure all dependencies are installed with:
```sh
npm install
```
To run the application:
```sh
npm start
```

## Illustrations
### Registration and Login
To begin using the application, users must first register by providing the following information: name, username, and password. After registration, users will be redirected to the HomeFeed page. To view all tasks, navigate to the "My Profile" page located at the top left corner and complete the remaining profile details, including address and the maximum radius for viewing tasks from the provided address. Optionally, users can also add their phone number. 

The user's username and remaining coin balance (initially set to 50 coins upon registration) are always displayed in the page header, next to the logout button.
<img width="1434" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/5702b91e-f267-4a25-a9cc-6d49395a4c79">


### Creating a Task
After completing the profile, users can either view existing tasks or create a new one. To create a new task, click on the "Create New Task" button located at the top left and enter the following information: task title, description, compensation (in coins), address where the task needs to be performed, date, and an approximate duration of the task. 

Users can verify the successful creation of the task by navigating to the "My Tasks" page, where they can view and manage their posted tasks. This includes checking the list of applicants by clicking on "Check out Helpers" or deleting the task by clicking on "Delete Task."
<img width="1435" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/506c09ec-8069-4bec-b560-a59daf35911d">


### Applying to a task
Once a task is created, it will appear in the HomeFeed of users whose filters, set directly on the HomeFeed page and in "My Profile," match the task's criteria.

Users can apply to assist with a task by clicking the "Help" button. The task creator will see the new applicant in real-time under "My Tasks" -> "Check out Helpers." The creator can view the applicant's profile by clicking on "Look at Ratings" and accept them as a helper by clicking "Accept as Helper".

Applicants can withdraw their application by clicking "Withdraw my application" until they are selected as helpers.
<img width="1435" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/77f52b87-902a-4644-add0-eced1b3d5b35">



### To-Do List
Once a helper is accepted, both the creator and the helper can access the To-Do list, which outlines the actions required to complete the task. The creator can access this list by clicking on "My Tasks" -> "Check out the To-Do List," and the helper can access it by clicking on "My Tasks" -> "Look at your To-Do List".

On the To-Do list page, both the creator and the helper can add tasks related to the ongoing task. The person who posted the To-Do can update or delete it, but only the task creator can mark To-Dos as completed.
<img width="1429" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/ea4502c7-6ce5-4111-a0d0-4ee8b81d8599">



### Reviews
Only when all To-Dos are marked as done can users click on "Mark Task As Done," which redirects them to the page for leaving a review for the other user. If the review is not left immediately, it can be done later on the "My Tasks" or "My Applications" page by clicking on "Leave a review."

Users can also view their profiles and respective reviews by clicking on "My Profile" -> "Check out my reviews".
<img width="1426" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/2e3467de-b733-49e0-b7aa-85f018697150">
<img width="1424" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/61dd5d01-c2e5-4540-a4ab-7981b2816b5e">



### Leaderboard
The spirit of Helping Hands is to create a supportive community where everyone helps as much as they can. Therefore, we have included a page called "Leaderboard," accessible by clicking on the trophy icon next to "Create New Task." This page allows users to view all members and identify the most virtuous ones who have helped others with the most tasks.
<img width="1428" alt="image" src="https://github.com/sopra-fs24-group-19/client-group19/assets/134708770/76e37abc-c56a-40cb-b39c-0c0e9e4e79e8">


## Roadmap

Envisioning continued development on the proposed application, it would be interesting to implement the following functionalities both on the frontend and the supporting backend services:

- **Notification System**: Implement a notification system that can communicate with users via various platforms such as email, SMS, or a dedicated application released on Android and iOS. This system would notify users about service updates, such as being selected for a task, the completion of a to-do, or receiving a review.

- **Real-time Interaction**: Implementing websockets for better handling of real time interaction.

- **Enhanced Task Filtering**: Incorporate additional filtering systems to improve task search capabilities. As the number of tasks grows with the increase in users, effective filtering becomes essential. Implementing a search bar that allows filtering by keywords could fulfill this requirement, making it easier for users to find relevant tasks.


## Authors and Acknowledgement

### Authors

- **Nina Rubesa**  
  - Matriculation Number: 23744667  
  - Email: [nina.rubesa@uzh.ch](mailto:nina.rubesa@uzh.ch)  
  - GitHub: [nina22221111](https://github.com/nina22221111)
 
- **Sina Klerings**  
  - Matriculation Number: 23729627  
  - Email: [sinacaecilia.klerings@uzh.ch](mailto:sinacaecilia.klerings@uzh.ch)  
  - GitHub: [sinakle](https://github.com/sinakle)
 
### Contributors

- **Dana Rapp**  
  - Matriculation Number: 23731995  
  - Email: [dana.rapp@uzh.ch](mailto:dana.rapp@uzh.ch)  
  - GitHub: [dana-jpg](https://github.com/dana-jpg)

- **Francesco Manzionna**  
  - Matriculation Number: 23745979  
  - Email: [francesco.manzionna@uzh.ch](mailto:francesco.manzionna@uzh.ch)  
  - GitHub: [Holwy](https://github.com/Holwy)


## License

This project is licensed under the GNU General Public License v3.0, see the [LICENSE](LICENSE) file for details.

We chose the GPL v3.0 to ensure that our project remains free and open, allowing users to use, modify, and distribute the software while ensuring that all modifications remain open and accessible to the community.
