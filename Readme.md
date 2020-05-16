# [Peer](https://www.withpeer.site)

* [Introduction](https://github.com/thms200/peer-server#Introduction)
* [Features](https://github.com/thms200/peer-server#Features)
* [Tech Stack](https://github.com/thms200/peer-server#Tech-Stack)
* [Install](https://github.com/thms200/peer-server#Install)
* [Consulting Bot Use (for CDN)](https://github.com/thms200/peer-server#Consulting-Bot-Use-for-CDN)
* [Deploy](https://github.com/thms200/peer-server#Deploy)
* [Project Process](https://github.com/thms200/peer-server#Project-Process)
* [Challenges](https://github.com/thms200/peer-server#challenges)
* [Things to Do](https://github.com/thms200/peer-server#things-to-do)


## Introduction
CDN을 통해 누구나 쉽게 화상/음성 고객 상담 기능을 연동 할 수 있는 웹서비스입니다.

* [5/9(토) Demo 데이 시연영상](https://youtu.be/S04tb7sGJ7Q?t=1616) (Youtube 링크)
![peer final](https://user-images.githubusercontent.com/48754671/82114827-fc7c0c80-9799-11ea-8ed5-baa1248ee91e.gif)


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

### [Consultingbot](https://github.com/thms200/peer-bot) (for CDN)
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
Local 환경에서 실행하기 위해서는 몇 가지 사전 준비가 필요합니다.
* [페이스북 개발자 계정](https://developers.facebook.com/?no_redirect=1)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [AWS S3](https://aws.amazon.com/ko/s3/)

### Client
Root 디렉토리에 ```.env``` 파일을 생성하고,<br>
사전에 준비한 Facebooke App ID를 입력합니다.
``` 
// in env.js in Root directory
REACT_APP_FACEBOOK_ID=<YOUR FACEBOOK APP ID>
```
```
git clone https://github.com/thms200/peer-client.git
cd peer-client
npm install
npm start
```

### Server
Root 디렉토리에 ```.env``` 파일을 생성하고,<br>
사전에 준비한 MongoDB Atlas Connection String, AWS Access Key, AWS Secret Access key를 입력합니다.<br>
또 JWT의 Secret Key와 Port Number를 입력합니다.

``` 
// in env.js in Root directory
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


## Consulting Bot Use (for CDN)
* Install 단계를 진행하거나, 배포된 [peer](https://www.withpeer.site)에 접속하여 facebook 계정으로 가입/로그인을 합니다.
* 로그인한 peer 홈페이지의 ```install page```에서 Consulting bot에 대한 Custom된 코드를<br>
  자신이 운영하는 홈페이지의 body Tag에 작성하면 됩니다.<br>
  (Login한 User에 따라 consultant-id, consultant-name 변경)

* 운영 중인 별도의 홈페이지가 없을 경우, create-react-app을 통해 Single Page Apllication을 생성하여<br>
index.html 파일의 body Tag에 Custome된 자신의 코드를 입력하세요.

* 아래의 코드는 Custome된 코드의 예시입니다.<br>

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
* [Database Schema 설계](https://www.notion.so/Backend-DB-d75fb2f9058e4145804e791399202ead#a5f040f7520548f0a449943cce08decf)
* [Notion Todo를 이용한 Task Managemnet](https://www.notion.so/0e0b72e1660d4d449eea7d4d2c4e2c95?v=9b456fa4bf2c4f0e96eaa5958957a7ad)
* Git을 이용한 Version관리 (Client/Server 분리, Branch 분리)


## Challenges
* 실시간 화상/음성 상담 내역을 별도의 음성 파일로 저장하는 것이 쉽지 않았습니다.
  ([Issue 관리(Notion)](https://www.notion.so/Frontend-DB-8ceb10bebb0f4f189f37d2b5db6f859f))

  1차 프로젝트 배포 시 Issue로 겪었던 413 error(request entity too large)를 사전에 대응하기 위해<br>
  상담과 동시에 녹음된 음성 파일을 분리해서 저장하고 싶었습니다.

  먼저 생성한 음성 파일 그대로 Server로 전송하고 AWS S3에 저장되는지 확인하였습니다.

  그 다음 음성 녹음을 시작하는 MediaRecorder의 start Method에 파라미터인 timeslice 값을 입력하여,<br>
  입력된 값을 기준으로(현재 75sec) 만들어진 음성 조각(Blob)을 Server로 전송하였습니다.<br>
  Server로 전송된 음성 조각(Buffer)을 상담이 종료되기 전까지 Buffer.concat으로 누적하여 Merge하다가<br>
  상담이 종료되면 AWS S3로 저장하였습니다.
  
  Server로 전송된 음성 조각 그대로 AWS S3에 저장한 뒤 Client에서 저장된 순서대로 재생을 하는 방법도 있었지만,<br>
  음성 조각이 저장되지 않고 누락되거나, 저장된 순서대로 재생이 되지 않는 등 Issue가 예상되어<br>
  상위에 정리한 방법으로 적용하였습니다.

* 서버를 배포한 뒤 Local환경에서는 발생하지 않았던 여러 가지 Issue가 있었습니다. ([Issue 관리(Notion)](https://www.notion.so/Backend-Circle-CI-176d5d0984c54c39975566132ffd27a3))

  그 중 Main Issue는 상담사만의 음성만 저장되는 것이었습니다.<br>
  왜냐하면 Client의 Consulting Page에서 상담사의 Stream으로만 MediaRecorder를 적용하였기 때문입니다.<br>
  Local 환경에서는 작업중이던 하나의 노트북으로 녹음 Test하였기 때문에 사전에 파악하지 못하였습니다.<br>

  Web Audio API인 AudioContext를 이용해 상담사의 Stream과 고객의 Stream을 Merge하여 새로운 MediaStream을 만들고<br>
  MediaRecorder를 적용하여 고객과 상담사의 음성 모두가 담긴 음성 파일을 저장할 수 있었습니다.


## Things to Do
*  하나의 Brand는 한명의 상담사만 운영되는 것으로 구현 되어 있는데,<br>
  하나의 Brand에서 여러 명의 상담사를 운영할 수 있도록 기능을 추가하고 싶습니다.
* 화상모드로 상담을 진행 할 경우, 음성이 아닌 영상 파일로 상담 기록을 저장하도록 구현하고 싶습니다.
