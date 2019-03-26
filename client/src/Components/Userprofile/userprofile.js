import React, { Component } from 'react';
import Gallery from '../home/heading4';
import { HttpUtils } from  '../../Service/HttpUtils';
import { Rate } from '../_components/myInput';
import _ from 'underscore';
import './userprofile.css'

import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import sha1 from "sha1";
import superagent from "superagent";

class UserProfile extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	arr : [],
        	profile: [],
        	loading: true,
        	updatedImage: '',
        	email: '',
			firstName: '',
			lastName: '',
			inputHeight:'',
			weight:'',
			bustSize:'',
			bodyType:'',
			ocassionAttendMost:'',
			typicalJeanSize:'',
			bust: '',
			hips: '',
			torso: '',
			ribcage: '',
			height: '',
			userId: '',
			_id: '',
			rentals: []
        }
    }

    componentDidMount(){
    	this.fetchUserData();
    }

	async fetchUserData(){
		let id = this.props.match.params.value,
		data = await HttpUtils.post('getprofiledress', {userId: id}),
		rate = 0;
		console.log(data.orderhistory, 'orderhistoryyyyyyyyyyyyy')
		if(data.code && data.code == 200){
			let dressData = data.dress.length > 0 && data.dress.map((elem) => {
				return elem._id;
			}) 
			let historyData = [],
			rentals = data.dress.length > 0 && data.dress.filter((elem) => elem.status === 'Booked');
			data.orderhistory.length > 0 && data.orderhistory.map((elem) => {
				elem.products.map((el) => {
					if(el.userId === this.props.user._id && el.stage === 'Completed'){
						historyData.push({...el, ...{
							amount: elem.amount,
							date: elem.date,
							buyerEmail: elem.email,
							buyerName: elem.name,
							buyerId: elem.userId
						}})
					}
				});
			})
			console.log(data.dress, 'llllllllll')
			for(var el in data.profile[0]){
		        this.setState({ [el]: data.profile[0][el] })
	        }
			let orderhistory = _.flatten(historyData)
			if(dressData){
				data.review.map((elem) => {
					if(dressData.includes(elem.productId)){
						rate += +elem.rate
					}
				})
				rate = rate / data.review.length;
			}		
			if(!dressData){
				this.props.updateFooter(true)
			}	
			this.setState({ 
				arr: data.dress, 
				profile: data.profile, 
				review: rate, 
				loading: false, 
				dressData,
				orderhistory,
				userId: this.props.user._id,
				rentals
			});
		}
	}

	componentWillUnmount(){
		this.props.updateFooter(false)
	}

	onDelete = e => {
		console.log(e, 'editttttt')
	}

	handleImage = elem => {
		let { fileList } = this.state,        
        self = this,
        file = elem.target.files[0],
        reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(file);
        reader.onload = function (e) {
        	var image = new Image();
        	file.src = e.target.result;
        	self.forUpload(file);
        }
	}

	forUpload = async e => {
		let updatedImage = await this.uploadFile(e).then((result) => {
            return result.body.url
        });
        const {email, firstName, lastName, inputHeight, weight, bustSize, height, bodyType,
			ocassionAttendMost, typicalJeanSize, bust, hips, torso, ribcage, userId, _id} = this.state;
		let obj = {
			email, firstName, lastName, inputHeight, weight, bustSize, height, bodyType,
			ocassionAttendMost, typicalJeanSize, bust, hips, torso, ribcage, userId, updatedImage,
			profileId: _id
		}
        let res = await HttpUtils.post('uploadprofile', obj, this.props.user.token);
		if(res && res.code && res.code == 200){
			this.setState({ updatedImage });
			this.fetchUserData();
		}        
	}

	//--------------function for cloudnary url ---------------
    uploadFile = (files) =>{        
        const image = files,
        cloudName = 'dxk0bmtei',
        url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload',
        timestamp = Date.now()/1000,
        uploadPreset = 'toh6r3p2',
        paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+'U8W4mHcSxhKNRJ2_nT5Oz36T6BI',
        signature = sha1(paramsStr),
        params = {
            'api_key':'878178936665133',
            'timestamp':timestamp,
            'upload_preset':uploadPreset,
            'signature':signature
        };

        return new Promise((res, rej) => {
            let uploadRequest = superagent.post(url)
            uploadRequest.attach('file', image)
            Object.keys(params).forEach((key) =>{
                uploadRequest.field(key, params[key])
            })

            uploadRequest.end((err, resp) =>{
                err ? rej(err) : res(resp);
            })
        })
    }

    //-----------------cloudnary function end ------------------

	render() {
		const { profile, arr, review, dressData, orderhistory, updatedImage, rentals } = this.state,
		{ user } = this.props,
		id = this.props.match.params.value,
		userName = profile.length > 0 && profile[0].firstName.length > 0 ? profile[0].firstName : user && user.username;
		let userAvailable = false;
		if(user && user._id && user._id === id){
			userAvailable = true;
		}
		console.log(profile, arr, orderhistory, 'sab khuchhhhhh')
		return(
			<div>
					<div>
						{this.state.loading && <div class="loading">Loading&#8230;</div>}
						<div className="container" style={{marginTop:'9%'}}>
							<div className="row" style={{marginTop:'21px', marginLeft: '0px', marginRight:'0px'}}>
								<div className="col-md-5 hidden-sm hidden-xs sami">
									<img src="../images/admin1.jpg" alt="Avatar" className="image"/>
									<div className="overlay">
										<label className="custom-file-upload samiLabel" style={{margin: '150px 0px 0px 150px'}}>
											<input type="file" onChange={e => this.handleImage(e)}/>
											<i class="fas fa-camera" style={{fontSize:'20px',padding: '0 22px 0', cursor: 'pointer'}}></i><br/>
										    <h5>Add Photo</h5>
										</label>
									</div>
								</div>

								<div className="visible-sm col-sm-5 hidden-xs sami_1" style={{marginTop: '6%'}}>
									<img src="../images/admin1.jpg" alt="Avatar" className="image_1"/>
									<div className="overlay_1" style={{left: '15px', width: '100%'}}>
										<label className="custom-file-upload samiLabel_1" style={{padding: '0 36%',marginTop:'40%'}}>
											<input type="file" onChange={e => this.handleImage(e)}/>
											<i class="fas fa-camera" style={{fontSize:'20px',padding: '0 22px 0', cursor: 'pointer'}}></i><br/>
										    <h5>Add Photo</h5>
										</label>
									</div>
								</div>

								<div className="visible-xs sami_2">
									<img src="../images/admin1.jpg" alt="Avatar" className="image_2"/>
									<div className="overlay_2">
										<label className="custom-file-upload samiLabel_2" style={{margin: '10px 0',padding: '37%'}}>
											<input type="file" onChange={e => this.handleImage(e)}/>
											<i class="fas fa-camera" style={{fontSize:'20px', cursor: 'pointer'}}></i><br/>
										    <h5>Add Photo</h5>
										</label>
									</div>
								</div>

								<div className="col-md-7 col-sm-7 col-xs-12 rovil3">
									<div className="row" style={{marginRight:'0px',marginLeft: '0px'}}>
										<div className="col-md-5 hidden-sm hidden-xs" style={{paddingLeft: '0px'}}>
											<h2><span className="rovil2">{userName}</span></h2>
										</div>

										<div className="col-sm-12 visible-sm" style={{paddingLeft: '0px'}}>
											<h2><span className="rovil2">{userName}</span></h2>
										</div>

										<div className="col-xs-12 visible-xs" style={{paddingLeft: '0px'}}>
											<h2 style={{textAlign: 'center'}}><span className="rovil2">{userName}</span></h2>
										</div>

										<div className="col-md-5 hidden-sm hidden-xs rovil4">
											<Rate initialRating={this.state.review} readonly classMd="col-md-8" rate="4.5" classXS="col-md-4" />
										</div>

										<div className="col-sm-10 visible-sm rovil4">
											<Rate initialRating={this.state.review} readonly classMd="col-sm-6" rate="4.5" classXS="col-sm-2" />
										</div>

										<div className="col-xs-9 visible-xs rovil4" style={{paddingLeft: '0px'}}>
											<Rate initialRating={this.state.review} readonly classMd="col-xs-10" rate="4.5" classXS="col-xs-2" />
										</div>

										<div className="col-md-2 hidden-sm hidden-xs rovil6">
											{userAvailable && <h4>
												<Link to={{pathname: `/userdetail`, state: {goTo: 'profile', profile, arr, orderhistory }}}>
													<i className="glyphicon glyphicon-pencil pencilss">
														<p style={{fontSize: '15px', color: 'gray'}}>Edit</p>
													</i>
												</Link>
											</h4>}
										</div>

										<div className="col-sm-2 visible-sm" style={{margin: '0px 0px 0px -135px'}}>
											{userAvailable && <h4>
												<Link to={{pathname: `/userdetail`, state: {goTo: 'profile', profile, arr, orderhistory }}}>
													<i className="glyphicon glyphicon-pencil pencilss">
														<p style={{fontSize: '15px', color: 'gray'}}>Edit</p>
													</i>
												</Link>
											</h4>}
										</div>

										<div className="visible-xs rovil6" style={{paddingLeft: '0px'}}>
											{userAvailable && <h4>
												<Link to={{pathname: `/userdetail`, state: {goTo: 'profile', profile, arr, orderhistory }}}>
													<i className="glyphicon glyphicon-pencil pencilss">
														<p style={{fontSize: '15px', color: 'gray'}}>Edit</p>
													</i>
												</Link>
											</h4>}
										</div>
									</div>

									<div className="rovil1" style={{paddingLeft: '0px'}}>
										<h4>London</h4>
									</div>

									<div className="rovil1" style={{paddingLeft: '0px'}}>
										<h4><span className="rovil7">Bio</span></h4>
									</div>

									<div className="col-md-12" style={{paddingLeft: '0px'}}>
										<h4>Working as a Designer want to rent every thing which is in my wardrobe.</h4>
									</div>

									<div>
										<div className="col-md-7 col-sm-8" style={{paddingLeft: '0px'}}>
											<h4>member since 2019-04-18</h4>
										</div>
										<div className="col-md-5 col-sm-4" style={{paddingLeft: '0px'}}>
											<h4>Size Wear :M</h4>
										</div>
									</div>

									{/*<div className="row">
										<div>
										<h4>Rent Till 5 Date</h4>
										</div>
									</div>*/}
								</div>
							</div>



							<div className="row" style={{marginLeft: '0px', marginRight: '0px'}}>
								<div className="col-md-3 col-sm-3"></div>

								<div className="col-md-2 col-sm-2">
									<h3 style={{color: '#c2073f'}}>Rentals</h3>
								</div>

								<div className="col-md-2 col-sm-2">
									<h3 style={{color: '#c2073f'}}>Rented</h3>
								</div>

								<div className="col-md-2 col-sm-2">
									<Link to={{pathname: `/userdetail`, state: {goTo: 'currentRentals', rentals, orderhistory }}}>
										<h3 style={{color: '#c2073f'}}>Orders</h3>
									</Link>
								</div>

								<div className="col-md-3 col-sm-3"></div>
							</div>

							<hr style={{border: '1px solid #c2073f'}}/>

							<div className="row">
								<div className="col-md-10 col-sm-9 col-xs-6"></div>
								
								<div className="col-md-2 hidden-sm hidden-xs">&emsp;&emsp;&nbsp;
									
									<div class="dropdown">
									    <button class="btn dropdown-toggle" type="button" data-toggle="dropdown"
									      style={{background: '#ffffff', color: '#c2073f', borderRadius: '0', border: '1px solid #c2073f'}}>SORT BY &emsp;
									      <span class="caret"></span></button>

									    <ul class="dropdown-menu">
									    	<li><a href="#">HTML</a></li>
									    	<li><a href="#">CSS</a></li>
									    	<li><a href="#">JavaScript</a></li>
									    </ul>
									</div>

									
								</div>

								<div className="visible-sm col-sm-3">&emsp;&emsp;
									<div className="dropdown">
									    <button class="btn dropdown-toggle" type="button" data-toggle="dropdown"
									      style={{background: '#ffffff', color: '#c2073f', borderRadius: '0', border: '1px solid #c2073f'}}>SORT BY &emsp;
									      <span class="caret"></span></button>

									    <ul class="dropdown-menu">
									    	<li><a href="#">HTML</a></li>
									    	<li><a href="#">CSS</a></li>
									    	<li><a href="#">JavaScript</a></li>
									    </ul>
									</div>
								</div>

								<div className="col-xs-6 visible-xs">
									<div class="dropdown">
									    <button class="btn dropdown-toggle" type="button" data-toggle="dropdown"
									      style={{background: '#ffffff', color: '#c2073f', borderRadius: '0', border: '1px solid #c2073f'}}>SORT BY &emsp;
									      <span class="caret"></span></button>

									    <ul class="dropdown-menu">
									    	<li><a href="#">HTML</a></li>
									    	<li><a href="#">CSS</a></li>
									    	<li><a href="#">JavaScript</a></li>
									    </ul>
									</div>
								</div>

								

							</div>

							<div className="row">
								<div className="col-md-4"></div>

								<div className="col-md-4">
									<h3 style={{textAlign: 'center',color: '#c2073f'}}>Comments & Views</h3>
								</div>

								<div className="col-md-4"></div>
							</div>
							<hr style={{border: '1px solid #c2073f'}}/>
						</div>

						<div className="row" style={{margin:'0px'}}>
							{/*<div className="col-md-6"><h2>GALLERY</h2></div>*/}
							{dressData && <Gallery
								label='Gallery'
								showEditDelete={true}
								onDelete={this.onDelete}
								data={arr}
								profile={profile}
								orderhistory={orderhistory}
								userAvailable={userAvailable}
							/>}
							{!dressData && <div style={{textAlign: 'center'}}>not uploaded any dress</div>}
						</div>
					</div>
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

const connectedUserProfile = connect(mapStateToProps)(UserProfile);
export default connectedUserProfile;
