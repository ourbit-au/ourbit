# Distributor Mapping Function

This function generates a JSON mapping of postcodes to distributors, which is used in the configuration dashboard of the main application.

## Purpose

The distributor mapping function allows for easy updates to the postcode-distributor relationships without modifying the main application code. This may never be used, but will be particularly useful if there is ever a change in the distributor structure, such as when:

- A new energy distributor takes over in certain areas
- There are changes to the distribution zones
- The Postcode Climate Zone Distribution data is updated

## Function Overview

The function reads a CSV file containing the Postcode Climate Zone Distribution data and generates a JSON file. This JSON file serves as a lookup table in the main application's configuration dashboard, allowing users to select the appropriate distributor based on the postcode.

## Usage

You only need to run this function when there are updates to the distributor information. Here's how to use it:

1. **Prepare the CSV File:**

   - Obtain the updated Postcode Climate Zone Distribution XLSX file.
   - Convert the XLSX file to CSV format - this can be done using Excel or an online converter.
   - Ensure the CSV file has the correct format according to the file in `/data/PostcodeClimateZoneDistribution.csv`.
   - Place this file in the root directory of the project, there is already a file here so you know where to put it and overwrite the existing file.

2. **Run the Function:**

   - Open a terminal in the project root directory.
   - Run the following command:
     ```bash
     node generateDistributionMap
     ```

3. **Verify the Output:**

   - After running the function, a new JSON file will be generated in `data/distributorMap.json`.
   - This file will be automatically placed in the correct location for the main application to use.

4. **Update the Main Application:**
   - Push the updates to the main application repository for the configuration builder to use the new distributor mapping.

## File Locations

- **Input CSV:** `./PostcodeClimateZoneDistribution.csv`
- **Output JSON:** `/data/distributorMap.json`

## Troubleshooting

- If you encounter any errors while running the function, ensure that:
  - The CSV file is in the correct location and has the expected format as per the existing file.
  - You have the necessary permissions to read from and write to the relevant directories (try running the command with `sudo` if needed) or if on Windows, run the terminal as an administrator.

## Notes

- Running this function does not affect any existing data in the database.
- The main application is designed to read from the generated JSON file, so no code changes are needed in the main app after updating the distributor mapping.
- You can always revert this function by running it again with the original/previous version CSV file which can be accessed in the repository history.
