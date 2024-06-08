// Import the Model type from Mongoose
import { Model } from 'mongoose'

// Define an interface for the data structure of each month's data
interface MonthData {
  month: string // The month in a string format
  count: number // The count of documents created in that month
}

// Define an asynchronous function that generates data for the last 12 months
export async function generateLast12MonthsData<T extends Document> (
  model: Model<T> // The Mongoose model passed as an argument
): Promise<{ last12Months: MonthData[] }> {
  // Initialize an empty array to store the data for the last 12 months
  const last12Months: MonthData[] = []

  // Get the current date
  const currentDate = new Date()

  // Adjust the date to include the entire current day
  currentDate.setDate(currentDate.getDate() + 1)

  // Loop backwards through the last 12 months
  for (let i = 11; i >= 0; i--) {
    // Calculate the end date for the current month segment (28 days period)
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    )

    // Calculate the start date for the current month segment (28 days before the end date)
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - 28
    )

    // Format the end date to a readable string format
    const monthYear = endDate.toLocaleString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    // Count the number of documents created in the current month segment
    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate, // Greater than or equal to the start date
        $lt: endDate // Less than the end date
      }
    })

    // Add the month's data to the array
    last12Months.push({
      month: monthYear,
      count
    })
  }

  // Return the data for the last 12 months
  return { last12Months }
}

/*
Explanation:
Imports and Interface Definition:

The Model type from Mongoose is imported to ensure the function parameter is of the correct type.
The MonthData interface defines the structure of the data for each month, including the month as a string and the count of documents.
Function Definition:

The function generateLast12MonthsData is defined to accept a Mongoose model (model: Model<T>) and returns a promise that resolves to an object containing an array of MonthData.
Initialization:

An empty array last12Months is created to store the results.
currentDate is initialized to the current date, and then adjusted by adding one day to include the current day in the calculations.
Looping Through Months:

The loop runs backwards from 11 to 0, representing the last 12 months (each considered as a 28-day period).
For each iteration:
endDate is calculated as the current date minus i * 28 days.
startDate is calculated as 28 days before the endDate.
The endDate is formatted to a readable string monthYear.
The count of documents created between startDate and endDate is fetched using model.countDocuments.
The data for the current month segment is added to last12Months.
Return Statement:

The function returns an object containing the last12Months array.
Notes:
The function assumes that a month is a 28-day period, which may not align perfectly with calendar months.
The createdAt field in the Mongoose model is used to filter documents by creation date.
toLocaleString is used to format the date, which can be adjusted as needed to match desired date formats.
*/
