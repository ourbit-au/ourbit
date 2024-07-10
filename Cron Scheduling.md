# Cron Guide for Vercel Functions

## Table of Contents
1. [Basic Format](#basic-format)
2. [Examples](#examples)
3. [Tips](#tips)
4. [Vercel-Specific Considerations](#vercel-specific-considerations)
5. [Deploying and Monitoring](#deploying-and-monitoring)

## Basic Format

Cron expressions have five fields that represent minute, hour, day of month, month, and day of week. Here's the basic format:

```
cron(minute hour day-of-month month day-of-week)
```

- **minute**: 0-59
- **hour**: 0-23
- **day-of-month**: 1-31
- **month**: 1-12 (or names, e.g., JAN, FEB)
- **day-of-week**: 0-7 (0 or 7 is Sunday, or names, e.g., SUN, MON)

Use asterisks (*) as wildcards to represent "every" for a given field.

## Examples

### Daily at 5 PM
Runs every day at 5:00 PM UTC (adjust UTC time to your timezone):
```
cron(0 17 * * *)
```

### Every 6 Hours
Runs every 6 hours, starting at the 0th minute:
```
cron(0 */6 * * *)
```

### Weekly on Mondays at 9 AM
Runs every Monday at 9:00 AM UTC:
```
cron(0 9 * * 1)
```

### Twice a Day, at 10 AM and 10 PM
Runs at 10:00 AM and 10:00 PM UTC:
```
cron(0 10,22 * * *)
```

### Every Hour
Runs every hour, starting at the 0th minute:
```
cron(0 * * * *)
```

### Every Midnight (12 AM)
Runs every day at midnight (0:00 AM UTC):
```
cron(0 0 * * *)
```

### Every Sunday at Midnight
Runs every Sunday at midnight (0:00 AM UTC):
```
cron(0 0 * * 0)
```

## Tips

- **Timezone Considerations**: Cron expressions in Vercel are based on UTC time. Adjust the UTC time specified in your cron expression to match your local timezone if needed.
- **Multiple Schedules**: You can have multiple functions with different cron schedules in your project. Each function is independently scheduled based on its own cron expression.
- **Testing**: Use online cron expression testers to verify your schedules before deployment. - [Cron Expression Generator & Explainer](https://crontab.guru/), [Cron Expression Tester](https://crontab.cronhub.io/)
- **Vercel Guides**: Refer to the official Vercel documentation for more details on scheduled functions and cron jobs: [Vercel Functions](https://vercel.com/docs/functions), [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs), [Manage Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)

## Vercel Considerations

- **Free Plan Limitations**: As of 2024, Vercel's free plan allows up to 100 executions per day for scheduled functions.

## Deploying and Monitoring

1. Add the cron expression above your function as shown in the scraper api.
2. Deploy your application to Vercel.
3. Vercel will automatically configure the function to run according to the specified schedule.
4. Monitor the execution of your scheduled functions in the Vercel dashboard under the "Functions" section.