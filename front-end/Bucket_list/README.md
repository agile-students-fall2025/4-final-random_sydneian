# Bucket List - Front-End Implementation

This is the Bucket List feature of the Rendezvous social planning app, built with React.js following the design specifications from the wireframes.

## Features

- **Clean, Contemporary Design**: Black and white minimalist UI matching the wireframe specifications
- **To Do / Done Tabs**: Toggle between active and completed activities
- **Search Functionality**: Filter activities by title, type, or location
- **Activity Cards**: Display activities with all relevant information including:
  - Title and location
  - Added by and timestamp
  - Hashtags
  - Like count
- **Floating Action Button**: Add new activities
- **Bottom Navigation**: Navigate between List, Decide, and Memories views

## Technical Stack

- **React.js 18.2.0**: Functional components with JSX
- **Tailwind CSS 3.3.0**: For styling (following requirements)
- **React Context**: Available for state management (currently using local state)
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

1. Navigate to the Bucket_list directory:
   ```bash
   cd front-end/Bucket_list
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
Bucket_list/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BucketList.js      # Main bucket list component
│   │   └── ActivityCard.js    # Activity card component
│   ├── data/
│   │   └── mockData.js        # Mock data service
│   ├── App.js                 # Root component
│   ├── index.js               # Entry point
│   └── index.css              # Global styles with Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Mock Data

The application uses mock data from `src/data/mockData.js`. This follows the requirement to not hard-code data in components. The mock data includes:

- Activities with titles, types, locations
- Added by information and timestamps
- Hashtags for filtering
- Like counts

When the back-end is integrated, replace the mock data calls with actual API calls.

## Customization

### Modifying Styles

Styles are managed through Tailwind CSS. To customize:

1. Edit `tailwind.config.js` to add custom colors, fonts, etc.
2. Modify component classes directly in the JSX files
3. Add custom CSS in `src/index.css` if needed

### Adding New Features

1. Create new components in `src/components/`
2. Import and use them in `BucketList.js` or other parent components
3. Follow the existing patterns for state management and styling

## Contributing

This project follows the Feature Branch git workflow. All changes should be made in feature branches and merged via pull requests.

## Notes

- The search functionality filters activities in real-time as you type
- Tabs switch between "To Do" and "Done" views (Done view is currently empty)
- The floating action button is positioned for easy access
- Bottom navigation includes placeholder icons matching the wireframe design

