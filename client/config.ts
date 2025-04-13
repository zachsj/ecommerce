/* defines a TypeScript interface named Config, which ensures that any object following 
this structure must have a baseUrl property of type string. */
interface Config {
  baseUrl: string;
}
/* The function takes a server string as input and returns either:An object that follows the 
Config structure (Config type). An empty object {} if no match is found. */
const checkConfig = (server: string): Config | {} => {
  let config: Config | {} = {};
  /* The function uses a switch statement to check the server value: */
  switch (server) {
    case "production":
      config = {
        baseUrl: "https://ecommerce-iota-five-33.vercel.app",
      };
      break;
    case "local":
      config = {
        baseUrl: "http://localhost:8000",
      };
      break;
    default:
      break;
  }
  return config;
};
/* This variable sets the environment to "local", meaning the function will return the baseUrl for local development. */
export const selectServer = "production";  //change to local for local host
/* Get and Export the Config. Calls checkConfig(selectServer), which evaluates to: { baseUrl: "http://localhost:8000" }
The as Config type assertion tells TypeScript to treat the result as a Config object, even if it could technically return {} */
export const config = checkConfig(selectServer) as Config;