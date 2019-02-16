 import React, { Component } from 'react';
import Header from '../home/Header';
import Headingf8 from '../home/headingf8';
import Imagescard from './productdetailimagescard';
import Table from './productdetailtable';
import Secondfold from './productdetailsecondfold';
import { CircleSizes, Rate } from '../_components/myInput';
import './productdetail.css'

// import { AsyncStorage } from '@callstack/async-storage';

class Productdetailfirstfold extends Component {
	state = {
		to: '',
		from: '',
		arr: [], 
		booked: false
	}

	async componentDidMount(){
		let cart = await localStorage.getItem('Cart'),
		{ elem } = this.props.location.state;
		if(cart == null){
			localStorage.setItem('Cart', JSON.stringify([]))
		}else {
			let arr = JSON.parse(cart);
			this.bookedFunc(arr, elem);
			this.setState({ arr });
		}
	}

	bookedFunc(arr, elem){
		arr.map((el) => {
			if(el._id === elem._id){
				this.setState({ booked : true })
			}
		})
	}

	inputHandleChange = e => {
		const { from, to } = this.state,
		{ elem } = this.props.location.state,
		self = e.target;
		this.setState({ [e.target.id]: e.target.value }, ()=> {
			if((from.length > 0 && self.value.length > 0 && self.id == 'to')){
				this.getDifference(from, self.value, (msg) => {
					if(msg === 'show msg'){
						this.setState({ msg: "start date must be less than end date" });
					}else {						
						this.getDifference(elem.from, from, (msg1) => {
							if(msg1 === 'show msg'){
								let msg = "Dress is not available before " + elem.from;
								this.setState({ msg });
							}
							else {
								this.getDifference(self.value, elem.to, (msg2) => {									
									if(msg2 === 'show msg'){
										msg = "Dress is not available after " + elem.to
										this.setState({ msg });
									}else {
										this.setState({ msg: '' });										
									}
								})
							}							
						})	
					}	
				});
			}else if((to.length > 0 && self.value.length > 0 && self.id == 'from')){
				this.getDifference(self.value, to, (msg) => {
					if(msg === 'show msg'){
						this.setState({ msg: "start date must be less than end date" });
					}else {
						this.getDifference(elem.from, self.value, (msg1) => {
							if(msg1 === 'show msg'){
								let msg = "Dress is not available before " + elem.from;
								this.setState({ msg });
							}
							else {
								this.getDifference(self.value, elem.to, (msg2) => {									
									if(msg2 === 'show msg'){
										msg = "Dress is not available after " + elem.to
										this.setState({ msg });
									}else {
										this.setState({ msg: '' });										
									}
								})
							}							
						})	
					}
				});
			}
		});		
	}

	getDifference = (a, b, callBack) => {		
		let date1 = new Date(a),
		date2 = new Date(b),
		diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24)); 
		if(diffDays >= 0){
			callBack();
		}else {
			callBack('show msg')
		}	
	}

	addToCart = e => {
		const { elem } = this.props.location.state,
		{ from, to, arr } = this.state,
		date1 = new Date("12/14/2010"),
		date2 = new Date("12/17/2010"),
		timeDiff = Math.abs(date2.getTime() - date1.getTime()),
		diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		let obj = {...elem, ...{rentDay: diffDays}}
		arr.push(obj)
		this.bookedFunc(arr, elem);
		this.props.updateCart(obj);
		localStorage.setItem('Cart', JSON.stringify(arr));
	}

	render() { 
		const { elem, data } = this.props.location.state;

		return( 
			<div className="App">
				<div className="">
					{/*<Header/>*/}
				</div>
				<div className="container" style={{marginTop:"130px"}} >
					<div className="row">
						<div className="col-md-7 hidden-xs hidden-sm">
							<Imagescard data={elem.fileList}/>
                    		<Table /> 
                    	</div>
                    	<div className="visible-xs visible-sm">
                    		<Imagescard data={elem.fileList}/>
                    	</div>	
						<div className="col-md-5">{/*/*main col-md-5 right possion div deskstop*/}
						    <div>
								 <font color="#c2073f"><h1 style={{fontFamily:"Qwigley",fontSize: "70px"}}>{elem.productName}</h1></font>
								 <p style={{marginTop:"-20px"}}>{elem.detailName}
                                 </p>
                            </div>{/* div close*/}
							<div className="row">
								<div className="col-md-12">
									    <div className="col-md-4">
									     	 <font color="#c2073f"><h1 style={{fontFamily :"Qwigley"}}>{elem.bodyType}</h1></font> 
									    </div>{/*div close*/}
									    <div className="col-md-2"></div>
									    <div className="col-md-6" style={{marginTop: "18px"}}>
									    	<Rate rate="4.5" initialRating={5} readonly classMd="col-md-8" classXS="col-md-4" />									    	
		                       	 		</div>{/*Div close*/}	
			                    </div>{/*Div Close Col-md-12*/}	
							</div>{/*Row Close*/}                                  
                            <div className="row">
                          		<div className="col-md-12">
                          			<div className="col-md-3">
                                    	<h3>${" " + elem.priceDay}</h3>
                          			</div>
                          			<div className="col-md-3 name">
                                    	<p><span className="hello">Rental Price</span></p>
                          			</div>
                           			<div className="col-md-3">
                                    	{/*empty div*/}
            						</div>
                          			<div className="col-md-3">
                          		   	 	{/*empty div*/}
                          			</div>
                          		</div>{/*div col-md-12 Close*/}
                            </div>{/*Row Close*/}
                            <div className="row">
                                	<div className="col-md-12">
                                	 	<div className="col-md-6 detail">
                                	 		<h1>Description</h1>
                                	 	</div>
                                	 	<div className="col-md-6"></div>
                                	</div>{/*Row Col-md-12 Close*/}
                            </div>{/*Row Close*/}			                    
                    		<div className="row">
			                    	<div className="col-md-12 drn">
			                    		<p className="trend">{elem.description}</p>
		                   			</div>{/*Div col-md-12 Close*/}
				        	</div>{/*Row Close*/}                            
				        	<div className="row">
				        		<div className="fly"><h1>Size Available</h1></div>
				        	</div>{/*Div Row Close*/}
				        	{/*sizes of Deskstop*/}

				        	{/*<CircleSizes classOne="col-md-12 hidden-xs hidden-sm round"
				        		classTwo="col-md-2" classThree="col-md-2 flu"
				        		classFour="col-md-1" classFive="col-md-2 flu"
				        		classSix="col-md-1" classSeven="col-md-2 flu"
				        		classEight="col-md-2" elementOne="S" elementTwo="M"
				        		elementThree="L"
			        		/>*/}
							<div className="row">
  								<div className="col-md-12 hidden-xs hidden-sm round">
  									<div className="col-md-2"></div>
  									{elem.sizes && elem.sizes.map((el, key) => {
  										return(
  											<span key={key}>
  												<div className="col-md-2 flu"><h3>{el}</h3></div>
                            					<div className="col-md-1"></div>
  											</span>
  										)
  									})}
                            		{/*<div className="col-md-2 flu"><h3>S</h3></div>
                            		<div className="col-md-1"></div>
                            		<div className="col-md-2 flu"><h3>M</h3></div>
                            		<div className="col-md-1"></div>
                            		<div className="col-md-2 flu"><h3>L</h3></div>
                            		<div className="col-md-2"></div>*/}
                            	</div>
                            </div>
                        	{/*Sizes For XS*/}
                        	{/*<CircleSizes classOne="visible-xs"
				        		classTwo="col-xs-0" classThree="col-xs-2 flu"
				        		classFour="col-xs-1" classFive="col-xs-2 flu"
				        		classSix="col-xs-1" classSeven="col-xs-2 flu"
				        		classEight="col-xs-2" elementOne="S" elementTwo="M"
				        		elementThree="L"
			        		/>*/}
                            <div className="row">
  								<div className="visible-xs">
  									<div className="col-xs-1"></div>
  									{elem.sizes && elem.sizes.map((el, key) => {
  										return(
  											<span key={key}>
			                            		<div className="col-xs-2 flu"><h3>{el}</h3></div>
			                            		<div className="col-xs-1"></div>
			                            	</span>
  										)
  									})}	
                            		{/*<div className="col-xs-2 flu"><h3>M</h3></div>
                            		<div className="col-xs-1"></div>
                            		<div className="col-xs-2 flu"><h3>L</h3></div>
                            		<div className="col-xs-1"></div>*/}
                            	</div>
                            </div>
                            {/*Sizes For SM*/}
                            {/*<CircleSizes classOne="visible-sm"
				        		classTwo="col-sm-2" classThree="col-sm-2 flu"
				        		classFour="col-sm-2" classFive="col-sm-2 flu"
				        		classSix="col-sm-2" classSeven="col-sm-2 flu"
				        		classEight="col-sm-0" elementOne="S" elementTwo="M"
				        		elementThree="L"
			        		/>*/}

                            <div className="row">
  								<div className="visible-sm">
  									<div className="col-sm-2"></div>
  									{elem.sizes && elem.sizes.map((el, key) => {
  										return(
  											<span key={key}>
			                            		<div className="col-sm-2 fluu"><h3>{el}</h3></div>
			                            		<div className="col-sm-2"></div>
		                            		</span>
  										)
  									})}
                            		{/*<div className="col-sm-2 fluu"><h3>M</h3></div>
                            		<div className="col-sm-2"></div>
                            		<div className="col-sm-2 fluu"><h3>L</h3></div>
                            		<div className="col-sm-0"></div>*/}
                            	</div>
                            </div>
                            {elem.tags.length > 0 && <div className="row">                            	
                        		<div className="col-md-2 detail1"><h1>Detail</h1></div>
                        		<div className="col-md-5"></div>
                        		<div className="col-md-5"></div>
                            </div>}
                            <div className="row">
                            	{elem.tags && elem.tags.map((el, key) => {
									return(
		                            	<div className="col-md-5" key={key}>
			                            	 <ul>
			                            	 <li>{el.name}</li>
			                            	 </ul>
		                            	</div>
		                            )
								})}	                            
                            </div>
                            {/*<div className="row">
                            	<div className="col-md-5">
		                        	<ul>
		                        		<li>Fish Tail</li>
		                        	</ul>
                            	</div>
                            	<div className="col-md-6">
	                                <ul>
	                                	<li>More Detail</li>
	                                </ul>
                            	</div>
                            </div>*/}
                            <div className="row">
                            	<div className="rental1"><h1>Rental Period</h1></div>
                            </div>
                            {/*<div className="row">
                            	<div className="col-md-4">
                            		<label className="container">
                                      	<input type="checkbox"/>
                                  			<span className="checkmark"></span>
                                      	<h4>3 Days</h4>
                                    </label>
                            	</div>
                            	<div className="col-md-6">
                            		<label className="container">
                                      	<input type="checkbox"/>
                                  		<span className="checkmark"></span>
                                      	<h4>6 Days</h4>
                                    </label>
                            	</div>
                            </div>
                            <div className="row">
                            	<div className="col-md-12 hidden-xs hidden-sm sams">
                            		<div className="col-md-10"><h4>Occasion Date</h4></div>
                            		<div className="col-md-1 sand"><i className="fa fa-calendar sam"></i></div>
                            		<div className="col-md-1"></div>
                            	</div>
                            </div>
                            <div className="row">
                            	<div className="visible-xs sams">
                            		<div className="col-xs-10"><h4>Occasion Date</h4></div>
                            		<div className="col-xs-1 suum"><i className="fa fa-calendar sam"></i></div>
                            		<div className="col-xs-1"></div>
                            	</div>
                            </div>
                            <div className="row">
                            	<div className="visible-sm sams">
                            		<div className="col-sm-10"><h4>Occasion Date</h4></div>
                            		<div className="col-sm-1 "></div>
                            		<div className="col-sm-1 sum"><i className="fa fa-calendar sam"></i></div>
                            	</div>
                            </div>*/}
                            <div className="row">
                            	<div className="sams col-md-12 col-xs-12 col-sm-12" style={{padding: '0px'}}>
                            		{/*<div className="col-md-2">
						                <h3 style={{fontSize: '12px'}}>
						                    From
						                </h3>
						            </div>*/}
						            <div className="col-md-6">
						                  <input 
						                      required
						                      type="date" 
						                      id="from" 
						                      value={this.state.from} 
						                      onChange={this.inputHandleChange}
						                  />                
						            </div>
						            {/*<div className="col-md-2">
						                <h3 style={{fontSize: '12px'}}>
						                    To
						                </h3>
						            </div>*/}
						            <div className="col-md-6">
						                  <input 
						                      required
						                      type="date" 
						                      id="to" 
						                      value={this.state.to}
						                      onChange={this.inputHandleChange}
						                  />                
						            </div>
                            	</div>
                            </div>
                            <div className="row">
                            	<span>{this.state.msg}</span>
                            </div>
                            <br/>
                            {!this.state.booked && <div className="row">
                            	<button type="button" 
                            		className="btn bravoo"
                            		onClick={this.addToCart}
                        		>
                            		<h1>Rent Now</h1>
                        		</button>
                            </div>}
                            {this.state.booked && <div className="row">
                            	<button type="button" 
                            		className="btn booked"
                        		>
                            		<h1>Booked</h1>
                        		</button>
                            </div>}
                            <div className="visible-sm visible-xs">
                            	<Table />									
                            </div>{/*div close of visible-sm visible-xs*/}
					    </div>{/*main col-md-5 right possion div deskstop*/}
					</div>{/*main row*/}
				</div>{/*main container div*/}
			<Secondfold {...this.props}/>
	    </div>
    );

  }
}

export default Productdetailfirstfold;
