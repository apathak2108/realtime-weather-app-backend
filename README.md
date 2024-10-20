
# Weather Tracking Backend

This is the backend for a weather tracking system built using Node.js and MongoDB. The application fetches weather data from the OpenWeatherMap API, stores it in a MongoDB database, and provides a RESTful API for retrieving weather data based on city or geographical coordinates.

## Features

- **Weather Data Fetching**: 
  - Fetches weather data from the OpenWeatherMap API based on city name or geographical coordinates (latitude and longitude).
  
- **Database Integration**: 
  - Stores weather data in a MongoDB database for persistence and future access.
  
- **Alerting System**: 
  - Implements an alerting system that sends email notifications when temperature thresholds are exceeded.
  
- **Scheduled Tasks**: 
  - Uses cron jobs to periodically check for alerts and update weather data.
  
- **RESTful API**: 
  - Provides endpoints for fetching weather data, checking alerts, and managing weather records.

## API Endpoints

### 1. Get Weather Data

- **Endpoint**: `GET /api/weather`
- **Query Parameters**:
  - `city`: Name of the city (e.g., `?city=London`)
  - `lat`: Latitude (e.g., `?lat=51.5074`)
  - `lon`: Longitude (e.g., `?lon=-0.1278`)
  
- **Response**: Returns the weather data in JSON format.

### 2. Check Alerts

- **Endpoint**: `GET /api/check-alerts/:city`
- **Description**: Checks if there are any alerts triggered for the specified city based on temperature thresholds.

### 3. Additional Functionality

- **Scheduled Task**: Checks for alerts every minute using cron jobs.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios
- OpenWeatherMap API
- Nodemailer (for sending emails)
- Cron (for scheduling tasks)

## Getting Started

To set up this project locally, follow the steps below:

### Prerequisites

- Node.js (v14.x or later)
- MongoDB
- An OpenWeatherMap API key

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/weather-tracking-backend.git
   cd weather-tracking-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root of the project and add the following variables:
     ```
     MONGODB_URI=<your_mongodb_connection_string>
     OPENWEATHERMAP_API_KEY=<your_openweathermap_api_key>
     EMAIL_SERVICE=<your_email_service> (e.g., Gmail)
     EMAIL_USER=<your_email_address>
     EMAIL_PASS=<your_email_password>
     ```

4. **Run the Application**:
   ```bash
   npm start
   ```
   - The server will start on `http://localhost:5000`.

5. **Test the API**:
   - You can test the API using Postman or any other API testing tool. 

### Running Scheduled Tasks

- The application includes cron jobs that run every minute to check for alerts and update weather data automatically.

## Usage

- Use the `/api/weather` endpoint to fetch weather data by city name or geographical coordinates.
- Check alerts using the `/api/check-alerts/:city` endpoint.

## Deployment

To deploy the backend, consider using platforms like Vercel or Heroku. Follow the platform-specific instructions for deployment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.
