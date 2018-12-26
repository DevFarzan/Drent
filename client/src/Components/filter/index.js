import React, { Component } from 'react';
import Header from '../home/Header';
import FilterPanel from './filterpanel';
import Footer from '../home/headingf8';

class FilterPage extends Component {
  render() {
    
    return (
      <div className="App">
        <Header displayIcon={false}/>
        <FilterPanel/>
        <Footer/>
        
      </div>
    );

  }
}

export default FilterPage;