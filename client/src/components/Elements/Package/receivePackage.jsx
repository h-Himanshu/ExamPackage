// Utility function to convert Nepali digits to English digits
function toEnglishDigits(str) {
  const nepToEng = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
  return String(str).replace(/[०-९]/g, d => nepToEng[d]);
}
import { Component } from "react";
import { Navigate } from "react-router-dom";
import { calendarFunctions } from "../../Widgets/jquery.nepaliDatePicker";
//Components
import adbs from "ad-bs-converter";
import Form from "../../Widgets/Form/forms.jsx";

// Utility function to convert English digits to Nepali digits
function toNepaliDigits(str) {
  const engToNep = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
  return String(str).replace(/[0-9]/g, d => engToNep[d]);
}

class ReceivePackage extends Component {
  state = {
    packageReceived: false,
  packageStatus: null,
    formData: {
      packageCode: {
        element: "input",
        value: "",
        label: true,
        labelText: "Package Code",
        config: {
          name: "packageCode_input",
          type: "text",
          disabled: "disabled",
          placeholder: "Enter Package Code",
        },
        validation: {
          required: false,
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
          disabled: "disabled",
          placeholder: "Enter Name of Pakager Receiver",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      contact: {
        element: "input",
        value: "",
        label: true,
        labelText: "Contact",
        config: {
          name: "contact_input",
          type: "tel",
          disabled: "disabled",
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
        element: "input",
        value: null,
        label: true,
        labelText: "Date of Assignment",
        config: {
          name: "assignedDate_input",

          disabled: "disabled",
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
        element: "input",
        value: null,
        label: true,
        labelText: "Date of Deadline",
        config: {
          name: "submissionDay_input",

          disabled: "disabled",
          placeholder: "Enter Deadline Day",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      dateOfSubmission: {
        element: "date-picker-jq",
        value: null,
        label: true,
        labelText: "Date of Submission",
        config: {
          name: "submissionDay_input",
          type: "date",
          placeholder: "Enter Submission Day",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      dueDay: {
        element: "input",
        value: "",
        label: true,
        labelText: "Due Days",
        config: {
          name: "dueDay_input",
          type: "number",
          disabled: "disabled",
          placeholder: "Enter Due Day",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },

      voucherNo: {
        element: "input",
        value: "",
        label: true,
        labelText: "Voucher No.",
        config: {
          name: "voucherNo_input",
          type: "text",
          placeholder: "Enter Voucher Number",
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      // This field will be shown/used only when status is Recheck
      resubmissionDate: {
        element: "hidden",
        value: null,
        label: true,
        labelText: "Resubmission Date",
        config: {
          name: "resubmissionDay_input",
          type: "date",
          placeholder: "Enter Resubmission Day",
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

  //This methods will be called from form.js to set value of formElement in state of this component
  updateForm = (newState) => {
   
    this.setState({
      formData: newState,
    });
  };

  handleDateOfSubmissionChange = (value) => {
    // Update only the dateOfSubmission field in formData
    this.setState(prevState => {
      const updatedFormData = { ...prevState.formData };
      updatedFormData.dateOfSubmission = {
        ...updatedFormData.dateOfSubmission,
        value: value
      };
      return { formData: updatedFormData };
    }, () => {
      // After updating, recalculate the difference
      this.setDifference();
    });
  };

  handleResubmissionDateChange = (value) => {
    // Update only the resubmissionDate field in formData
    this.setState(prevState => {
      const updatedFormData = { ...prevState.formData };
      updatedFormData.resubmissionDate = {
        ...updatedFormData.resubmissionDate,
        value: value
      };
      return { formData: updatedFormData };
    }, () => {
      // After updating, recalculate the difference
      this.setDifference();
    });
  };

  //Format english date to nepali (YYYY/MM/DD)
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

  formatNepaliDateToEng = (nepaliDate) => {
    console.log(nepaliDate);
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

  parseDate(str) {
    // Convert Nepali digits to English before parsing
    const englishStr = toEnglishDigits(str);
    const englishDate = adbs.bs2ad(englishStr);
    return new Date(
      englishDate.year,
      englishDate.month - 1,
      englishDate.day + 1
    );
  }

  findDateDifference(myDate) {
    const now = new Date();
    //console.log(now, myDate);
    return Math.round((myDate - now) / (1000 * 60 * 60 * 24));
  }

  //This method will automatically called by React once the Component finished mount
  componentDidMount = () => {
    function getDigitsAfterLastSlash(url) {
      // Find the last occurrence of "/"
      const lastSlashIndex = url.lastIndexOf("/");

      if (lastSlashIndex === -1) {
        // No "/" found, return an error or null, depending on your use case.
        return null;
      }

      // Extract the substring after the last "/"
      const digitsAfterLastSlash = url.substring(lastSlashIndex + 1);

      // Filter out non-digit characters using a regular expression
      const digits = digitsAfterLastSlash.replace(/\D/g, "");

      return digits;
    }
    let currentURL = window.location.href;

    let params = { assignmentID: getDigitsAfterLastSlash(currentURL) };
    fetch(`/API/query/getOneAssignment/${params.assignmentID}`)
      .then((res) => res.json())
      .then((json) => {
        //This type of Destructing enable to use that state variable directly and it is better than setting state directly this.state = ....
        let { formData } = this.state;
        for (let key of Object.keys(json[0])) {
          console.log(key, json[0][key]);
          if (formData[key]) {
            formData[key].value = json[0][key];
          }
        }

  const rawStatus = json[0] && json[0].status ? json[0].status : null;
  const statusNorm = rawStatus ? String(rawStatus).trim().toLowerCase() : null;
  const isRecheck = statusNorm === "recheck";
        // Adjust labels/fields depending on status
  if (isRecheck) {
          // Turn submitted date into a simple text field label & keep resubmission date as date-picker
          formData.dateOfSubmission.element = "input";
          formData.dateOfSubmission.config = {
            ...formData.dateOfSubmission.config,
            type: "text",
            placeholder: "Enter Submitted Day (YYYY/MM/DD)",
            disabled: "disabled",
          };
          // ensure resubmission date is visible as date picker
          formData.resubmissionDate.element = "date-picker-jq";
        } else {
          // Keep submission as date-picker when not in Recheck
          formData.dateOfSubmission.element = "date-picker-jq";
          // remove disabled when switching back to date picker
          const { disabled, ...restCfg } = formData.dateOfSubmission.config || {};
          formData.dateOfSubmission.config = {
            ...restCfg,
            type: "date",
            placeholder: "Enter Submission Day",
          };
          // Ensure resubmissionDate is cleared when not Recheck
          formData.resubmissionDate.value = null;
          // hide resubmissionDate by switching to a no-op element
          formData.resubmissionDate.element = "hidden";
        }

        // formData.dateOfSubmission.value = this.formatEnglishDateToNep(
        //   this.formatDate(new Date())
        // );
        formData.dueDay.value = -this.findDateDifference(
          this.parseDate(json[0]["dateOfDeadline"])
        );
        this.setState({
          formData: formData,
          packageStatus: rawStatus,
        }, () => {
          // Convert dateOfAssignment and dateOfDeadline to Nepali digits after setting formData
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              dateOfAssignment: {
                ...prevState.formData.dateOfAssignment,
                value: toNepaliDigits(prevState.formData.dateOfAssignment.value)
              },
              dateOfDeadline: {
                ...prevState.formData.dateOfDeadline,
                value: toNepaliDigits(prevState.formData.dateOfDeadline.value)
              }
            }
          }));
        });
      });
  };
  extractNumberFromURL(url) {
    // Define a regular expression pattern to match the number
    var regex = /\/(\d+)\b/;

    // Use the `exec` method to search for the pattern in the URL
    var match = regex.exec(url);

    // If a match is found, return the captured number
    if (match && match.length > 1) {
      return parseInt(match[1]);
    }

    // If no match is found, return null
    return null;
  }
  handleReceive = () => {
    let assignmentID = this.extractNumberFromURL(window.location);
    let params = { assignmentID };
    // Check if voucher number is empty
    if (!this.state.formData.voucherNo.value || this.state.formData.voucherNo.value.trim() === "") {
      alert("Voucher Number is required for submission.");
      return false;
    }
    let dataToSubmit = {};
    dataToSubmit["id"] = params.assignmentID;
    dataToSubmit["voucherNo"] = this.state.formData.voucherNo.value;
    // Choose which date to send based on status
    const isRecheck = this.state.packageStatus === "Recheck";
    const chosenDateField = isRecheck ? this.state.formData.resubmissionDate : this.state.formData.dateOfSubmission;

    if (
      chosenDateField.value === "" ||
      chosenDateField.value === null
    ) {
      if (!isRecheck) {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; //Months are zero based
        const yyyy = today.getFullYear();
        const nepaliDate = adbs.ad2bs(yyyy + "/" + mm + "/" + dd).en;
        //Year month day format with  0 padded if mm or dd < 10
        console.log(nepaliDate);
        dataToSubmit["dateOfSubmission"] =
          nepaliDate.year.toString() +
          "/" +
          ("0" + nepaliDate.month.toString()).slice(-2) +
          "/" +
          ("0" + nepaliDate.day.toString()).slice(-2);
      }
    } else {
      dataToSubmit["dateOfSubmission"] = this.formatNepaliDateToEng(
        chosenDateField.value
      );
    }
    console.log(this.state);

    // Return a promise so the caller can handle navigation after success
    return fetch("/API/query/receivePackage", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    }).then((res) => {
      if (res.status === 200) {
        alert("Package Received Sucessfully");
        this.setState({
          packageReceived: true,
        });
        return true;
      } else {
        return false;
      }
    }).catch(() => false);
  };

  //Difference between Deadling and Submission Day to calculate Due Day
  setDifference = () => {
    let { dateOfDeadline, dateOfSubmission, resubmissionDate, dueDay } = this.state.formData;
    let deadlineDate = dateOfDeadline.value ? this.parseDate(dateOfDeadline.value) : null;
    const isRecheck = this.state.packageStatus === "Recheck";
    const picked = isRecheck ? resubmissionDate.value : dateOfSubmission.value;
    let submissionDate = picked ? this.parseDate(picked) : null;
    console.log(deadlineDate, submissionDate);
    if (deadlineDate && submissionDate) {
      dueDay.value = Math.round(
        (-(deadlineDate - submissionDate)) / (1000 * 60 * 60 * 24)
      );
    }
    this.setState({
      dueDay,
    });
  };
  render() {
    if (this.state.packageReceived) {
      return <Navigate replace to="/admin/dashboard" />;
    }
    return (
      <div>
        <Form
          formData={this.state.formData}
          change={(newState) => this.updateForm(newState)}
          submitForm={() => this.handleReceive()}
          setDifference={() => this.setDifference()}
          onDateOfSubmissionChange={this.handleDateOfSubmissionChange}
          onResubmissionDateChange={this.handleResubmissionDateChange}
        />
      </div>
    );
  }
}
export default ReceivePackage;
