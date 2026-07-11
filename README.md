# 📚 Noteify
Noteify is a full-stack Notes Management System designed to help students easily access study materials. Administrators upload and manage notes, while students can browse, view, and download notes organized by course, semester, and subject.
🚀 Features
Student
Browse notes by course and semester
View notes by subject
Download PDF notes
Responsive and user-friendly interface
Admin
Secure login
Upload PDF notes
Organize notes by course, semester, and subject
Manage study materials



## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer (File Upload)
* bcrypt.js

## 📂 Project Structure

```text
Noteify/
│── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/24khushigupta/Noteify.git
cd Noteify
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

Open a new terminal.

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 📌 API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Notes

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/notes`         | Get all notes          |
| POST   | `/api/notes`         | Upload a new note      |
| GET    | `/uploads/:filename` | Download uploaded file |



## Future Enhancements

* Search Notes
* Filter by Subject
* Edit Notes
* Delete Notes
* Favorites/Bookmarks
* Recently viewed notes
* Dark Mode
* Cloud File Storage


## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository, create a new branch, and submit a pull request.

## 📄 License

This project is licensed under the MIT License.

## 👩‍💻 Author

**Khushi Gupta**

* MCA Student
* Full Stack Web Developer
* GitHub: https://github.com/24khushigupta
* vercel link:https://noteify-smoky-two.vercel.app/
