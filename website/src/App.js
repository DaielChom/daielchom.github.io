import React, { Component } from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import About from './Components/About';
import Resume from './Components/Resume';
//import Contact from './Components/Contact';
import Testimonials from './Components/Testimonials';
//import Portfolio from './Components/Portfolio';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resumeData: {},
      labels: {},

      data_loading:false,
      labels_loading:false,
    };

    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);
    this.LanguageHandle = this.LanguageHandle.bind(this)

  }

  LanguageHandle(language) {
    this.getResumeData(language.target.value);
    this.getLabelsData(language.target.value);

  }

  getResumeData(language) {

    $.ajax({
      url: '/resume_' + language + '.json',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
        this.setState({ data_loading: true });        

      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
    
  }

  getLabelsData(language) {
    
    $.ajax({
      url: '/labels_' + language + '.json',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ labels: data });
        this.setState({ labels_loading: true });        
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      }
    });
    

  }

  

  componentDidMount() {
    this.getLabelsData('spanish');
    this.getResumeData('spanish');
  }

  render() {
    
    if (this.state.labels_loading & this.state.data_loading){
      console.log('a', this.state)
      return (
        <div className="App">
          <Header data={this.state.resumeData.main} LanguageHandle={this.LanguageHandle} labels={this.state.labels.header} />
          <About data={this.state.resumeData.main} labels={this.state.labels.about}/>
          <Resume data={this.state.resumeData.resume} labels={this.state.labels.resume} />
          <Testimonials data={this.state.resumeData.testimonials} labels={this.state.labels.testimonials}/>
          <Footer data={this.state.resumeData.main} />
        </div>
      );
    }
    return <div></div>
     
  }
}

export default App;
