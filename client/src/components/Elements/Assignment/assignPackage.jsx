import adbs from "ad-bs-converter";
import { Component } from "react";
import BreadCrumbs from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import FormFields from "../../Widgets/Form/forms.jsx";
import { calendarFunctions } from "../../Widgets/jquery.nepaliDatePicker";
import { useParams } from 'react-router-dom';
// const { packageCode, personID } = useParams();
const breadCrumbItem = [
  {
    text: "Person Table",
    link: "/admin/intermediate",
  },
  {
    text: "Assign Package",
    link: "#",
  },
];
class AssignPackage extends Component {
  id = 0;
  options = [];

  // Helper to ensure options are always in correct format
  getValidOptions = () => {
    if (Array.isArray(this.options) && this.options.length > 0) {
      return this.options.filter(
        (opt) => opt && typeof opt.val !== 'undefined' && typeof opt.text !== 'undefined'
      );
    }
    return [];
  }

  state = {
    personID: "",
    personData: {},
    formData: {
      packageCode: {
        element: "input",
        value: "",
        label: true,
        labelText: "Package Code",
        config: {
          name: "packageCode_input",
          type: "text",
          placeholder: "Package Code",
          readOnly: true,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      name: {
        element: "input",
        value: "",
        label: true,
        labelText: "Name",
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter Name of Pakager Receiver",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      // address: {
      //   element: "input",
      //   value: "",
      //   label: true,
      //   labelText: "Address",
      //   config: {
      //     name: "address_input",
      //     type: "text",
      //     placeholder: "Enter Address of receiver",
      //   },
      //   validation: {
      //     required: false,
      //   },
      //   valid: true,
      //   touched: false,
      //   validationText: "",
      // },
      college: {
        element: "input",
        value: "",
        label: true,
        labelText: "College",
        config: {
          name: "college_input",
          type: "text",
          placeholder: "Enter Primary College of receiver",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      // courseCode: {
      //   element: "input",
      //   value: "",
      //   label: true,
      //   labelText: "Course Code",
      //   config: {
      //     name: "courseCode_input",
      //     type: "text",
      //     placeholder: "Eg. SH401",
      //   },
      //   validation: {
      //     required: false,
      //   },
      //   valid: true,
      //   touched: false,
      //   validationText: "",
      // },
      contact: {
        element: "input",
        value: "",
        label: true,
        labelText: "Contact",
        config: {
          name: "contact_input",
          type: "tel",
          placeholder: "Enter Contact Number",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      dateOfAssignment: {
        element: "date-picker-jq",
        value: "",
        label: true,
        labelText: "Date of Assignment",
        config: {
          name: "assignedDate_input",
          type: "date",
          placeholder: "Enter Date of Assignment",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      dateOfDeadline: {
        element: "date-picker-jq",
        value: "",
        label: true,
        labelText: "Date of Deadline",
        config: {
          name: "submissionDay_input",
          type: "date",
          placeholder: "Enter Deadline Day",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      
    },
  };

  updateForm = (newState) => {
    this.setState({
      formData: newState,
    });
  };

  increaseDynamicForm = (noOfPacket) => {
    noOfPacket = 1;
    //  newChild
    let newChild = {
      id: this.id,
      element: "inputselect",
      removeButton: true,
      value: "0",
      label: true,
      labelText: "Package",
      config: {
        name: "Package",
        options: this.getValidOptions(), // Always use the safe getter
      },
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
      validationText: "",
    };

    this.setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        packages: {
          ...prevState.formData.packages,
          childs: [...prevState.formData.packages.childs, newChild],
        },
      },
    }));
    this.id += 1;
  };

  decreaseDynamic = (targetIndex) => {
    this.setState((prevState) => ({
      ...prevState,
      formData: {
        ...prevState.formData,
        packages: {
          ...prevState.formData.packages,
          childs: prevState.formData.packages.childs.filter((value, index) => {
            return value.id !== targetIndex;
          }),
        },
      },
    }));
  };
  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    const nepaliDate = adbs.ad2bs(year + "/" + month + "/" + day).en;
    year = nepaliDate.year;
    month = nepaliDate.month;
    day = nepaliDate.day;

    if (nepaliDate.month.length < 2) month = "0" + nepaliDate.month;
    if (nepaliDate.day.length < 2) day = "0" + nepaliDate.day;

    return [year, month, day].join("/");
  }
  componentDidMount = () => {
    let currentLocation = window.location.href;
    let personID = currentLocation.substring(
      currentLocation.lastIndexOf("/") + 1
    );
    let params = { personID };

    // Get packageCode from URL params
    const url = window.location.pathname;
const parts = url.split("/");
let packageId = "";
if (parts.length >= 4) {
  packageId = parts[3];
}

// Fetch the packageCode using the packageId
fetch(`/API/query/getOnePackage/${packageId}`)
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      this.setState(prevState => ({
        ...prevState,
        formData: {
          ...prevState.formData,
          packageCode: {
            ...prevState.formData.packageCode,
            value: data[0].packageCode
          }
        }
      }));
    }
  });

// Continue with the rest of your logic...
Date.prototype.addDays = function (d) {
  return new Date(this.valueOf() + 864e5 * d);
};
    fetch(`/API/query/getOnePerson/${params.personID}`)
      .then((res) => res.json())
      .then((json) => {
        let { formData } = this.state;
        console.log(this.formatDate(new Date()));
        let assignmentDate = this.formatEnglishDateToNep(
          this.formatDate(new Date())
        );
        let date = new Date();
        let deadlineDate = this.formatEnglishDateToNep(
          this.formatDate(date.addDays(14))
        );
        console.log(assignmentDate);
        formData.name.value = json[0].fullName;
        formData.contact.value = json[0].contact;
        // formData.address.value = json[0].campus;
        formData.college.value = json[0].college;
        // formData.courseCode.value = json[0].courseCode.toString().replace(" ","");
        formData.dateOfAssignment.value = assignmentDate;
        formData.dateOfDeadline.value = deadlineDate;
        this.setState({
          formData: formData,
          isLoaded: true,
          personData: json,
          personID: params.personID,
        });
      });

    // Fetch data from API and store data in options
    fetch("/API/query/getNotAssignedPackages")
      .then((res) => res.json())
      .then((json) => {
        const newOptions = [];
        for (let pkg of json) {
          let temp = {};
          temp["val"] = pkg.id;
          temp["text"] = pkg.packageCode;
          newOptions.push(temp);
        }
        this.options = newOptions;
        // Force a re-render so that any new dynamic children get the updated options
        this.setState((prevState) => ({ ...prevState }));
      });
  };

  formatNepaliDateToEng = (nepaliDate) => {
    if (nepaliDate !== "") {
      const date = nepaliDate.split("/");
      const year = calendarFunctions.getNumberByNepaliNumber(date[0]);
      const month = calendarFunctions.getNumberByNepaliNumber(date[1]);
      const day = calendarFunctions.getNumberByNepaliNumber(date[2]);
      return [year, month, day].join("/");
    }
    return "";
  };

  formatEnglishDateToNep = (englishDate) => {
    if (englishDate !== "") {
      const date = englishDate.split("/");
      const year = calendarFunctions.getNepaliNumber(parseInt(date[0]));
      const month = calendarFunctions.getNepaliNumber(parseInt(date[1]));
      const day = calendarFunctions.getNepaliNumber(parseInt(date[2]));
      return [year, month, day].join("/");
    }
    return "";
  };

  submitForm = (event) => {
    event.preventDefault();
    let dataToSubmit = {};
    dataToSubmit["personID"] = this.state.personID;
    for (let key in this.state.formData) {
      if (key === "dateOfAssignment" || key === "dateOfDeadline") {
        dataToSubmit[key] = this.formatNepaliDateToEng(
          this.state.formData[key].value
        );
        if (dataToSubmit[key] === "") {
          console.log("Insert today");
          //Set the default value to today
          const today = new Date();
          const dd = today.getDate();
          const mm = today.getMonth() + 1; //Months are zero based
          const yyyy = today.getFullYear();
          const nepaliDate = adbs.ad2bs(yyyy + "/" + mm + "/" + dd).en;
          //Year month day format with  0 padded if mm or dd < 10
          dataToSubmit[key] =
            nepaliDate.year.toString() +
            "/" +
            ("0" + nepaliDate.month.toString()).slice(-2) +
            "/" +
            ("0" + nepaliDate.day.toString()).slice(-2);
        }
      } else if (key === "packages") {
        const childs = this.state.formData[key].childs;
        const packages = [];
        console.log(childs);
        for (let child in childs) {
          if (packages.includes(childs[child].value)) {
            alert("Select Different Packages");
            return;
          }
          packages.push(childs[child].value);
        }
        dataToSubmit[key] = packages;
        //No packages added
        if (packages.length === 0) {
          const state = this.state;
          state.formData["dateOfDeadline"].validationText =
            "Please add at least one package";
          state.formData["dateOfDeadline"].valid = false;
          this.setState(state);
          return;
        }
      } else {
        dataToSubmit[key] = this.state.formData[key].value;

        //Validation
        const state = this.state;

        if (
          dataToSubmit[key] === null ||
          dataToSubmit[key].match(/^ *$/) !== null ||
          dataToSubmit[key] === 0
        ) {
          console.log("Empty ");
          state.formData[key].validationText =
            state.formData[key].labelText + " cannot be empty";
          state.formData[key].valid = false;
          this.setState(state);
          return;
        } else {
          state.formData[key].validationText = "";
          state.formData[key].valid = true;
          this.setState(state);
        }
      }
    }
    // Always include packages field for backend compatibility
    if (!('packages' in dataToSubmit)) {
      dataToSubmit["packages"] = [this.state.formData.packageCode.value];
    }
    fetch("/API/query/addAssignment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((res) => {
        console.log(res);
        this.props.navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    console.log(this.state.formData);
    return (
      <div>
        <BreadCrumbs breadcrumbItems={breadCrumbItem} />
        <FormFields
          formData={this.state.formData}
          change={(newState) => this.updateForm(newState)}
          createNewForm={(noOfPacket) => this.increaseDynamicForm(noOfPacket)}
          dynamicIncrease={this.increaseDynamicForm}
          dynamicDecrease={this.decreaseDynamic}
          submitForm={(event) => this.submitForm(event)}
        />
      </div>
    );
  }
}

export default AssignPackage;
