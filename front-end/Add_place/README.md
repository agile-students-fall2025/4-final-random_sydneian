# Add Place - Front-End Implementation

This is the Add Place feature of the Rendezvous social planning app, built with React.js following the design specifications from the wireframes.

## Features

- **Clean, Contemporary Design**: Black and white minimalist UI matching the wireframe specifications
- **Three Complete Screens**: 
  - Main "Add Place" screen with option selection
  - "Import From Link" screen for pasting TikTok/Instagram links
  - "Add Manually" screen for manual entry
- **Recent Additions Display**: Shows previously added places as a reference
- **Preview Section**: Displays imported place details with highlights
- **Form Handling**: Full form with place name, location, category, description, tags, and photo upload
- **Bottom Navigation**: Navigate between List, Decide, and Memories views
- **Navigation**: Seamless navigation between all three screens

## Technical Stack

- **React.js 18.2.0**: Functional components with JSX
- **Tailwind CSS 3.3.0**: For styling (following requirements)
- **Mock Data**: All data is mocked using a separate data layer, not hard-coded

## Requirements Compliance

This implementation follows all requirements from `instructions-1-front-end.md`:

- ✅ Uses React.js with functional components
- ✅ All content written in JSX
- ✅ Clean, contemporary design (not wireframe-style)
- ✅ Uses Tailwind CSS for styling
- ✅ Data is mocked, not hard-coded
- ✅ No Redux, Material UI, Bootstrap, or Next.js
- ✅ No hard-coded data (uses mock data service)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the Add_place directory:
   ```bash
   cd front-end/Add_place
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Project Structure

```
Add_place/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddPlace.js               # Main add place component
│   │   ├── AddPlaceThroughLink.js    # Import from link screen
│   │   └── AddPlaceManually.js       # Manual entry screen
│   ├── data/
│   │   └── mockData.js               # Mock data service
│   ├── App.js                        # Root component
│   ├── index.js                      # Entry point
│   └── index.css                     # Global styles with Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Mock Data

The application uses mock data from `src/data/mockData.js`. This follows the requirement to not hard-code data in components. The mock data includes:

- Recent additions with titles and contributors

When the back-end is integrated, replace the mock data calls with actual API calls.

## Component Details

### AddPlace Component

The main component features:

1. **Header**: Back button with square outline and "Add Place" title
2. **Adding Options**: Two buttons that provide different methods for adding places:
   - **Paste Link**: Black button with white text for pasting URLs
   - **Add Manually**: White button with black border for manual entry
3. **Recent Additions**: Displays a list of recently added places with bullet points showing the title and who added it
4. **Navigation State**: Manages view switching between main screen, link import, and manual entry
5. **Bottom Navigation**: Standard navigation bar with List (active), Decide, and Memories options

### AddPlaceThroughLink Component

Features for importing from social media links:

1. **Header**: Back button and "Import From Link" title
2. **Link Input**: Text field for pasting TikTok or Instagram links
3. **Import Button**: Black button to trigger import details
4. **Preview Section**: 
   - Large gray placeholder for photo
   - Place name (Moonlight Cafe)
   - Location (Brooklyn, NY)
5. **Highlights Section**: Bulleted list of key features
6. **Tags Input**: Optional tags field with placeholder
7. **Action Button**: "Add to Bucket List" button
8. **Bottom Navigation**: Standard navigation bar

### AddPlaceManually Component

Full form for manual entry:

1. **Header**: Back button and "Add Manually" title
2. **Form Fields**:
   - Place name input
   - Location input
   - Category dropdown (with chevron icon)
   - Description textarea (multi-line)
   - Tags input with placeholder
3. **Photo Upload**: Large dashed border area with plus icon and "Add Photos" text
4. **Action Button**: "Add to your Bucket List!" button
5. **Bottom Navigation**: Standard navigation bar
6. **Form State**: Manages all form inputs with React state

## Customization

### Modifying Styles

Styles are managed through Tailwind CSS. To customize:

1. Edit `tailwind.config.js` to add custom colors, fonts, etc.
2. Modify component classes directly in the JSX files
3. Add custom CSS in `src/index.css` if needed

### Adding New Features

1. Create new components in `src/components/`
2. Import and use them in `AddPlace.js` or other parent components
3. Follow the existing patterns for state management and styling

## Contributing

This project follows the Feature Branch git workflow. All changes should be made in feature branches and merged via pull requests.

## Notes

- Navigation between all three screens is fully functional
- Recent additions are displayed as bullet points with contributor information
- Preview data is mocked and shows Moonlight Cafe as an example
- Form inputs in the manual entry screen are fully interactive
- Bottom navigation includes placeholder icons matching the wireframe design
- The layout is responsive and follows mobile-first design principles
- All screens use consistent black and white styling throughout

