import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

function retrieve({ page = 1, colors = 0 }) {
  // if (page <= 0) return;
  console.log("page:", page, "colors:", colors);

  const uri = URI(window.path).query({ limit: 500, offset: 0 });
  if (colors) uri.addSearch("color[]", colors);

  // console.log(uri.readable());

  return fetch(uri, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(
      (resp) => resp.json(),
      () => {
        console.log("first");
      }
    )
    .then(
      (data) => {
        // data = JSON.parse(data);
        // console.log(data);
        const relevant = data.slice((page - 1) * 10, page * 10);
        const ids = relevant.reduce((acc, x) => acc.concat(x.id), []);
        let closedPrimaryCount = 0;
        const primaryColors = ["red", "blue", "yellow"];
        const open = relevant.reduce((acc, x) => {
          if (x.disposition === "open") {
            x.isPrimary = primaryColors.includes(x.color);
            return acc.concat(x);
          }
          if (primaryColors.includes(x.color)) closedPrimaryCount++;
          return acc;
        }, []);
        const previousPage =
          page >= Math.ceil(data.length / 10) + 1 || page <= 1
            ? null
            : page - 1;
        const nextPage = page >= Math.floor(data.length / 10) ? null : page + 1;
        const resp = { ids, open, closedPrimaryCount, previousPage, nextPage };
        console.log(resp);
        return resp;
      },
      (err) => {
        console.log("second", err);
        return null;
      }
    );

  // return prom;
}

export default retrieve;
