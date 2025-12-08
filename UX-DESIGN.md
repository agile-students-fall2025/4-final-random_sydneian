# User Experience Design

## [Prototype](https://www.figma.com/proto/BpP76AJSPGrvqKm4NxUNV8/Wireframe---Prototype?node-id=3-2&p=f&t=l0gLg5nXlvDjBoPv-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A2)

The [interactive prototype](https://www.figma.com/proto/BpP76AJSPGrvqKm4NxUNV8/Wireframe---Prototype?node-id=3-2&p=f&t=l0gLg5nXlvDjBoPv-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3%3A2) demonstrates the core user flows of the Rendezvous application:

**Authentication Flow:** Users can navigate between the registration and login screens to create an account or sign in to an existing one.

**Group Management:** From the Dashboard, users can create new groups, join existing groups, or select from their current groups to view the associated bucket list.

**Bucket List Management:** Within a group, users can view all bucket list items, toggle between "To Do" and "Done" tabs, and add new items either by pasting social media links or manually entering details.

**Decision Making:** Users can access the Decision Wheel to randomly select a bucket list item or use filters to narrow down options based on category and location preferences.

**Memory Capture:** After completing activities, users can document their experiences in the Memory Book by adding photos and viewing past memories.

The prototype allows stakeholders to experience the app's navigation flow and understand how users will interact with key features before development begins.

## App Map

![App Map](ux-design/app-map.png)

The app map shows the hierarchical structure of the application. Users start at the Log In / Sign Up screen, then proceed to the Dashboard, which serves as the central hub. From the Dashboard, users can join existing groups, create new groups, access their Profile and Settings, or navigate to My Groups. Within My Groups, users can manage their Bucket List (adding items via paste link or manual entry), use the Decision Zone (with randomize or filter options), and contribute to the Memory Book by adding photos of completed experiences.

## Wireframes

### Register / Log In

![Register](ux-design/register.png)
![Log In](ux-design/login.png)
![Register error](ux-design/register-error.png)
![Log In error](ux-design/login-error.png)

The authentication screens provide entry points for both new and returning users. Both display the Rendezvous branding with the tagline "Plan together, decide faster." The Register screen includes input fields for username, email, and password with a "Sign up" button and a link to log in, and shows an inline error message if the password is too weak. The Log In screen includes fields for username and password with a "Log in" button and a link to sign up, displaying an error message if the credentials are incorrect.

### Email Verification

![Email OTP screen](ux-design/email-verification.png)

If the user registered for the app, then first verify their email before continuing.

### Dashboard

![Dashboard](ux-design/dashboard.png)

The Dashboard serves as the main hub after login. It features Quick Actions buttons for creating a new group or joining an existing group. Below that, the My Groups section displays a list of all groups the user belongs to, each with a navigation arrow to access the group's bucket list.

## Profile & Settings

![Profile and settings screen](ux-design/profile-settings.png)

There is a settings popup where the user can adjust their account details, such as their profile picture, name, or email, select which types of notifications they want, which theme to use, and a few misc items (rating and about the app).

## Create New Group

![Create New Group screen](ux-design/create-new-group.png)

This screen allows users to create a new group, by entering its details.

## Join Existing Group

![Join Existing Group screen](ux-design/join-existing-group.png)

Users can any invites, and search for groups to join.

### Bucket List

![Bucket List](ux-design/bucket-list.png)
![Bucket List](ux-design/bucket-list-done.png)

The Bucket List screen shows all items for a selected group. Users can toggle between "To Do" and "Done" tabs to view pending or completed items. Each bucket list item card displays the place name, location, who added it, when it was added, and category tags. A floating action button at the bottom allows users to add new items to the list.

### Add Place

![Add Place](ux-design/add-place.png)

The Add Place screen provides two methods for adding bucket list items: "Paste Link" for importing from social media or web sources, and "Add Manually" for custom entries. The screen displays Recent Additions as reference examples showing places that have been added.

### Add Place Through Link

![Add Place Through Link](ux-design/add-place-through-link.png)

This screen allows users to import bucket list items by pasting TikTok or Instagram links. After entering a URL and clicking "Import Details," a preview section displays the extracted information including an image placeholder, place name, location, and highlights. Users can optionally add tags before clicking "Add to Bucket List" to save the item.

### Add Place Manually

![Add Place Manually](ux-design/add-place-manually.png)

The Add Place Manually screen provides form fields for users to input place details directly, including place name, location, category dropdown, description text area, and tags. A dashed box allows users to add photos, and a button at the bottom adds the item to the bucket list.

### Decision Wheel

![Decision Wheel](ux-design/decision-wheel.png)

The Decision Wheel helps groups choose which bucket list item to tackle next. It displays a circular wheel with a "Spin" button in the center. Below the wheel are three option slots that can be populated with bucket list items. Users can remove items from the wheel using the X button next to each option, then spin to randomly select an activity.

### Decision Filters

![Decision Filters](ux-design/decision-filters.png)

The Decision Filters screen allows users to narrow down bucket list options by category, location, and tags (or by just clicking the randomise button). Multiple dropdown fields are provided for each filter type, enabling users to apply multiple criteria simultaneously to help with decision-making.

### Memory Book

![Memory Book](ux-design/memory-book.png)

The Memory Book displays completed experiences with photos. It shows the activity name and date at the top, with a grid of photo placeholders below where users can view memories from completed bucket list items. A search bar at the top allows users to find specific memories.
