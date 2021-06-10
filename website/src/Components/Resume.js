import React, { Component } from 'react';

class Resume extends Component {
   
   render() {

         var skillmessage = this.props.data.skillmessage;
         var certi = this.props.labels.certificate
         
         var education = this.props.data.education.map(function (education) {
            return <div id={"certificate-a"} key={education.school}><h3>{education.school}</h3>
               <p className="info">{education.degree} <span>&bull;</span><em className="date">{education.graduated}</em></p>
               <a href={education.certificate} download>{certi}</a>
               <p id={"certificate-p"}>{education.description}</p>
            </div>
         })
         var work = this.props.data.work.map(function (work) {
            return <div key={work.company}><h3>{work.company}</h3>
               <p className="info">{work.title}<span>&bull;</span> <em className="date">{work.years}</em></p>
               <p>{work.description}</p>
            </div>
         })
         var skills = this.props.data.skills.map(function (skills) {
            var className = 'bar-expand ' + skills.name.toLowerCase();
            return <li key={skills.name}> <span style={{ width: skills.level }} className={className}></span>  <em id={"skill-list"}> {skills.name}</em> </li>
         })

         var volunteer = this.props.data.volunteer.map(function (volunteer) {
            return <div key={volunteer.company}><h3>{volunteer.company}</h3>
               <p className="info">{volunteer.title}<span>&bull;</span> <em className="date">{volunteer.years}</em></p>
               <p>{volunteer.description}</p>
            </div>
         })

         var certificates = this.props.data.certificates.map(function (certificate) {
            return <div key={certificate.company}><h3>{certificate.company}</h3>
               <p className="info">{certificate.title}<span>&bull;</span> <em className="date">{certificate.obtained}</em></p>
               <a href={certificate.certificate} download>{certi}</a>
            </div>
         })

         var courses = this.props.data.courses.map(function (course) {
            return <div id={"certificate-a"} key={course.degree}><h3>{course.school}</h3>
               <p className="info">{course.degree} <span>&bull;</span><em className="date">{course.graduated}</em></p>
               <a href={course.certificate} download>{certi}</a>
               <p id={"certificate-p"}>{course.description}</p>

            </div>
         })

      

      return (
         <section id="resume">

            <div className="row work">
               <div className="three columns header-col">
                  <h1><span>{this.props.labels.experience}</span></h1>
               </div>

               <div className="nine columns main-col">
                  {work}
               </div>
            </div>
           
            <div className="row education">
               <div className="three columns header-col">
                  <h1><span>{this.props.labels.education}</span></h1>
               </div>

               <div className="nine columns main-col">
                  <div className="row item">
                     <div className="twelve columns">
                        {education}
                     </div>
                  </div>
               </div>
            </div>

            <div className="row education">
               <div className="three columns header-col">
                  <h1><span>{this.props.labels.courses}</span></h1>
               </div>

               <div className="nine columns main-col">
                  <div className="row item">
                     <div className="twelve columns">
                        {courses}
                     </div>
                  </div>
               </div>
            </div>

            <div className="row education">
               <div className="three columns header-col">
                  <h1><span>{this.props.labels.certificates}</span></h1>
               </div>

               <div className="nine columns main-col">
                  <div className="row item">
                     <div className="twelve columns">
                        {certificates}
                     </div>
                  </div>
               </div>
            </div>


            <div className="row work">

               <div className="three columns header-col">
                  <h1><span>{this.props.labels.volunteering}</span></h1>
               </div>

               <div className="nine columns main-col">
                  {volunteer}
               </div>
            </div>

            <div className="row skill">

               <div className="three columns header-col">
                  <h1><span>{this.props.labels.skills}</span></h1>
               </div>

               <div className="nine columns main-col">

                  <p>{skillmessage}
                  </p>

                  <div className="bars">
                     <ul className="skills">
                        {skills}
                     </ul>
                  </div>
               </div>
            </div>
         </section>
      );
   }
}

export default Resume;
