# L'Oréal Transformation Office Dashboard

A React application that replicates the L'Oréal Transformation Office dashboard screens with exact UI/UX matching the provided designs.

## Features

- **Value Drivers Dashboard**: Portfolio value overview with project breakdown
- **Project Phase Dashboard**: Active portfolio summary by project phases with flow visualization
- **Domain Dashboard**: Circular domain visualization showing project distribution
- **Scoring Matrix**: Impact vs Effort matrix with project ranking
- **P&L View**: Financial deep-dive with interactive charts and tables

## Technology Stack

- **React 18** - Frontend framework
- **React Router** - Navigation between dashboard screens
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Chart library for data visualization

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transformation-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
transformation-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation header
│   │   └── Sidebar.js         # Metrics sidebar
│   ├── pages/
│   │   ├── ValueDrivers.js    # Value Drivers dashboard
│   │   ├── ProjectPhase.js    # Project Phase dashboard
│   │   ├── Domain.js          # Domain dashboard
│   │   ├── ScoringMatrix.js   # Scoring Matrix dashboard
│   │   └── PLView.js          # P&L View dashboard
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## Customization

### Colors

The application uses L'Oréal brand colors defined in `tailwind.config.js`:

- `loreal-purple`: #8B1A3D (Primary brand color)
- `loreal-gold`: #D4AF37 (Accent color)
- `loreal-beige`: #F5F2ED (Background color)
- `loreal-green`: #22C55E (Success color)
- `loreal-red`: #EF4444 (Error/warning color)
- `loreal-orange`: #F97316 (Warning color)

### Components

- **Header**: Contains navigation tabs and user profile
- **Sidebar**: Displays key metrics and budget drift indicators
- **Dashboard Pages**: Each screen is a separate component with its own layout and data visualization

## Data

Currently, the application uses mock data that matches the structure shown in the provided designs. To connect to real data:

1. Replace the mock data arrays in each dashboard component
2. Add API calls to fetch real-time data
3. Implement loading states and error handling

## Build

To create a production build:

```bash
npm run build
```

This will create an optimized build in the `build` folder.

## License

This project is proprietary to L'Oréal Transformation Office.
