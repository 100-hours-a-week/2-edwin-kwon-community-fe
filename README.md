# 2-edwin-kwon-community-fe

## 🛠️ Stack

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)


<br />

## Back-Side
[Front_Github](https://github.com/100-hours-a-week/2-edwin-kwon-community-be)

## 📝 Description

코코아에서 게시판 기능을 제공하는 서버입니다. Express.js와 MariaDB를 기반으로 구현되었으며, 사용자 인증, 게시글 관리, 댓글, 좋아요 등 다양한 기능을 제공합니다.

## 👨‍💻 Developer

<div align=center>

|                                                           Edwin.kwon (권기현)                                                          |
| :------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://github.com/ghyen"> <img src="https://avatars.githubusercontent.com/ghyen" width=100px alt="_"/></a> |

</div>

<br />

## ⚙️ Installation
Step-by-step instructions on how to install and set up the project. Include prerequisites or dependencies.
1. clone repo
```bash
git clone https://github.com/100-hours-a-week/2-edwin-kwon-community-fe.git
```

2. install dependencies
```bash
npm install
```

3. set env

make `.env` file and set env like:
```env
# Server 설정
PORT=3000
NODE_ENV=development
HOST=localhost

# 외부 서비스 URL
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
BACKEND_URL=http://localhost:8000
```

4. run server
```bash
npm start
```
## 👀 Usage
https://github.com/user-attachments/assets/ed1167e7-67cf-4491-9b3f-e59e17398d63


<br />

## 📁 Packages
```bash
.
├── README.md
├── eslint.config.js
├── index.js
├── package-lock.json
├── package.json
├── prettier.config.js
├── public
│   └── css
│       ├── common.css
│       ├── createPost.css
│       ├── editPassword.css
│       ├── editProfile.css
│       ├── header.css
│       ├── login.css
│       ├── post.css
│       ├── postList.css
│       └── signup.css
├── routes
│   └── pages.js
├── src
│   ├── createPost.js
│   ├── editPassword.js
│   ├── editPost.js
│   ├── editProfile.js
│   ├── env.js
│   ├── header.js
│   ├── login.js
│   ├── post.js
│   ├── postList.js
│   ├── signup.js
│   └── utils.js
└── views
    ├── createPost.html
    ├── editPassword.html
    ├── editPost.html
    ├── editProfile.html
    ├── login.html
    ├── post.html
    ├── postList.html
    └── signup.html
```
<br />

## 🌟 Main Features
- **User**
  - Sign up/Login/Logout
  - Profile image upload
  - Nickname update
  - Password change
  - Account deletion

- **Post**
  - Post CRUD operations
  - Image upload
  - View count management

- **Comment**
  - Comment CRUD operations
  - Author information display

- **Like**
  - Post like/unlike
  - Like status check
