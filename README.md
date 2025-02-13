# Employee Management System - Frontend

A React-based frontend for the Employee Management System with a modern UI and smooth animations.

## Features

- User Authentication (Login/Logout)
- Employee Dashboard
- Animated Add/Delete/Edit Buttons
- Responsive Design
- Real-time Data Updates
- Form Validations

## Tech Stack

- React.js
- React Router DOM
- Styled Components
- CSS Modules

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Backend API running (or using deployed version)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd client
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

The app will run on http://localhost:3000

## Environment Variables

The app uses the following environment variable:

```env
REACT_APP_API_URL=https://employeemanagement-server-p9xc.onrender.com
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   ├── Login/
│   ├── AddEmployee/
│   ├── EditEmployee/
│   └── EditButton/
├── assets/
├── config.js
└── App.js
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from create-react-app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License
