#  realtime-chat-app
- backend       # Server-side code (Node.js + Express + MySQL)
   - server.js  # Main backend file
│   │── .env       # Environment variables (e.g., database, port)
│   │── package.json # Backend dependencies and scripts
│   └── /db        # Database initialization files
│       └── init.sql # SQL queries to initialize the database
│
└── /frontend      # Frontend code (React + Tailwind + Socket.io Client)
    │── /src
    │   │── App.js  # Main frontend component
    │   │── index.js # React entry point
    │   └── styles.css # Tailwind styles
    │── package.json # Frontend dependencies and scripts
    └── public
        └── index.html # HTML template for the React app
