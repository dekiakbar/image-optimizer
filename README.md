# Image Optimizer Backend

Image Optimizer Backend is a application for [image optimizer frontend](https://github.com/dekiakbar/image-optimizer-fe). Build by [Nest Js](https://nestjs.com/)

## Installation

this project created use the following tool
> node version : v16.6.1

> npm version : 7.20.5

### Backend (this repo)

Clone this repository

```bash
git clone https://github.com/dekiakbar/image-optimizer
```

Navigate to project dir

```bash
cd image-optimizer
```

Install node modules and dependencies

```bash
npm install
```

### Frontend Clone this repository

You must install [image optimizer Frontend](https://github.com/dekiakbar/image-optimizer-fe).

## Environment Variable

Copy `env.example` to `.env`

```bash
cp .env.example .env
```

Fill the required `env` variables: 
> note: get Imagekit key from [Imagekit.io](https://imagekit.io/)
```bash
PORT=3000

IMAGEKIT_PUBLIC_KEY=<YOUR_IMAGEKIT_PUBLIC_KEY>
IMAGEKIT_PRIVATE_KEY=<YOUR_IMAGEKIT_PRIVATE_KEY>
URL_ENDPOINT=<YOUR_IMAGEKIT_ENDPOINT>

# separated by space and please provide (dot) before list the extension
ALLOWED_FILE_TYPE=.jpeg .jpg .png
MAX_FILE_UPLOAD=5
# max upload size in KB
MAX_UPLOAD_SIZE=8192
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License
[MIT](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)