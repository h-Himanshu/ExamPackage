import { Component } from "react";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";
import FormFields from "../../Widgets/Form/forms.jsx";
import PackageTable from "./packageTable.jsx";
import { useNavigate } from "react-router-dom";
const breadCrumbItems = [
  {
    text: "Add New Package",
    link: "/admin/add-new-package",
  },
];
const quickLinks = [
  {
    text: "Add New Program",
    link: "/admin/add-new-program",
    button: "primary",
  },
  {
    text: "Add New Exam",
    link: "/admin/add-new-Exam",
    button: "secondary",
  },
];
//import { Redirect } from "react-router-dom";
class AddNewPackage extends Component {
  state = {
    formData: {
      packageCode: {
        element: "input",
        value: "",
        required: true,
        labelText: "Package ID",
        config: {
          name: "packageID_input",
          type: "text",
          placeholder: "Enter new Package ID",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      noOfCopies: {
        element: "input",
        value: "",
        required: true,
        labelText: "No of Copies",
        config: {
          name: "noOfCopies_input",
          type: "number",
          placeholder: "Enter Number of Copies",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      codeStart: {
        element: "input",
        value: "",
        required: true,
        labelText: "Start Code",
        config: {
          name: "startCode_input",
          type: "text",
          placeholder: "Enter First Code of Code Range",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      codeEnd: {
        element: "input",
        value: "",
        required: true,
        labelText: "Last Code",
        config: {
          name: "lastCode_input",
          type: "text",
          placeholder: "Enter Last Code of Code Range"
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      level: {
        element: "select",
        value: "",
        label: true,
        labelText: "Level",
        config: {
          name: "Level",
          options: [
            { val: "Bachelors", text: "Bachelors" },
            { val: "Masters", text: "Masters" },
          ],
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      programID: {
        element: "select",
        value: "",
        label: true,
        labelText: "Program",
        config: {
          name: "program",
          options: [],
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
        quickLink: {
          link: "/admin/add-new-program",
        },
      },

      subjectID: {
        element: "select",
        value: "",
        label: true,
        labelText: "Subject",
        config: {
          name: "Subject",
          options: [],
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
        quickLink: {
          link: "/admin/add-new-subject",
        },
      },

      examID: {
        // element: "inputselect",
        element: "select",
        value: "",
        required: true,
        labelText: "Exam",
        config: {
          name: "exam",
          options: [],
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
        quickLink: {
          link: "/admin/add-new-exam",
        },
      },
      center: {
        element: "select",
        value: "",
        label: true,
        labelText: "Center",
        config: {
          name: "center",
          options: [], // Options will be populated dynamically
        },
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
    },
    posted: false,
    errorOnSubmission: false,
    errorText: "",
    postedData: [],
    examData: [],
    programData: [],
    subjectData: [],
    collegeData: [],
  };

  loadProgramOptions = async () => {
    let { programData } = this.state;
    let { level } = this.state.formData;

    let levelValue = level.value;
    console.log("Program Data:", programData);
    let filteredProgramData = programData.filter((item) => {
      return item["academicDegree"] === levelValue;
    });
    let yearChoices = ["I", "II", "III", "IV"];
    let yearOptions = [];
    if (levelValue === "Bachelors") {
      for (let yearChoice of yearChoices) {
        let temp = {};
        temp["val"] = yearChoice;
        temp["text"] = yearChoice;
        yearOptions.push(temp);
      }
    } else {
      for (let yearChoice of yearChoices.slice(0, 2)) {
        //Masters Level has only 2 years
        let temp = {};
        temp["val"] = yearChoice;
        temp["text"] = yearChoice;
        yearOptions.push(temp);
      }
    }

    let options1 = [];
    for (let program of filteredProgramData) {
      //console.log(program);
      let temp = {};
      temp["val"] = program.programName;
      temp["text"] = program.programName;
      options1.push(temp);
    }
    await this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        // year: {
        //   ...this.state.formData.year,
        //   config: {
        //     ...this.state.formData.year.config,
        //     options: yearOptions,
        //   },
        // },
        programID: {
          ...this.state.formData.programID,
          config: {
            ...this.state.formData.programID.config,
            options: options1,
          },
        },
      },
    });
  };

  loadSubjectOptions = async () => {
    let { subjectData, formData } = this.state;
    let { programID } = this.state.formData;

    let programValue = programID.value;
    // let yearValue = formData.year.value;
    // let partValue = formData.part.value;

    //Acoording to Value in Program Year and Part value, filter Subjects
    let filteredSubjectData = subjectData.filter((item) => {
      return (
        item["programName"] === programValue
        // &&
        // item["year"] === yearValue &&
        // item["part"] === partValue
      );
    });

    //Only those filtered Subjects are added to subject options for Subject Select field
    let subjectOptions = [];
    for (let subject of filteredSubjectData) {
      //console.log(subject);
      let temp = {};
      temp["val"] = subject.id;
      temp["text"] = `${subject.subjectName}  (${subject.courseCode})`;
      subjectOptions.push(temp);
    }
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        subjectID: {
          ...this.state.formData.subjectID,
          config: {
            ...this.state.formData.subjectID.config,
            options: subjectOptions,
          },
        },
      },
    });
  };
  loadExamOptions = async () => {
    let { examData } = this.state;
    let { subjectID } = this.state.formData;

    let subjectValue = subjectID.value;
    console.log(subjectValue, examData);
    console.log(this.state);
    let filteredExamData = examData.filter((item) => {
      return item["subjectID"] === parseInt(subjectValue);
    });

    let examOptions = [];

    for (let exam of filteredExamData) {
      let temp = {};
      temp["val"] = exam.id;
      temp["text"] = `${exam.examType}-${exam.date}`;
      examOptions.push(temp);
    }
    console.log("filteredExam", filteredExamData);
    await this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        examID: {
          ...this.state.formData.examID,
          config: {
            ...this.state.formData.examID.config,
            options: examOptions,
          },
        },
      },
    });
  };

  extractNumberFromURL = (url) => {
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
  };

  componentWillMount = async () => {
    let programData = [];
    let subjectData = [];
    let examData = [];
    let collegeData = [];
    await fetch("/API/query/getProgramList")
      .then((res) => res.json())
      .then((json) => {
        programData = json;
      });
    await fetch("/API/query/getSubjectList")
      .then((res) => res.json())
      .then((json) => {
        subjectData = json;
        console.log("Subject Data", subjectData);
      });
    await fetch("/API/query/getExams")
      .then((res) => res.json())
      .then((json) => {
        examData = json;
      });
    await fetch("/API/query/getCollegeList")
      .then((res) => res.json())
      .then((json) => {
        collegeData = json;
      });

    // Set options for each dropdown immediately after fetching
    const programOptions = programData.map((prog) => ({ val: prog.programName, text: prog.programName }));
    const subjectOptions = subjectData.map((subj) => ({ val: subj.id, text: `${subj.subjectName}  (${subj.courseCode})` }));
    const examOptions = examData.map((exam) => ({ val: exam.id, text: `${exam.examType}-${exam.date}` }));
    const collegeOptions = collegeData.map((college) => ({ val: college.collegeName, text: college.collegeName }));

    this.setState({
      programData,
      subjectData,
      examData,
      collegeData, // Added collegeData to the state
      formData: {
        ...this.state.formData,
        programID: {
          ...this.state.formData.programID,
          config: {
            ...this.state.formData.programID.config,
            options: programOptions,
          },
        },
        subjectID: {
          ...this.state.formData.subjectID,
          config: {
            ...this.state.formData.subjectID.config,
            options: subjectOptions,
          },
        },
        examID: {
          ...this.state.formData.examID,
          config: {
            ...this.state.formData.examID.config,
            options: examOptions,
          },
        },
        center: {
          ...this.state.formData.center,
          config: {
            ...this.state.formData.center.config,
            options: collegeOptions,
          },
        },
      },
    }, async () => {
      const packageID = this.extractNumberFromURL(window.location);
      if (packageID !== undefined) {
        fetch("/API/query/getOnePackage/" + packageID)
          .then((res) => res.json())
          .then(async (json) => {
            let { formData } = this.state;
            formData.packageCode.value = json[0].packageCode;
            formData.noOfCopies.value = json[0].noOfCopies;
            formData.codeStart.value = json[0].codeStart;
            formData.codeEnd.value = json[0].codeEnd;
            formData.level.value = json[0].academicDegree;
            formData.programID.value = json[0].programName;
            // formData.year.value = json[0].year;
            // formData.part.value = json[0].part;
            formData.subjectID.value = json[0].subjectID;
            formData.examID.value = json[0].examID;
            this.setState(
              {
                formData: formData,
              },
              async () => {
                await this.loadProgramOptions();
                await this.loadSubjectOptions();
                await this.loadExamOptions();
                console.log(this.state.formData);
                console.log("Value set");
              }
            );
          });
      }
    });
  };

  updateForm = (newState, id) => {
    this.setState({
      formData: newState,
    });

    if (id === "level") {
      this.loadProgramOptions();
    } else if (id === "programID" || id === "year" || id === "part") {
      this.loadSubjectOptions();
    } else if (id === "subjectID") {
      this.loadExamOptions();
    } else if (id === "codeStart" || id === "noOfCopies") {
      // Removed auto-calculation of lastCode
      this.setState({
        formData: newState
      });
    }
  };

  submitForm = (event) => {
    event.persist();
    let dataToSubmit = {};
    console.log(dataToSubmit);

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      console.log(dataToSubmit[key]);
      const state = this.state;
      // Validation for empty fields
      if (
        dataToSubmit[key].toString() === null ||
        dataToSubmit[key].toString().match(/^ *$/) !== null
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

    console.log(dataToSubmit);
    console.log('Center value:', dataToSubmit.center);

    let url = `/API/query/addPackage`;
    let methodType = "POST";
    // URL for update route
    const packageID = this.props.match?.params.packageID;
    if (packageID !== undefined) {
      url = `/API/query/editPackage/${packageID}`;
      methodType = "PUT";
    }
    fetch(url, {
      method: methodType,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((res) => {
        res.json().then((body) => {
          let { postedData } = this.state;
          console.log(body);
          if (res.status === 200) {
            if (packageID !== undefined) {
              Navigate(-1);
              return;
            }
            body["status"] = "Not Assigned";
            postedData.push(body);
            this.setState({
              posted: true,
              errorOnSubmission: false,
              postedData: postedData,
            });
          } else {
            this.setState({
              errorOnSubmission: true,
              errorText: "Error in submission",
              posted: true,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  errorCheck = () => {
    const { errorOnSubmission, errorText } = this.state;
    if (errorOnSubmission) {
      return <p>{errorText}</p>;
    }
  };

  loadForm = () => {
    return (
      <div>
        {this.errorCheck()}
        <FormFields
          formData={this.state.formData}
          change={(newState, id) => this.updateForm(newState, id)}
          submitForm={(event) => this.submitForm(event)}
        />
      </div>
    );
  };

  mainContent = () => {
    let { postedData, posted } = this.state;

    if (posted) {
      return (
        <div className="p">
          <div className="left-floated-form">{this.loadForm()}</div>
          <div>
            <PackageTable postedData={postedData} postedTable={true} />
          </div>
        </div>
      );
    } else {
      return <div>{this.loadForm()}</div>;
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <BreadCrumb props={this.props} breadcrumbItems={breadCrumbItems} />
        {this.mainContent()}
      </div>
    );
  }
}

export default AddNewPackage;
