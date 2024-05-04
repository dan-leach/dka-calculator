import { config } from "./config.js";

function api(route, data) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(
        new Error(
          "Your request timed out. Please check your internet connection."
        )
      );
    }, config.api.timeoutDuration);
    let req = new XMLHttpRequest();
    req.open("POST", config.api.url);
    req.onload = function () {
      if (req.status == 200) {
        try {
          if (config.api.showConsole)
            console.log(route + "-->", JSON.parse(req.response));
          resolve(JSON.parse(req.response));
        } catch (e) {
          console.log(route + "-->", req.response);
          console.error("Error outputting API response as parsed object", e);
          reject(req.response);
        }
      } else {
        try {
          console.error("API error", JSON.parse(req.response));
          reject(JSON.parse(req.response));
        } catch (e) {
          console.error("API error", e, req);
          reject(
            "API error: status " +
              req.status +
              " (" +
              req.statusText +
              ") " +
              req.response
          );
        }
      }
    };
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("route=" + route + "&data=" + JSON.stringify(data));
    if (config.api.showConsole) console.log(data ? data : "", "-->" + route);
  });
}

export { api };
