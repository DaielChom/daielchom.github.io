import React, { Component } from 'react';

class Testimonials extends Component {

   render() {

      if (this.props.data) {

         var testimonials = this.props.data.testimonials.map(function (testimonials) {

            return(
            <li key={testimonials.name}>
               <blockquote>
                  <p>{testimonials.name}</p>
                  {testimonials.description} <span>&bull;</span> {testimonials.type}<br/>
                  {testimonials.phone} <span>&bull;</span> {testimonials.email}
               </blockquote>
            </li>) 
         })
      }

      return (
         <section id="testimonials">
            <div className="text-container">
               <div className="row">

                  <div className="two columns header-col">
                     <h1>{this.props.labels.testimonials}</h1>
                  </div>

                  <div className="ten columns flex-container">
                     <ul>
                        {testimonials}
                     </ul>
                  </div>
               </div>
            </div>
         </section>
      );
   }
}

export default Testimonials;
