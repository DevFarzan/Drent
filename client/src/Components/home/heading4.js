import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Heading4 extends Component {
  render() {
  	const { label, hrLine, data, showEditDelete, onDelete } = this.props;
    
    return (
    	<div className="App" style={{backgroundImage: "url('./images/swrils.png')"}}>
    		{label && label.length > 0 && <div className="Heading">
      			<h1 className="headings">{label}</h1>
      			<img src='./images/bar.png'/>
      		</div>}
      		<div className="container-fluid">
	    		<div className="container-fluid">
	    			<div className="col-md-12 col-sm-12">
	    				<div className="row" style={{textAlign:'center'}}>	    					
	    					{data && data.map((elem, key) => {
	    						return(		    						
	    							<div className="col-md-4">
			    						<Link key={key} to={{pathname: `/detail`, state: {elem, data}}}>
			    							<img src={elem.fileList[0]} className="dress1" style={{width:'100%'}} />				    					
		    							</Link>				    							
		    							<div>
		    								{showEditDelete && <div className="row">
		    									<div className="col-md-6">
		    										<Link to={{pathname: `/userdetail`, state: {goTo: 'uploadDress', elem}}}>
		    											<h2 className="h_dress">Edit</h2>
		    										</Link>
		    									</div>
		    									<div className="col-md-6">
		    										<h2 className="h_dress" onClick={() => onDelete(elem)}>Delete</h2>
		    									</div>
		    								</div>}
		    								<h2 className="h_dress">{elem.productName}</h2>
		    								<h3 className="h_dress">{elem.detailName}</h3>
		    								<h3 className="h_dress">$ {" " + elem.priceDay}</h3>
		    							</div>
			    					</div>
	    						)
	    					})}	    						    					
	    				</div>
	    			</div>
	    		</div>
	    	</div>
    	</div>
    );

  }
}

export default Heading4;
