import React from 'react';
import { AppBar, Box, Container, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const router = useNavigate();

  const handlePrivacyPolicy = () => {
    window.open('/home/privacy-policy', '_blank');
  };
  const handleHIPAAPolicy = () => {
    window.open('/IMMY-Notice-of-Privacy-Practices-HIPAA.pdf', '_blank');
  };
  return (
    <Box className="footer">
      <Container className="footerContainer" maxWidth="xl">
        <Box className="footer_desc">
          <Typography className="footer_desc_text">
            *For professional use only. ImprimisRx® Pharmacy specializes in customizing medications to meet unique patient and practitioner needs. No compounded medication is reviewed by the FDA for safety or efficacy. <br />
            ImprimisRx® does not compound copies of commercially available products. References available upon request. <br />
            †Only available on new prescriptions. Cannot be combined with other discounts. Automatic refill set up is required. Months supply can vary based on the dosing regimen prescribed by the doctor. <br />
            Full details of program eligibility are available by contacting ImprimisRx.
          </Typography>
        </Box>
        <Box className="footer_Copyright">
          <Typography className="footer_Copyright_text">Copyright© 2023 Harrow Health, Inc. All rights reserved.</Typography>
        </Box>
        {/* <!-- OneTrust Cookies Settings button start --> */}
        {/* <button id="ot-sdk-btn" className="ot-sdk-show-settings">
          Cookie Settings
        </button> */}
        {/* <!-- OneTrust Cookies Settings button end --> */}
        {/* <!-- OneTrust Cookies List start --> */}
        {/* <div id="ot-sdk-cookie-policy"></div> */}
        {/* <!-- OneTrust Cookies List end --> */}

        <Box>
          <Typography className="footer_privacy">
            <ul className="footer_privacy_list">
              <li onClick={handlePrivacyPolicy}>Privacy Policy</li>
              <span>|</span>
              <li onClick={handleHIPAAPolicy}>HIPAA Policy</li>
              {/* <span>|</span>
              <li>Cookie Policy</li>
              <span>|</span>
              <li>Social Media Policy</li>
              <span>|</span>
              <li>Terms and Conditions</li> */}
            </ul>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
