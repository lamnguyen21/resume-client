import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

class App extends Component {
  render() {
    return (
      <section className="container">
        <section className="mt-3">
          <h3>A Simple Resume App</h3>
        </section>
        <section className="row">
          <section className="col">
            <AddNewResume />
          </section>
          <section className="col">
            <SearchResume />
          </section>
        </section>
      </section>
    );
  }
}

class AddNewResume extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      curJob: '',
      curJobDesc: '',
      curCompany: ''
    };
  }

  handleSubmit() {
    const that = this;
    var data = {
      name: this.state.name,
      jobTitle: this.state.curJob,
      jobDesc: this.state.curJobDesc,
      curCompany: this.state.curCompany
    };

    if (!this.validateData(data)) {
      return;
    }

    axios.post('/api/uploadResumeDetails', data)
    .then(function(response) {
      var data = response.data;
      alert("Your resume has been uploaded successfully.\nPlease keep your resume id " + data.id +
            ".\nYou may use it to search for your resume later.");

      that.setState({
        name: '',
        curJob: '',
        curJobDesc: '',
        curCompany: ''
      });
    }).catch(function(err) {
      if (err) {
        console.log(err);
        alert("There was an error. Please try again later");
      }
    });
  }

  validateData(data) {
    if (!data.name) {
      alert("Please enter name");
      return false;
    }
    else if (!data.jobTitle) {
      alert("Please select job title");
      return false;
    }
    else if (!data.jobDesc) {
      alert("Please enter job description");
      return false;
    }
    else if (!data.curCompany) {
      alert("Please enter current company");
      return false;
    }

    return true;
  }

  render() {
    return (
      <div className="card">
        <h5 className="card-header">Add New Resume</h5>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="candidateName">Name</label>
              <input type="text" className="form-control" id="candidateName"
                value={this.state.name}
                onChange={(evt) => this.setState({name: evt.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="candidateCurJob">Current Job Title</label>
              <select className="form-control" id="candidateCurJob"
                value={this.state.curJob}
                onChange={(evt) => this.setState({curJob: evt.target.value})}>
                <option value="">Please Select</option>
                <option value="1">Backend Software Engineer</option>
                <option value="2">Frontend Software Engineer</option>
                <option value="3">Fullstack Software Engineer</option>
                <option value="4">Data Scientist</option>
                <option value="5">Project Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="candidateCurJobDesc">Current Job Title Description</label>
              <textarea rows="5" className="form-control" id="candidateCurJobDesc"
                value={this.state.curJobDesc}
                onChange={(evt) => this.setState({curJobDesc: evt.target.value})} >
              </textarea>
            </div>
            <div className="form-group">
              <label htmlFor="candidateCurCompany">Current Company</label>
              <input type="text" className="form-control" id="candidateCurCompany"
                value={this.state.curCompany}
                onChange={(evt) => this.setState({curCompany: evt.target.value})} />
            </div>

            <button type="button" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

class SearchResume extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resumeid: "",
      resume: null,
      visibility: "d-none"
    };

    this.mapJobTitle = this.mapJobTitle.bind(this);
  }

  handleSubmit() {
    const that = this;
    axios.get('/api/getResume/'+this.state.resumeid)
        .then(function(response) {
          const data = response.data;
          if (!data || data.err === -1) {
            alert("No result found!!!");
          }
          else {
            that.setState({
              resume: data,
              visibility: "d-block"
            });
          }
        })
        .catch(function(error) {
          if (error) {
            console.log(error);
            alert("There was an error. Please try again later");
          }
        });
  }

  mapJobTitle(titleCd) {
    switch(titleCd) {
      case "1":
        return "Backend Software Engineer";
      case "2":
        return "Frontend Software Engineer";
      case "3":
        return "Fullstack Software Engineer";
      case "4":
        return "Data Scientist";
      case "5":
        return "Project Manager";
      default:
        return "";
    }
  }

  render() {
    return (
      <div className="card">
        <h5 className="card-header">Search Resume</h5>
        <div className="card-body">
          <form className="mb-2">
            <div className="form-group">
              <label htmlFor="resumeid">Resume ID</label>
              <input type="text" className="form-control" id="resumeid"
                value={this.state.resumeid}
                onChange={(evt) => this.setState({resumeid: evt.target.value})} />
            </div>

            <button type="button" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Search</button>
          </form>

          <div className={this.state.visibility}>
            <div className="card">
              <div className="card-header">
                Search Result
              </div>
              <div className="card-body">
                <div className="d-flex flex-row">
                  <div className="p-2">Name:</div>
                  <div className="p-2">{(this.state.resume || {}).name}</div>
                </div>
                <div className="d-flex flex-row">
                  <div className="p-2">Current Job Title:</div>
                  <div className="p-2">{this.mapJobTitle((this.state.resume || {}).jobTitle)}</div>
                </div>
                <div className="d-flex flex-row">
                  <div className="p-2">Current Job Title Description:</div>
                  <div className="p-2">{(this.state.resume || {}).jobDesc}</div>
                </div>
                <div className="d-flex flex-row">
                  <div className="p-2">Current Company:</div>
                  <div className="p-2">{(this.state.resume || {}).curCompany}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
