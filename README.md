# StaffSync
 StaffSync is a robust Employee Management System built on the MERN stack (MongoDB, Express.js, React.js, Node.js) designed to streamline employee management and enhance team collaboration. This application offers seamless employee tracking and management features, along with real-time communication capabilities.
# **Table of Contents**
```bash
1.Features
2.Tech Stack
3.Demo
4.Installation
5.Usage
6.Environment Variables
7.Folder Structure
8.Future Enhancements
9.Contributing
10.License
```
**#Features**
```bash
1.Real-time messaging with Socket.IO.
2.User authentication and authorization using JWT.
3.Persistent chat history with MongoDB.
4.Typing indicators and read receipts.
5.Responsive UI for mobile and desktop.
6.Online/offline user status updates.
7.Group and private chat functionality.
```
**#Tech Stack**
```bash
Frontend: React.js, Material-UI (or your preferred styling library, I have used Tailwind CSS)
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Real-Time Communication: Socket.IO
Authentication: JWT and bcrypt
```
# **ScreenShots**
![Login Page](https://github.com/user-attachments/assets/16379179-d084-46d1-9f77-9f329fa03706)
![ClientDashBoard](https://github.com/user-attachments/assets/d1cc594a-7ec6-43f7-9fe1-0c5769fb326b)
![EmployeeDashboard](https://github.com/user-attachments/assets/e6a0c307-8d0b-47f9-8cdf-ef6ee8a07605)

# **Installation**
```bash
# Step 1: Clone the Repository
git clone https://github.com/SaieshShetty/Chit-Chat__FullStack-ChatApp.git
cd Chit-Chat__FullStack-ChatApp

# Step 2: Install Dependencies

# Backend Dependencies
npm install

# Frontend Dependencies
cd Frontend
npm install
cd ..

# Step 3: Set Up Environment Variables
# Create a .env file in the root directory and add the following variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SOCKET_PORT=your_socket_port

# Step 4: Run the Application

# Start the Backend Server
npm run server

# Start the React Frontend
npm run client

# Run Both Servers Concurrently
npm run dev
```
# **Environment Variables**
Ensure the following environment variables are configured in your .env file:
```bash
MONGO_URI: MongoDB connection string.
JWT_SECRET: Secret key for signing JWT tokens.
SOCKET_PORT: Port for the WebSocket server.   
```

# **Folder Structure**
```bash
project-root/
├── Frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── Backend/           # Backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── index.js
├── .env              # Environment variables
├── package.json
└── README.md
```
# **Future Enhancements**
To Add AI Models for Employee Performance Analysis
