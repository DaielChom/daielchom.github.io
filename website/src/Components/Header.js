import React, { Component } from 'react';

class Header extends Component {

   render() {

      if (this.props.data && this.props.labels) {
         var name = this.props.data.name;
         var occupation = this.props.data.occupation;
         var description = this.props.data.description;
         var city = this.props.data.address.city;
         var networks = this.props.data.social.map(function (network) {
            return <li key={network.name}><a href={network.url}> <i className={network.className}></i></a></li>
         })

         return (
            <header id="home">

               <nav id="nav-wrap">

                  <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
                  <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

                  <select className='language-selector minimal' onChange={this.props.LanguageHandle}>
                     <option value='spanish' className='text-black'>Español</option>
                     <option value='english' className='text-black'>English</option>
                  </select>

                  <ul id="nav" className="nav">
                     <li className="current"><a className="smoothscroll" href="#home">{this.props.labels.home}</a></li>
                     <li><a className="smoothscroll" href="#about">{this.props.labels.about}</a></li>
                     <li><a className="smoothscroll" href="#resume">{this.props.labels.resume}</a></li>
                     <li><a className="smoothscroll" href="#testimonials">{this.props.labels.testimonials}</a></li>
                  </ul>

               </nav>

               <div className="row banner">
                  <div className="banner-text">
                     <h1 className="responsive-headline">{name}</h1>
                     <h3>{this.props.labels.live} {city}, {this.props.labels.occupation} <span>{occupation}</span>. {description}.</h3>
                     <hr />
                     <ul className="social">
                        {networks}
                     </ul>
                  </div>
               </div>

               <p className="scrolldown">
                  <a className="smoothscroll" href="#about"><i className="icon-down-circle"></i></a>
               </p>

            </header>
         );
      }
      else {
         return(<header id="home">
            <nav id="nav-wrap">
               <ul id="nav" className="nav">
                  <li><a className="smoothscroll" href="#home">Home</a></li>
                  <li><a className="smoothscroll" href="#about"></a>About</li>
                  <li><a className="smoothscroll" href="#resume"></a>Resume</li>
                  <li><a className="smoothscroll" href="#testimonials">Testimonials</a></li>
               </ul>
            </nav>
         </header>)
      }
   }
}

export default Header;
