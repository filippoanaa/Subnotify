# 🔔 SubNotify: Your Smart Subscription Manager

SubNotify is an intuitive application designed to help users manage their recurring service subscriptions efficiently. By  tracking next payment dates and providing reminders, it ensures that you never miss a payment.

## ✨ Key Features

* **User Authentication & Authorization:** Secure user login and account creation.
* **Subscription Management:** Users can view, add, update, and delete their active subscriptions.
* **Real-Time Cost Tracking:** The platform provides a financial view by calculating and displaying total payments due this week, this month, and this year, based on actual next due dates.
* **Email Notifications:** Users receive scheduled email reminders for any subscriptions that are due soon (within 3 days).
* **On-Login Alerts:** Timely  notifications are displayed upon login for any payments due immediately.
* **Profile Management:** Password update and delete the profile.

---

## 🛠️ Technologies Stack

### Backend (RESTful API)

| Category | Technology =
| :--- | :--- 
| **Framework** | **Spring Boot** 
| **Security** | **Spring Security**, **JWT**
| **Data** | **PostgreSQL**, **JPA/Hibernate**
| **Utility** | **JavaMailSender (SMTP)** 

### Frontend (User Interface)

| Category | Technology
| :--- | :--- 
| **Library** | **React** 
| **Styling** | **React Bootstrap**, **CSS** 
| **Requests** | **Axios**

---

## 🚀 Setup and Installation (Local)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/filippoanaa/Subnotify.git
    ```

2.  **Backend Setup (Java/Spring Boot):**
    * **Dependencies:** Ensure you have Java 17+ and Gradle installed.
    * **Database:** Start a PostgreSQL instance.
    * **Configuration:** Create a `.env` file (or set environment variables) based on `src/main/resources/application.properties` and your Gmail SMTP credentials:
        ```env
        # Database Credentials
        DB_URL=jdbc:postgresql://localhost:5432/subnotify_db
        DB_USERNAME=user
        DB_PASSWORD=password
        
        # Security
        SECRET_KEY=YourStrongSecretKeyForJWT
        
        # Email Service (Use a 16-character App Password from Google)
        GMAIL_USERNAME=your_gmail_address@gmail.com
        GMAIL_PASSWORD=your_16_char_app_password
        ```
    * **Run:** Execute the Spring Boot application (e.g., via IntelliJ or `./gradlew bootRun`).

3.  **Frontend Setup (React):**
    * Navigate to the `frontend/` directory.
    * Install dependencies: `npm install` or `yarn install`.
    * Run the application: `npm start` or `yarn start`.

The application will be accessible at `http://localhost:3000`.
