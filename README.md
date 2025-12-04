## Product Vision Statement
**Rendezvous** empowers groups of friends to effortlessly plan social outings by transforming indecisive group chats into an organized, collaborative experience.  
Our vision is to make spontaneous hangouts exciting rather than stressful, by encouraging discovery of new places and creating lasting memories along the way.

## Core Team

| Name & GitHub | Role |
|:--------------|:-----|
| [Catalin Botezat](https://github.com/CatalinMoldova) | |
| [Deema Hazim](https://github.com/deema-hazim) | Product Owner |
| [Nada Beltagui](https://github.com/nadsb26) | |
| [Nursultan Sagyntay](https://github.com/kazakhpunk) | Scrum Master |
| [Zavier Shaikh](https://github.com/zs-5) | |

## Project Description

**Rendezvous** is a social planning app designed for university students and young adults who love going out with friends but struggle with the *“Where should we go?”* dilemma.  
Instead of relying on endless group chats and scattered social media saves, Rendezvous offers a shared, centralized bucket list where friends can add cafes, restaurants, and activities they find online. When a user finds a new spot they like, they can add it directly into the app. The app then uses AI extraction tools to automatically pull key info such as name, cost, type of activity, etc.

When it’s time to hang out, users can:
- **Filter activities** by location, budget, category, etc.  
- **Let the app decide** through fun features like a wheel spin or card draw  
- **Record memories** by marking outings as “done” and adding photos and captions

Rendezvous is built to make social planning smoother, quicker, and more fun by helping friend groups spend less time deciding and more time experiencing.

## Project History

The idea for **rendezvous** came from our own experiences as university students constantly trying to plan group outings. We noticed that group chats were full of “we should go here!” messages, but when the time came, no one could remember where or decide on a plan. This frustration inspired us to design a system that organizes shared ideas into a practical, fun tool for decision-making.  

## How to Contribute

More information on how to contribute can be found [here](https://github.com/agile-students-fall2025/4-final-random_sydneian/blob/master/CONTRIBUTING.md)!

## How to Build and Test

### Building the Project

To build the front-end and back-end:

**Front-End**
1. Navigate to the `front-end` directory:
    ```bash
    cd front-end
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

**Back-End**
1. Navigate to the `back-end` directory:
    ```bash
    cd back-end
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

### Running the App Locally

**Front-End**
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

**Back-End**
```bash
npm run dev
```
By default, the server will be running on [http://localhost:8000](http://localhost:8000).

### Running Tests

**Back-End**
```bash
npm test
```

Or with coverage report:
```bash
npm run test:coverage
```

### Notes
- Ensure you have Node.js and npm installed (see prerequisites above).
- Database setup and environment configuration are required for back-end tests.
- Back-end server runs on [http://localhost:8000](http://localhost:8000).

### Project Links

This repository will be used for team projects.

Several sets of instructions are included in this repository. They should each be treated as separate assignments with their own due dates and sets of requirements.

1. See the [App Map & Wireframes](instructions-0a-app-map-wireframes.md) and [Prototyping](./instructions-0b-prototyping.md) instructions for the requirements of the initial user experience design of the app.

1. Delete the contents of this file and replace with the contents of a proper README.md, as described in the [project setup instructions](./instructions-0c-project-setup.md)

1. See the [Sprint Planning instructions](instructions-0d-sprint-planning.md) for the requirements of Sprint Planning for each Sprint.

1. See the [Front-End Development instructions](./instructions-1-front-end.md) for the requirements of the initial Front-End Development.

1. See the [Back-End Development instructions](./instructions-2-back-end.md) for the requirements of the initial Back-End Development.

1. See the [Database Integration instructions](./instructions-3-database.md) for the requirements of integrating a database into the back-end.

1. See the [Deployment instructions](./instructions-4-deployment.md) for the requirements of deploying an app.

## How to Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Front-End
1. Navigate to the front-end directory:
   ```bash
   cd front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` (or the port shown in the terminal).

### Back-End
1. Navigate to the back-end directory:
   ```bash
   cd back-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the back-end directory with your environment variables (if needed).
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or to start without watch mode:
   ```bash
   npm start
   ```
   The backend will be available at `http://localhost:8000` (or the port shown in the terminal).
