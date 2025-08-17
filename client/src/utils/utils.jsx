import { Component } from "react";

class Util extends Component {
  createCategories = (tableData, headings) => {
    //console.log(tableData,headings)
    let categories = {};
    let groupBy = headings.filter((header) => header.grouping);
    for (let header of groupBy) {
      let groupByKeyWord = header.field;
      categories[groupByKeyWord] = [];
      for (let item of tableData) {
        // Normalize potential React elements or complex values to strings
        const raw = item[groupByKeyWord];
        const normalized = (raw === null || raw === undefined)
          ? ""
          : (typeof raw === "string" || typeof raw === "number")
            ? String(raw)
            : (raw && raw.props && raw.props.children)
              ? String(raw.props.children)
              : String(raw);
        if (!categories[groupByKeyWord].includes(normalized)) {
          categories[groupByKeyWord].push(normalized);
        }
      }
    }
    return categories;
  };
  render() {
    return <h1></h1>;
  }
}
export default new Util();
