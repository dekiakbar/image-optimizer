# Image Optimizer Backend

<p align="center">
    <a href="https://github.com/dekiakbar/image-optimizer/actions/workflows/build.yml">
        <img src="https://github.com/dekiakbar/image-optimizer/actions/workflows/build.yml/badge.svg" alt="Build">
    </a>
    <a href="https://github.com/dekiakbar/image-optimizer/actions/workflows/deploy.yml">
        <img src="https://github.com/dekiakbar/image-optimizer/actions/workflows/deploy.yml/badge.svg" alt="Deploy">
    </a>
    <a href="https://github.com/dekiakbar/image-optimizer/actions/workflows/lint.yml">
        <img src="https://github.com/dekiakbar/image-optimizer/actions/workflows/lint.yml/badge.svg" alt="Lint">
    </a>
    <a href="https://github.com/dekiakbar/image-optimizer/actions/workflows/test.yml">
        <img src="https://github.com/dekiakbar/image-optimizer/actions/workflows/test.yml/badge.svg?event=push" alt="Build">
    </a>
    <a href="https://codecov.io/gh/dekiakbar/image-optimizer" > 
        <img src="https://codecov.io/gh/dekiakbar/image-optimizer/branch/master/graph/badge.svg?token=E8PNY7GOVW"/> 
    </a>
<p>

---

## Table of Contents

- [Installation](#installation)
    - [Without docker](#without-docker)
    - [Docker](#docker)
- [Deployment](#deployment)
- [Environment Variable](#environment-variable)
- [Frontend](#frontend)
- [License](#license)

## Installation

### Backend (this repo)
- #### Without docker

    - ```bash
        # Clone this repository
        git clone https://github.com/dekiakbar/image-optimizer
        ```

    - ```bash
        # Navigate to project dir
        cd image-optimizer
        ```

    - ```bash
        # Install node modules and dependencies
        npm install
        ```
    
    - ```bash
        # Run app

        # development
        $ npm run start

        #  Watch mode
        $ npm run start:dev

        # production mode
        $ npm run start:prod
        ```

    - ```bash
        # access swager api
        http://localhost:<port>/api
        ```
    
- #### Docker
    - ```bash
        # Clone this repository
        git clone https://github.com/dekiakbar/image-optimizer
        ```

    - ```bash
        # Navigate to project dir
        cd image-optimizer
        ```
    
    - ```bash
        # Build image and start container
        docker-compose up -d
        ```

    - ```bash
        # access swagger api
        http://localhost:3000/api
        ```
    -  #### NOTE : if you wanna run npm command, please use this.
        ```bash
        docker-compose run --rm node npm install --legacy-peer-deps
        ```
## Deployment
- #### Docker
    - ```bash
        # Clone this repository
        git clone https://github.com/dekiakbar/image-optimizer
        ```

    - ```bash
        # Navigate to project dir
        cd image-optimizer
        ```
        
    - ```bash
        # Build image and start container
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ```
        
## Environment Variable

Copy `env.example` to `.env`

```bash
cp .env.example .env
```

Fill the required `env` variables: 
```bash
PORT=3000

# Storage type for save image
# valid :
# - S3
STORAGE_TYPE=S3

# if use S3 as storage
S3_BUCKET_NAME=
S3_REGION=global
S3_ENDPOINT=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# separated by space and please provide (dot) before list the extension
ALLOWED_FILE_TYPE=.jpeg .jpg .png
MAX_FILE_UPLOAD=5
# max upload size in KB
MAX_UPLOAD_SIZE=8192
```

## Frontend
You must install [image optimizer Frontend](https://github.com/dekiakbar/image-optimizer-fe).

## License
[MIT](https://github.com/dekiakbar/image-optimizer/blob/master/LICENSE)