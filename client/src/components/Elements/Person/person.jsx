import axios from "axios";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormFields from "../../Widgets/Form/forms.jsx";
import BreadCrumb from "../../Widgets/Breadcrumb/breadcrumb.jsx";

class Person extends React.Component {
  state = {
    formData: {
      name: {
        element: "input",
        value: "",
        required: true,
        labelText: "Name",
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter the name",
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
        required: true,
        labelText: "Contact",
        config: {
          name: "contact_input",
          type: "phone",
          placeholder: "Enter the contact",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },

      campus: {
        element: "select",
        value: "",
        required: true,
        labelText: "Campus",
        config: {
          name: "campus",
          options: [{ val: "", text: "" }],
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },

      email: {
        element: "input",
        value: "",
        required: true,
        labelText: "Email",
        config: {
          name: "address_input",
          type: "text",
          placeholder: "Enter the email",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      password: {
        element: "input",
        value: "",
        required: true,
        labelText: "Password",
        config: {
          name: "name_input",
          type: "password",
          placeholder: "Enter your login password",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },
      subjectTaught: {
        element: "select",
        value: "",
        required: true,
        labelText: "Subject Taught",
        config: {
          name: "Subject",
          options: [{ val: "", text: "" }],
          placeholder: "Select the subject Taught",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
        validationText: "",
      },

      teachingExperience: {
        element: "input",
        value: "",
        required: true,
        labelText: "Years of Experience",
        config: {
          name: "address_input",
          type: "number",
          placeholder: "Years of Experience",
        },
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
      },
      jobType: {
        element: "select",
        value: "",
        required: true,
        labelText: "Job Type",
        config: {
          name: "Job Type",
          options: [
            { value: "Full Time", text: "Full Time" },
            { value: "Part Time", text: "Part Time" },
          ],
        },

        valid: true,
        touched: false,
      },
    },
    error: false,
    errorText: "",
    redirect: false,
    selectedFile: null,
    loaded: 0,
    isImport: false,
    isInserting: "no",
  };
  loadCollegeOptions = async () => {
    let { formData } = this.state;
    fetch("/API/query/getCollegeList")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res) => {
        console.log(res);
        const newFormData = { ...formData };
        newFormData["campus"]["config"]["options"] = res.map((college) => {
          return { val: college.id, text: college.collegeName };
        });
        this.setState(newFormData);
        console.log("newFormData", newFormData);
      });
  };

  loadSubjectOptions = () => {
    let { formData } = this.state;
    fetch("/API/query/getSubjectList")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res) => {
        console.log(res);
        const newFormData = { ...formData };
        newFormData["subjectTaught"]["config"]["options"] = res.map(
          (subject) => {
            return { val: subject.id, text: subject.subjectName };
          }
        );
        this.setState(newFormData);
      });
  };

  updateForm = (newState) => {
    this.setState({
      formData: newState,
    });
  };

  componentWillMount() {
    console.log(this.props);

    this.loadCollegeOptions();
    this.loadSubjectOptions();
  }

  submitForm = (event) => {
    event.preventDefault();
    event.persist();
    let dataToSubmit = {};

    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value.toString();
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
    console.log(dataToSubmit);
    let url = `/API/query/addPerson`;
    let methodType = "POST";
    //Update route , change params
    if (this.props.match) {
      const personID = this.props.match.params.personID;
      if (personID !== undefined) {
        url = `/API/query/editPerson/` + personID;
        methodType = "PUT";
      }
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
        // console.log(res);
        const personID = this.props.match.params.personID;
        if (res.status === 200) {
          if (personID !== undefined)
            this.props.history.goBack();
          this.setState({ error: false });
        } else this.setState({ error: true, errorText: res.statusText });
      })
      .catch((err) => {
        this.setState({ error: true, errorText: err });
      });
  };

  errorCheck = () => {
    const { error, errorText } = this.state;
    if (error) {
      return <p>{errorText}</p>;
    }
  };
  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };
  uploadFile = async () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    if (this.state.selectedFile === null) {
      this.setState({
        isInserting: "empty",
        loaded: 0,
      });
      return;
    }
    const res = await axios.post("/API/query/upload", data, {
      onUploadProgress: (ProgressEvent) => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
        });
      },
    });

    this.setState({
      isInserting: "onProgress",
    });

    let response = await fetch("/API/query/postExcel", {
      method: "post",
      headers: {
        Accept: "application/json",
      },
    });
    if (response.status == 500) {
      this.setState({
        isInserting: "error",
        loaded: 0,
      });
    }
    if (response && response.status == 200) {
      this.setState({
        isInserting: "done",
      });
    }

    //  fetch(import.meta.env.VITE_BACKEND_URL+"API/query/upload", {
    //    method: "POST",
    //   //  headers: {
    //   //   Accept: "application/json",
    //   // },
    //   body: data
    // }).then(res=>{
    //   console.log(res)
    // })
  };
  checkInserting = () => {
    let isInserting = this.state.isInserting;
    if (isInserting == "no") return <h3></h3>;
    else if (isInserting == "onProgress") return <h3>Insertion in progress</h3>;
    else if (isInserting == "error") return <h3>Error inserting data</h3>;
    else if (isInserting == "empty") return <h3>Select a file to insert</h3>;
    else {
      this.props.navigate(-1);
      return null;
    }
  };
  render() {
    const { personID } = this.props.params || {};
    const breadCrumbItems = [
      {
        text: "Persons",
        link: "/admin/person"
      },
      {
        text: personID ? "Edit Person" : "Add New Person",
        link: personID ? `/admin/edit-person/${personID}` : "/admin/add-new-person"
      }
    ];

    return (
      <div className="container">
        <BreadCrumb breadcrumbItems={breadCrumbItems} />
        {/* {this.errorCheck()} */}
        <MDBCard>
          <MDBCardHeader>
            Add New Person
            {/* <button
              className="btn btn-xl btn-secondary"
              style={{ float: "right" }}
              onClick={() => {
                this.setState((prevState) => ({
                  isImport: !prevState.isImport,
                }));
              }}
            >
              Import{" "}
            </button> */}
          </MDBCardHeader>
          <MDBCardBody>
            {/* {this.state.isImport ? ( */}
            {/* <div>
                {this.checkInserting()}
                <MDBProgress value={this.state.loaded}>
                  {Math.round(this.state.loaded, 2)}%
                </MDBProgress>
                <input
                  type="file"
                  name="file"
                  className="btn"
                  onChange={this.onChangeHandler}
                />
                <button className="btn btn-secondary" onClick={this.uploadFile}>
                  UpLoad File
                </button>
              </div> */}
            {/* // ) : ( */}
            <FormFields
              formData={this.state.formData}
              change={(newState) => this.updateForm(newState)}
              submitForm={(event) => this.submitForm(event)}
            />
            {/* // )} */}
          </MDBCardBody>
        </MDBCard>
      </div>
    );
  }
}
export default Person;
