# Image Optimizer Backend

Image Optimizer Backend is a application for [image optimizer frontend](https://github.com/dekiakbar/image-optimizer-fe). Build with [Nest Js](https://nestjs.com/)

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
        http://localhost:3000
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
        # access swager api
        http://localhost:3000
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

## Frontend Clone this repository
You must install [image optimizer Frontend](https://github.com/dekiakbar/image-optimizer-fe).

## License
[MIT](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)