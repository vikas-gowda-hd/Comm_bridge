import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="page-footer font-small unique-color-dark mt-5">

            <div style={{backgroundColor:'#6351ce'}}>
                <div className="container">
                    <div className="row py-4 d-flex justify-content-center align-items-center">
                        <div className="col-md-6 col-lg-5 text-center footer-text text-white">
                            Check out our <a href="https://github.com/vikas-gowda-hd/Comm_bridge.git" className='footer-link'>Github repo</a> for more information!
                        </div>
                    </div>
                </div>
            </div>

            <div className='container-fluid text-white pt-3' style={{backgroundColor:'rgba(33,37,41,1)'}}>
                <div className="container text-md-left mt-5">
                    <div className="row mt-3">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">SENSEBRIDGE NEXUS</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}}/>
                            <p className='footer-text'>A comprehensive toolkit containing various features related to Indian Sign Language.</p>
                        </div>
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">Services</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}} />
                            <p><Link to='/sensebridge-nexus/convert' className='footer-link'>Convert</Link></p>
                            <p><Link to='/sensebridge-nexus/learn-sign' className='footer-link'>Learn Sign</Link></p>
                            <p><Link to='/sensebridge-nexus/all-videos' className='footer-link'>Videos</Link></p>
                        </div>

                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase font-weight-bold">Useful links</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}} />
                            <p><Link to='/sensebridge-nexus/home' className='footer-link'>Home</Link></p>
                            <p><a href="https://github.com/vikas-gowda-hd/Comm_bridge.git" className='footer-link'>Github repo</a></p>
                        </div>

                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase font-weight-bold">Contact</h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width:'60px'}}/>
                            <p><i className="fa fa-lg fa-home me-3 ms-0"></i><span className='footer-text'> BGS College of Engineering and Technology</span></p>
                            <p><i className="fa fa-envelope me-3 ms-0"></i><span className='footer-text'> vikasgowdahd11@gmail.com </span> </p>
                            <p><i className="fa fa-envelope me-3 ms-0"></i><span className='footer-text'> selvamani.a11@gmail.com </span> </p>
                            <p><i className="fa fa-envelope me-3 ms-0"></i><span className='footer-text'> anupnraykar@gmail.com </span> </p>
                            <p><i className="fa fa-phone me-3 ms-0"></i><span className='footer-text'> + 91 7624919952 </span></p>
                            <p><i className="fa fa-phone me-3 ms-0"></i><span className='footer-text'> + 91 8088701592 </span></p>
                            <p><i className="fa fa-phone me-3 ms-0"></i><span className='footer-text'> + 91 9141748455 </span></p>
                            
                            
                        </div>
                    </div>
                </div>

                <div className="footer-copyright text-center py-3">© 2022 Copyright</div>
            </div>
            </footer>
    )
}

export default Footer