//This file just controls how data is fetched by: Making a GET request to the specified endpoint. Ensuring the response is in JSON format before 
// returning it. And handling errors.  See line 42 fetchData and lower in Product.tsx for one place it's used.

/* getData, is an asynchronous function that fetches data from a given API endpoint. This function 
exports getData, making it available for import in other files.
It takes a single parameter, endpoint, which is a string representing the API URL.
Since it is an async function, it allows the use of await inside*/
export const getData = async (endpoint: string) => {

  /*fetch(endpoint, {...}): Uses the Fetch API to send a GET request to the provided endpoint.
  The request includes a header specifying that the response will be in JSON format.
  await fetch(...): The function pauses execution until the fetch request completes. */
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    /*The .ok property checks if the response status is successful (2xx HTTP codes).
    If it's not successful, an error is thrown, including the statusText for debugging. */
    if (!response.ok) {
      throw new Error("Data fetching Error" + response?.statusText);
    }
    /*If no errors occur, the response is converted to JSON format using .json().The parsed data is returned. */
    const data = await response.json();
    return data;
    /* If any error occurs during the fetch request (e.g., network issues, API errors), it is caught.
    It logs the error to the console.The function throws the error so the calling function knows something went wrong. */
  } catch (error) {
    console.log("Error while fetching data", error);
    throw error;
  }
};