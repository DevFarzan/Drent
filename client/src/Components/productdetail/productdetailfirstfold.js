import React, { Component } from 'react';
import Header from '../home/Header';
import Headingf8 from '../home/headingf8';
import Imagescard from './productdetailimagescard';
import Table from './productdetailtable';
import Secondfold from './productdetailsecondfold';
import { CircleSizes } from '../_components/myInput';
import { Rate2 } from '../_components/myInput';
import './productdetail.css';

import { connect } from 'react-redux';
import { HttpUtils } from '../../Service/HttpUtils';
import { Link } from "react-router-dom";

class Productdetailfirstfold extends Component {
	state = {
		to: '',
		from: '',
		arr: [],
		booked: false,
		averageRate: '',
		userImage: '',
		review:''
	}

	async componentDidMount() {
		window.scrollTo(0, 0)
		let cart = await localStorage.getItem('Cart'),
			{ elem } = this.props.location.state;
		if (cart == null) {
			localStorage.setItem('Cart', JSON.stringify([]))
		} else {
			let arr = JSON.parse(cart);
			this.bookedFunc(arr, elem);
			this.setState({ arr });
		}
		this.setState({
			to: elem.bookedTo ? elem.bookedTo : '',
			from: elem.bookedFrom ? elem.bookedFrom : '',
			booked: elem.bookedFrom && elem.bookedTo ? true : false
		});
		this.getprofiledress(elem.userId);
		this.props.changingHeader('calling true');
	}

	async getprofiledress(id) {
		let data = await HttpUtils.post('getprofiledress', { userId: id });
		if (data.code && data.code == 200) {
			let profile = data.profile && data.profile[0] && data.profile[0].updatedImage && data.profile[0].updatedImage.length > 0;
			this.setState({
				userImage: profile ? data.profile[0].updatedImage : '',
				userId: id
			});
		}
	}

	bookedFunc(arr, elem) {
		arr.map((el) => {
			if (el._id === elem._id) {
				this.setState({ booked: true })
			}
		})
	}

	inputHandleChange = e => {
		const { from, to } = this.state,
			{ elem } = this.props.location.state,
			self = e.target;
		this.setState({ [e.target.id]: e.target.value }, () => {
			if ((from.length > 0 && self.value.length > 0 && self.id == 'to')) {
				this.getDifference(from, self.value, (msg) => {
					if (msg === 'show msg') {
						this.setState({ msg: "start date must be less than end date" });
					} else {
						this.getDifference(elem.from, from, (msg1) => {
							if (msg1 === 'show msg') {
								let msg = "Dress is not available before " + elem.from;
								this.setState({ msg });
							}
							else {
								this.getDifference(self.value, elem.to, (msg2) => {
									if (msg2 === 'show msg') {
										msg = "Dress is not available after " + elem.to
										this.setState({ msg });
									} else {
										this.setState({ msg: '' });
									}
								})
							}
						})
					}
				});
			} else if ((to.length > 0 && self.value.length > 0 && self.id == 'from')) {
				this.getDifference(self.value, to, (msg) => {
					if (msg === 'show msg') {
						this.setState({ msg: "start date must be less than end date" });
					} else {
						this.getDifference(elem.from, self.value, (msg1) => {
							if (msg1 === 'show msg') {
								let msg = "Dress is not available before " + elem.from;
								this.setState({ msg });
							}
							else {
								this.getDifference(self.value, elem.to, (msg2) => {
									if (msg2 === 'show msg') {
										msg = "Dress is not available after " + elem.to
										this.setState({ msg });
									} else {
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
		if (diffDays >= 0) {
			callBack();
		} else {
			callBack('show msg')
		}
	}

	addToCart = e => {
		const { elem } = this.props.location.state,
			{ from, to, arr } = this.state;
		if (this.props.user) {
			let diffDays = this.getTotalDays(from, to),
				currentObj = {
					rentDay: diffDays,
					bookedFrom: from,
					bookedTo: to,
					status: 'Booked',
					rentalStage: '',
					rentedStage: ''
				},
				obj = { ...elem, ...currentObj };
			arr.push(obj);
			this.bookedFunc(arr, elem);
			this.props.updateCart(arr);
			localStorage.setItem('Cart', JSON.stringify(arr));
			this.updateStatus(elem._id);
		} else {
			this.setState({ msg: 'You have to login first' });
			setTimeout(() => {
				this.setState({ msg: '' });
			}, 3000)
		}
	}

	getTotalDays(from, to) {
		let date1 = new Date(from),
			date2 = new Date(to),
			timeDiff = Math.abs(date2.getTime() - date1.getTime());
		return Math.ceil(timeDiff / (1000 * 3600 * 24));
	}

	async updateStatus(_id) {
		const { from, to, arr } = this.state;
		let obj = { _id, bookedFrom: from, bookedTo: to, status: 'Booked' },
			res = await HttpUtils.post('uploaddress', obj, this.props.user.token);
	}

	ratingReview = e => {
		console.log(e.length)
		let rateCount = 0;
		e.map((elem) => {
			rateCount += +elem.rentedRate
		});
		let averageRate = rateCount / e.length;
		averageRate = e.length > 0 ? averageRate : '';
		this.setState({ averageRate , review:e });
	}

	render() {
		const { elem, data } = this.props.location.state,
			{ from, to, msg, booked, userImage, userId } = this.state;
			console.log(this.state.review.length , 'ratingReview')
		return (
			<div className="App">
				<div className="">
					{/*<Header/>*/}
				</div>
				<div className="container-fluid" style={{ marginTop: '3%', paddingLeft: '5.7%', paddingRight: '5.7%' }} >
					<div className="row main_promargin">
						<div className="col-md-4 hidden-xs hidden-sm">
							<Imagescard data={elem.fileList} />
							{/*<Table />*/}
						</div>
						<div className="visible-xs visible-sm">
							<Imagescard data={elem.fileList} />
						</div>
						<div className="col-md-5">{/*/*main col-md-5 right possion div deskstop*/}
							<div className="row" style={{ marginLeft: '-5%' }}>
								<div className="col-sm-1 visible-sm"></div>
								<div className="col-lg-8 col-md-12 col-sm-7 col-xs-12">
									<div className="col-sm-12 col-lg-12 col-md-12">
										<h1 className="shelterr5">{elem.productName}</h1>
									</div>
									<div className="col-lg-5 col-md-5 col-sm-5 col-xs-7">
										<p className="trello3">${" " + elem.priceDay}</p>
									</div>

									{/*<div className="col-sm-3 col-lg-2 col-md-2 newstar">
										<i class="fas fa-star" style={{fontSize:'16px', color:'yellow'}}></i>								
										
									</div>
									<div className="col-sm-3 col-lg-2 col-md-2 newrating">
										<p style={{fontSize:'15px'}}>4.5</p>	
									</div>*/}

									<p className="col-xs-12 col-sm-12 col-md-12 col-lg-12 bookedboo">{elem.detailName}</p>

									{/*<div className="col-sm-12 col-md-12 col-lg-12 arrowleft">
										<img src="../images/arrow.png"/>
										<p
									</div>*/}





								</div>
								{/*<div className="col-md-4 col-sm-4 col-xs-6 roundnround2">
									<img src={userImage.length > 0 ? userImage : "../images/admin1.jpg"} className="bookedbook"/>
                                   
                                    <div>
                                   		<span className="" style={{fontFamily: "Qwigley", fontSize: "32px", marginLeft:'-10%'}}>{elem.userName}</span><br/>
                                    </div>
                                    <div className="roundnround3">   
                                       <Link to={`/profile/${userId}`}><span className="roundnround">View Profile</span></Link>
                                   	</div>
								</div>*/}
							</div>{/* div close*/}
							{this.state.review.length > 4 &&
							<div className="row">
								<div className="col-xs-2 col-sm-2 col-md-1 col-lg-1">
									<img src="../images/arrow.png" className="arrowleft" />
								</div>
								<Link to={`/detail`} className="scroll-to">
									<div className="col-md-11 col-lg-11 col-sm-11 col-xs-11 rats">
										<p className="arrowtext">SHOW ALL (85) RATINGS & COMMENTS</p>
									</div>
								</Link>	
							</div>
							}
							<div className="row col-md-12">
								<hr />
							</div>

							<div className="row">
								<div className="col-md-12">
									<div className="visible-sm col-sm-1"></div>
									{/*<div className="col-lg-5 col-md-5 col-sm-5 col-xs-7">
                                    	<p className="trello3">${" " + elem.priceDay}</p>
                          			</div>*/}
									{/*<div className="col-lg-4 col-md-5 col-sm-4 col-xs-6 name">
                                    	<p><span className="hello">Rental Price</span></p>
                          			</div>*/}
									<div className="col-md-2">
										{/*empty div*/}
									</div>
									<div className="col-md-3">
										{/*empty div*/}
									</div>
								</div>{/*div col-md-12 Close*/}
							</div>{/*Row Close*/}




							{/* <div className="row">
                                	<div className="col-md-12">
                                	 	<div className="col-md-6 detail">
                                	 		<h1>Description</h1>
                                	 	</div>
                                	 	<div className="col-md-6"></div>
                                	</div>
                            </div>
                    		<div className="row">
			                    	<div className="col-md-12 drn">
			                    		<p className="trend">{elem.description}</p>
		                   			</div>
				        	</div>*/}




							<div className="row">
								<div className="fly"><h1>Size Available</h1></div><br />
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
								<div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 round">
									{elem.sizes && elem.sizes.map((el, key) => {
										return (
											<span key={key} className="flu">
												<div className="col-md-3 flu1"><h5 className="aroundsize">{el}</h5></div>
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

							{/*ye commit kiya he isko mat kholna*/}
							{/*<div className="row">
  								<div className="visible-xs">
  									<div className="col-xs-0"></div>
  									{elem.sizes && elem.sizes.map((el, key) => {
  										return(
  											<span key={key}>
			                            		<div className="col-xs-2 flu"><h3 style={{fontSize:'15px'}}>{el}</h3></div>
			                            		<div className="col-xs-0"></div>
			                            	</span>
  										)
  									})}*/}
							{/*<div className="col-xs-2 flu"><h3>M</h3></div>
                            		<div className="col-xs-1"></div>
                            		<div className="col-xs-2 flu"><h3>L</h3></div>
                            		<div className="col-xs-1"></div>*/}
							{/*	</div>
                            </div>*/}
							{/*or yahan tak*/}



							{/*Sizes For SM*/}
							{/*<CircleSizes classOne="visible-sm"
				        		classTwo="col-sm-2" classThree="col-sm-2 flu"
				        		classFour="col-sm-2" classFive="col-sm-2 flu"
				        		classSix="col-sm-2" classSeven="col-sm-2 flu"
				        		classEight="col-sm-0" elementOne="S" elementTwo="M"
				        		elementThree="L"
			        		/>*/}


							{/*ye commit kiya he isko mat kholna*/}
							{/*<div className="row">
  								<div className="visible-sm">
  									<div className="col-sm-2"></div>
  									{elem.sizes && elem.sizes.map((el, key) => {
  										return(
  											<span key={key}>
			                            		<div className="col-sm-2 fluu"><h4 style={{marginTop:'15px'}}>{el}</h4></div>
			                            		<div className="col-sm-1"></div>
		                            		</span>
  										)
  									})}*/}
							{/*<div className="col-sm-2 fluu"><h3>M</h3></div>
                            		<div className="col-sm-2"></div>
                            		<div className="col-sm-2 fluu"><h3>L</h3></div>
                            		<div className="col-sm-0"></div>*/}
							{/*</div>
                            </div>*/}
							{/*or yahan tak*/}

							<div>
								<h4 className="showChart">Show size chart</h4>

								{/*<div className="col-md-4 col-sm-12 col-xs-12">
								<Table />
                    		</div>*/}

							</div>

							{/*{elem.tags.length > 0 && <div className="row">
                        		<div className="col-md-2 detail1"><h1>Detail</h1></div>
                        		<div className="col-md-5"></div>
                        		<div className="col-md-5"></div>
                            </div>}
                            <div className="row">
                            	{elem.tags && elem.tags.map((el, key) => {
									return(
		                            	<div className="col-lg-6 col-md-6 col-sm-5 col-xs-6 ulline" key={key}>
			                            	 <ul>
			                            	 <li style={{fontSize:'16px'}}>{el.name}</li>
			                            	 </ul>
		                            	</div>
		                            )
								})}
                            </div>*/}
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
							</div><br />
							<div className="row">
								<div className="col-xs-12">
									<h3 className="rental100">Available From <span className="frm_date">{elem.from}</span> To <span className="frm_date">{elem.to}</span></h3>
								</div>
							</div>


							{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ab">
                            	<div className="col-md-3col-sm-4 col-xs-3 able1">Available From</div>
                            	<div className="col-lg-3 col-md-4 col-sm-3 col-xs-4 able">{elem.from}</div>
                            	<div className="col-lg-2 col-md-3 col-sm-2 col-xs-2 able1"> To </div>
                            	<div className="col-lg-3 col-md-4 col-sm-3 col-xs-3 able">{elem.to}</div>
                            	
                            </div><br/><br/><br/><br/><br/>*/}

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

							<div className="row" style={{ margin: '0px' }}>
								<div className="sams col-md-12 col-xs-12 col-sm-12">
									{/*<div className="col-md-2">
						                <h3 style={{fontSize: '12px'}}>
						                    From
						                </h3>
						            </div>*/}
									<div className="col-md-5 col-sm-5 col-xs-6 trello1">
										<input
											required
											readOnly={booked}
											type="date"
											id="from"
											value={from}
											onChange={this.inputHandleChange}
											className="run1"
										/>
									</div>
									<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
										<h3 class="todate">
											To
						                </h3>
									</div>
									<div className="col-md-5 col-sm-5 col-xs-6 trello2">
										<input
											required
											readOnly={booked}
											type="date"
											id="to"
											value={to}
											onChange={this.inputHandleChange}
											className="run2"
										/>
									</div>
									<div className="col-md-1 col-sm-1"></div>
								</div>

							</div><br /><br /><br />
							<div className="row shelter">
								<span className="shelter2">{msg}</span>
							</div>
							<br />
							{!booked && <div className="row">
								<button type="button"
									disabled={from && to && !msg ? false : true}
									className="btn bravoo"
									style={{ opacity: '1' }}
									onClick={this.addToCart}
								>
									<h3 className="buttonsizeup"><span>Rent this dress</span></h3>
								</button>
							</div>}
							{booked && <div className="row">
								<button type="button"
									className="btn booked"
								>
									<h3 className="buttonsizeup">Rent this dress</h3>
								</button>
							</div>}
							{/*<div className="visible-sm visible-xs">
                            	<Table />
                            </div>*/}{/*div close of visible-sm visible-xs*/}

							<hr />

							<div className="row">
								<div className="col-md-12">
									<div className="col-md-6 detail">
										<h1>Description</h1>
									</div>
									<div className="col-md-6"></div>
								</div>{/*Row Col-md-12 Close*/}
								<div className="row">
									<div className="col-md-12 drn">
										<p className="trend">{elem.description}</p>
									</div>{/*Div col-md-12 Close*/}
								</div>{/*Row Close*/}
							</div>{/*Row Close*/}<br />

							<hr />

						</div>{/*main col-md-5 right possion div deskstop*/}


						<div className="col-md-3 cl_03_marg">
							<div className="col-md-5 col-sm-4 col-xs-6 roundnround2">
								<img src={userImage.length > 0 ? userImage : "../images/admin1.jpg"} className="bookedbook" />
							</div>
							<div className="col-md-7">
								<div className="row">

									<br /><span className="user_Name">{elem.userName}</span><br />

									<div className="col-sm-2 col-lg-5 col-md-5 newstar">
										<h5 className="owner">Owner</h5>
									</div>
									<div className="col-sm-4 col-lg-2 col-md-2 newstar1">
										<i class="st fas fa-star" style={{ fontSize: '16px', color: '#cb9d6c' }}></i>
									</div>
									<div className="col-md-5 col-lg-5 col-sm-5  newrating">
										<p style={{ fontSize: '15px', color: '#9b9b9b' }}>4.5/5</p>
									</div><br /><br /><br /><br />
									<div className="row">
										<div className="col-xs-2 col-sm-2 col-md-4 col-lg-4 clck_pro">
											<img src="../images/arrow.png" className="arrowleft1" />
										</div>
										<div className="col-md-8 col-lg-8 roundnround3" style={{ paddingRight: '0px' }}>
											<Link to={`/profile/${userId}`}><span className="roundnround">View Profile</span></Link>
										</div>
									</div>
								</div>
							</div>

						</div>


					</div>{/*main row*/}
				</div>{/*main container div*/}
				<Secondfold {...this.props} ratingReview={this.ratingReview} />
			</div>
		);

	}
}

function mapStateToProps(state) {
	const { user } = state.authentication;
	return {
		user
	};
}

const connectedProductdetailfirstfold = connect(mapStateToProps)(Productdetailfirstfold);
export default connectedProductdetailfirstfold;
