# OurBit Energy Offers Scraper

This project, developed for OurBit, automates the scraping of energy offer data from [Compare Energy Victoria](https://compare.energy.vic.gov.au/) and stores it in a Supabase database. It features configuration management, automated scraping via scheduled jobs, and a frontend for data visualization.

## Project Overview

- **Repository:** [https://github.com/ourbit-au/ourbit.git](https://github.com/ourbit-au/ourbit.git)
- **Data Source:** [https://compare.energy.vic.gov.au/](https://compare.energy.vic.gov.au/)
- **Database:** Supabase
- **Frontend:** Next.js 14 with App Router, TypeScript, Shadcn, and Tailwind CSS
- **Template:** Created using the `with-supabase` example

## Features

- **Web Scraping:** Automates fetching energy offers data from Compare Energy Victoria using browser automation.
- **Supabase Integration:** Stores scraped data and configuration settings in a Supabase database.
- **Configuration Management:**
  - Administrators can define and manage scraping configurations using a built-in admin dashboard.
  - Configurations determine form selections for data fetching.
  - Currently set up with one configuration, but designed to support multiple.
- **Data Consistency:**
  - Handles non-unique IDs across configurations by associating each offer with a `configurationId`.
  - Allows for the same offer ID to have different prices under different configurations.
- **Scheduled Job:** Runs the scraper daily via a cron job to ensure updated data.
- **Manual Trigger:** Includes a route to manually run the scraper with a button in the admin dashboard.

## Technologies Used

- **Frontend:**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - Shadcn for UI components
  - Tailwind CSS for styling
- **Backend:** Integrates with Supabase for database management and storage.
- **Data Handling:** Utilizes TypeScript for structured data management.

## Usage

### Configuration Setup

1. **Access the Admin Dashboard:** Navigate to the admin section of the application.
2. **Use the Configuration Builder:** Define selectors and form settings for scraping energy offers.
3. **Save Configurations:** Store settings in Supabase for use during scraping.

### Running the Scraper

1. **Automated Schedule:** The scraper runs automatically once per day via a cron job.
2. **Manual Trigger:** Use the button in the admin dashboard to manually initiate scraping.

### Data Visualization

- **Data Table:** View and interact with scraped data using the integrated data table in the frontend.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ourbit-au/ourbit.git
   cd ourbit
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Ensure Supabase credentials are configured in a `.env` file.

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to http://localhost:3000.
