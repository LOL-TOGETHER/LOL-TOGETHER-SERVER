## LOL-TOGETHER-SERVER 

### ✨ LOL-TOGETHER 서비스는요! ✨

롤 유저들이 상대방의 정보를 찾아보고 팀원을 구할 수 있는 웹 서비스.

### 📌 LOL-TOGETHER 의 기능 📌

- 게시판에 게임을 같이 할 유저를 라인 별로 구할 수 있어요!
- 상대방의 롤 닉네임, 선호하는 라인, 선호하는 챔피언을 볼 수 있어요!
- 게시판에서는 댓글로 소통을 할 수 있어요!

### ⚡️ LOL-TOGETHER TECHNOLOGY ⚡️

- Language: Javascript
- Library: Node.js
- Database: MySQL

## Getting started

### 1. .env 환경 변수

```bash
DB_PASSWORD=[DB_PASSWORD]
TOKEN_SECRET=loltogether
```

### 2 . DB Setup

```bash

mysql 로그인

CREATE DATABASE loltogether;

use loltogether;

source sql/V1__init.sql
```

### 3. Build & Start

```bash
npm install (or yarn install)

npm start (or yarn start)
```
