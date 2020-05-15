# [Peer](https://www.withpeer.site)

* [Introduction](https://github.com/thms200/peer-server#Introduction)
* [Features](https://github.com/thms200/peer-server#Features)
* [Tech Stack](https://github.com/thms200/peer-server#Tech-Stack)
* [Install](https://github.com/thms200/peer-server#Install)
* [Deploy](https://github.com/thms200/peer-server#Deploy)
* [Project Process](https://github.com/thms200/peer-server#Project-Process)
* [Challenges](https://github.com/thms200/peer-server#challenges)
* [Things to Do](https://github.com/thms200/peer-server#things-to-do)


## Introduction
CDN을 통해 누구나 쉽게 화상/음성 고객 상담 기능을 연동 할 수 있는 웹서비스입니다.
![peer_final](https://user-images.githubusercontent.com/48754671/81384241-53576580-914c-11ea-91ae-7b2316ae8ffd.gif)
* [5/9(토) Demo 데이 시연영상](https://youtu.be/S04tb7sGJ7Q?t=1616)


## Features
* WebRTC, Socket을 이용한 실시간 화상/음성 기능 제공
* AudioContext를 이용해 고객과 상담사의 Stream을 Merge하여 새로운 Stream 구성
* MediaRecorder를 활용하여 상담과 동시에 음성 녹음 진행
* 녹음되는 음성(Blob)은 75sec 마다 분할하여 서버로 전송 (제한 없는 상담 시간 구현)
* Client에서 전달된 음성(Buffer)은 상담이 종료된 후 Server에서 최종 Merge되어 AWS S3 저장
* MongoDB Atlas를 이용한 상담 별 정보(고객, 상담 시간, 음성 URL) 누적 관리
* 상담 고객 별 필터링 UI 제공
* CDN 지원을 통해 손쉽게 Consulting Bot 설치
* Socket을 활용하여 상담을 원하는 고객 List 실시간 업데이트

## Tech Stack

### [Client](https://github.com/thms200/peer-client)
* ES2015+
* React
* Redux
* React Router
* Socket
* WebRTC
* Web Audio API
* styled-components
* Jest for unit-test
* Enzyme for component-test
* Cypress for E2E test<br>
![peer_E2E](https://user-images.githubusercontent.com/48754671/81775342-a738c480-9527-11ea-9a64-956c2df8eea6.gif)
* ESLint

### [Consultingbot](https://github.com/thms200/peer-bot)
* ES2015+
* TypeScript
* React
* Redux
* React Router
* Socket
* WebRTC
* Web Audio API
* ESLint

### [Server](https://github.com/thms200/peer-server)
* Node.js
* Express
* MongoDB / MongoDB Atlas
* Mongoose
* JSON Web Token Authentication
* AWS S3
* Socket
* WebRTC
* Chai / Mocha / Supertest for unit-test
* ESLint


## Install
### Client
* (선행 조건) 
  - [페이스북 개발자 계정](https://developers.facebook.com/?no_redirect=1)
``` 
// in env.js in root directory
REACT_APP_FACEBOOK_ID=<YOUR FACEBOOK APP ID>
```
```
git clone https://github.com/thms200/peer-client.git
cd peer-client
npm install
npm start
```

### Server
* (선행 조건)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - [AWS S3](https://aws.amazon.com/ko/s3/)

``` 
// in env.js in root directory
ATLAS_URI=<YOUR MONGODB ATLAS CONNECT STRING>
SECRET_KEY=<YOUR JWT SECRET KEY>
PORT=<YOUR PORT NUMBER>
AWS_ACCESS_KEY=<YOUR AWS ACCESS KEY>
AWS_SECRET_ACCESS_KEY=<YOUR AWS SECRET ACCESS KEY>
```
```
git clone https://github.com/thms200/peer-server.git
cd peer-server
npm install
npm start
```

### Consulting bot
* peer의 Consulting bot을 이용하기 위해서는 아래의 예시 코드를 body tag에 작성하면 됩니다.<br>
  (별도의 홈페이지가 없을 경우, create-react-app을 통해 single page apllication을 생성하여<br>
index.html 파일의 body tag에 아래의 코드를 입력하세요.)

* 아래의 코드는 예시입니다.<br>
  peer 홈페이지에서 가입/로그인하면 Install Page에서 자신에게 Custom 된 코드를 확인 할 수 있습니다.<br>
  (Login한 User에 따라 consultant-id, consultant-name 변경)

* 카메라/음성 연결을 위해 https 연결이 필요합니다.
```
<div class="consultant-id" id="5ea1c1f4e4bf16071b0640e9"></div>
<div class="consultant-name" id="MinSun Cho"></div>
<script src="https://cdn.jsdelivr.net/gh/thms200/peer-bot/dist/peer_0.8.js"></script> 
```


## Deploy

### Client
* Netlify를 이용한 Client 배포
   - https://www.withpeer.site

### Server
* AWS Elastic Beanstalk을 이용한 Server 배포
* Circle Ci를 통한 배포 자동화 구현


## Project Process
* 기술 Stack 검토
* [balsamiq을 이용한 Wireframe 작업](https://balsamiq.cloud/skzze0r/piubt71/r6A79)
* [Database Schema 설계](https://www.lucidchart.com/documents/edit/d3a61bf7-e444-46a7-8ef9-db93cb00d6a1/0_0?shared=true)
* [Notion Todo를 이용한 Task Managemnet](https://www.notion.so/0e0b72e1660d4d449eea7d4d2c4e2c95?v=9b456fa4bf2c4f0e96eaa5958957a7ad)
* Git을 이용한 Version관리 (Client/Server 분리, Branch 분리)


## Challenges
* [실시간 화상/음성 상담 내역을 별도의 음성 파일로 저장하는 것이 쉽지 않았습니다.](https://www.notion.so/Frontend-DB-8ceb10bebb0f4f189f37d2b5db6f859f)

  1차 프로젝트 배포 시 Issue로 겪었던 413 error(request entity too large)를 사전에 대응하기 위해<br>
  상담과 동시에 녹음된 음성 파일을 분리해서 저장해야겠다는 생각이 들었습니다.<br>
  이를 위해 단계적으로 계획하여 실행하였습니다.

   ① MediaRecorder를 이용하여 생성한 음성 파일 그대로 서버로 전송하여 저장되는지 확인<br>
  (생성된 음성을 나누었다고 가정했을 때),<br>
   ②-1. 나뉜 그대로 AWS S3 저장한 뒤 향후 Client에서 Merge하여 재생<br>
   ②-2. 나뉘어 전송된 음성을 Server에서 Merge하여 AWS S3에 저장하고, Client는 저장된 음성 파일 그대로 재생

  최종적으로 구현한 방법은<br>
  음성 녹음을 시작하는 MediaRecorder의 start Method에 파라미터인 timeslice 값을 기준으로 음성(Blob)이 나뉘고,<br>
  나뉠 때마다 Server로 전송되어 Buffer.concat으로 Merge하여 AWS S3에 저장합니다.


## Things to Do
* 현재는 one Brand - one 상담사로 기획 되어있는데, one Brand - 多 상담사 설정이 가능하도록 수정하고 싶습니다.
* 화상모드로 상담을 진행 할 경우, 음성이 아닌 영상 파일로 상담 기록을 저장하도록 구현하고 싶습니다.
