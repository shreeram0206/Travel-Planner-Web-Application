# Travel-Planner-WebApplication

## Environment Variables

* Running the project in development mode requires the below environment variables.
* Environment variables can also be set using `.env`

```
NODE_ENV                # set to development
PORT                    # Port to run the application on
MONGO_URI               # URI of mongodb
GOOGLE_CLIENT_ID        # Google CLIENT_ID setup for OAuth
GOOGLE_CLIENT_SECRET    # Google CLIENT_SECRET setup for OAuth
GOOGLE_PLACES_API_KEY   # Google API_KEY with Places API enables
AWSAccessKeyId          # AWS Access Key with access to AWS S3 service
AWSSecretKey            # AWS Secret Key with access to AWS S3 service
AWS_BUCKET              # Name of the bucket where media is stored
```


## Starting the Project

```bash
git clone https://github.com/shreeram0206/Travel-Planner-Web-Application.git
cd Travel-Planner-Web-Application
docker compose up -d
```

Connect to the container's terminal

```
docker exec -it node
```

From within the container run the below command to start the node server

```
npm run dev
```

`npm run dev` will start the project in development mode using nodemon


## Members

* Aditya Anulekh Mantri - adityaan@usc.edu
* Shreeram Narayanan - shreeram@usc.edu
* Shoumik Nandi - shoumikn@usc.edu