import { Stack, Box, Container, Typography } from '@mui/material';
import React from 'react';
import Header from '../../../components/header/header';
import Footer from '../../../components/footer/footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Stack component="main" className="default-layout">
        <Header />
        <Box className="privacy-policy-page">
          <Container maxWidth="xl">
            <Stack className="main-content-wrap">
              <Box className="privacy-policy-page-container">
                <Box>
                  <Typography component="h3" variant="h3" className="privacy-heading">
                    Privacy Policy
                    <p></p>
                  </Typography>
                </Box>
                <br />
                <br />
                <Box>
                  <Typography className="privacy-sub-heading">Effective Date: May 20, 2019</Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    This Privacy Policy <span className="privacy-sub-heading">(“Policy”) </span>describes the data collected <span className="privacy-sub-heading">(“Collected Data”)</span> by or on behalf of Harrow Health, Inc.{' '}
                    <span className="privacy-sub-heading">(“ImprimisRx,” “we,” “us,” or “our”)</span> and its vendors through this website <span className="privacy-sub-heading">(“Site”)</span>, and how Collected Data is used and shared. If you have questions or concerns about this Policy, please
                    contact us.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-sub-heading">
                    By using the Site or placing any order, you agree on behalf of yourself and any organization that you represent (together, “you”) that you have read and understand this Policy. We may modify this Policy at any time. All changes will be effective immediately upon posting to the
                    Site. Material changes will be conspicuously posted on the Site or otherwise communicated to you. By using the Site after changes are posted, you agree to those changes.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    We Collect Data You Provide
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Protected Health Information.</span> To the extent that Collected Data is Protected Health Information (<span className="privacy-sub-heading">“PHI”</span>) as that term is defined under the Health Insurance Portability and Accountability Act
                    of 1996 and any regulations promulgated thereunder (<span className="privacy-sub-heading">“HIPAA”</span>), that data is governed by ImprimisRx’s HIPAA Privacy Policy, and not this Privacy Policy. Unless specifically stated otherwise, references to Collected Data in this Privacy
                    Policy do not include PHI. We protect PHI and will only use or disclose it as required or permitted by applicable federal and state laws, including HIPAA, and in accordance with any contractual obligations that we may have with your health care provider. It may be necessary for
                    us to share PHI with third parties, including vendors that we engage to provide services in connection with the Site. If we share PHI with any third party, we will share only the minimum necessary data to enable the third party to provide the services for which we have engaged
                    them, and we will ensure that third party agrees to use and disclose PHI only as required or permitted by applicable federal and state laws, including HIPAA. For additional information about how we may use or disclose your PHI and your associated rights, please refer to our HIPAA
                    Privacy Policy.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Personal Information.</span> If you elect to provide information that personally identifies you (<span className="privacy-sub-heading">“Personal Information”</span>) such as your name, email, mailing address, phone number, or payment data, we
                    will collect, use, and share it pursuant to this Policy and applicable law.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    Personal Information is required to use certain Site features, for example, to create online accounts, purchase products or services, contact us via email, phone, or our Contact Us form (where we may retain your message’s content and our response), submit job application
                    materials, receive or request data from us (e.g., newsletters or order status), and respond to communications from us (e.g., surveys and promotional offers).
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Order & Payment Data.</span> To make purchases through the Site, you must submit your name, credit or debit card type, number, expiration date, security code, and billing address. All credit and debit card data is provided directly to our
                    PCI-compliant third-party payment processor. We do not directly access, handle, or store your credit or debit card data. We may keep a record of your purchases. We store your payment card’s last four digits and tie that data to your account to facilitate future orders.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Marketing Communications; Opt Out.</span> To subscribe to our email newsletter, you must (1) identify yourself as a patient, healthcare provider, payor, potential investor, or other, (2) note if you are interested in ophthalmology, optometry,
                    integrative medicine, or other, (3) submit your email address, and (4) check the box that you would like to subscribe to the email newsletter. To request marketing materials, you must submit your name, clinic/surgery center name, email address, phone number, and mailing address.
                    We use this data to send you promotional and other electronic and hardcopy communications. We may use third-party providers to deliver communications to you. You may opt out of such emails by using the unsubscribe link in the email or contacting us at info@imprimisrx.com with
                    “Unsubscribe” in the subject line. To opt out of other communications (e.g., postal marketing and telemarketing), please contact us. Opting out of marketing communications does not opt you out of communications about your account or transactions.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Job Application Materials.</span> To submit job application materials, you will be redirected to our online job applications portal, which is hosted by ADP. All data related to job applications is submitted directly to ADP and will be shared
                    with us. We encourage you to review ADP’s terms and privacy policy. If you submit job application materials, we may use the contents to evaluate your qualifications and respond to you. Submission of materials does not require us to review them or consider you for employment.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Data Automatically Collected
                  </Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Account Activity.</span> We will collect data about how you use (i) your online account, and (ii) the Site when you are logged into your account.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading"> IP Addresses, Cookies, & Similar Tracking Technologies.</span> When you use the Site, we and our Site vendors use technologies such as cookies (i.e., small pieces of data stored on your device’s hard drive by your browser), web beacons,
                    pixel tags, and similar technologies to automatically collect internet protocol addresses assigned to the computers and other devices you use, your internet service provider, device ID number, approximate geographic location, browser type, Site pages visited, websites you access
                    before and after visiting the Site, and data related to how and when you use the Site (e.g., date and time stamps, clickstream data, and data about search terms and websites that direct you to the Site). We may combine this Collected Data with other Collected Data (including
                    Personal Information) and data obtained from third parties.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    The Site may use session, persistent, and flash cookies (local stored objects) to collect and store data about your preferences and navigation to, from, and on our Site. Session cookies are used to complete transactions and for other purposes such as counting visits to certain
                    webpages. Session cookies are eliminated when you exit your browser. Persistent cookies may be stored on your computer by your browser. When you log in, persistent cookies tell us if you have visited the Site before or if you are a new visitor. Flash cookies differ from browser
                    cookies regarding the amount and types of data collected and how the data is stored. Cookie management tools provided by your browser will not remove and cannot manage Flash cookies. To learn about managing your Flash cookie settings, visit the Flash player settings page on
                    Adobe’s website here.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">Most browsers automatically accept cookies. You can disable this function, but disabling cookies may impact your use and enjoyment of the Site.</Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Analytics.</span> We may occasionally enable and implement various analytics tools, such as Google Analytics, which is an analytics tool provided by Google to collect and process Collected Data consisting of certain telematics about your use
                    of the Site. Google sets and reads cookies to collect such Collected Data and your web browser will automatically send such Collected Data to Google. Google uses this data to provide us with reports that we use to improve the Site’s structure and content.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    We may occasionally enable and implement additional add-on services to Google Analytics, such as Demographics and Interest Reporting. Demographics and Interest Reporting uses cookies to collect data about our Site traffic by tracking users across websites and across time to
                    provide us with analytics on our user base.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    To learn more about how Google uses data, visit Google’s Privacy Policy and Google’s page on “How Google uses data when you use our partners’ sites or apps.” You may download and install the Google Analytics Opt-out Browser Add-on for each web browser you use. Using the Google
                    Analytics Opt-out Browser Add-on does not prevent the use of other analytics tools. To learn more about Google Analytics cookies, visit Google Analytics Cookie Usage on Websites.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Social Media.</span> We are active on social media, including Facebook, Twitter, YouTube, and LinkedIn (“Social Media”). You may comment on Social Media regarding ImprimisRx and our products and services.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    Anything you post on Social Media is public information and will not be treated confidentially. We may post (or re-post) on the Site and our Social Media pages any comments or content that you post on our Social Media pages.
                    <span className="privacy-sub-heading"> You agree to hold ImprimisRx and its affiliates harmless and without liability for the results of any and all content you post on ImprimisRx’s Social Media.</span>
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">Your use of Social Media is governed by the privacy policies and terms of the third parties that own and operate those websites and not by this Policy. We encourage you to review those policies and terms.</Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    The Site may use advertising networks and services offered by Social Media to deliver advertising content. Use of these services requires Social Media to implement cookies or pixel tags to deliver ads to you while you access the Site.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Videos; Embedded Content.</span> The Site may contain videos and embedded content provided by ImprimisRx or third parties, including visible content and/or feeds scripts embedded in the Site’s code. ImprimisRx and such third parties may
                    collect data about how you interact with such content. By watching the videos and interacting with such content, you agree to the collection and use of such data.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading"> Data from Other Sources.</span> We may obtain data about individuals from various third-party companies and public sources and we may combine that data with Collected Data. This enhances our existing data about our users and customers (e.g.,
                    adding address data) and improves our marketing efforts.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    How We Use & Share Collected Data
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    Beyond the uses and sharing described above, ImprimisRx and its vendors may use and share Collected Data (including Personal Information) as described below. We do not sell or rent Collected Data except as stated in this Policy and as permitted by applicable law.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Purpose Collected & Communication with You.</span> We use and share Collected Data for the purpose for which it was collected. For example, if you place an order through the Site, we use Collected Data to communicate with you regarding your
                    order. If you contact us for support or assistance, we may use Collected Data to contact you and assist you with your request. We may use Collected Data to notify you of Site changes (e.g., changes to our Terms of Use or this Policy), and if you opt in, to send you marketing
                    communications.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Affiliates, Vendors, & Other Partners.</span> We may share Collected Data with our affiliates, third-party vendors, service providers, suppliers, consultants, agents, distributors, and other partners (including Site management and hosting,
                    payment processing, online storefronts, marketing and public relations, communications providers, and email services) that provide data processing services to us (e.g., to support the delivery of, provide functionality on, or help to enhance the security of the Site or our
                    products and services) or otherwise process Collected Data for purposes described in this Policy or communicated to you when we collect such data. The parties described in this paragraph are authorized and may use and disclose Collected Data as needed to provide the applicable
                    services to us and as provided by their own privacy policies.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Detection and Prevention of Fraud.</span> We may use Collected Data and share it with third party vendors to help detect and prevent potential fraudulent transactions.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading"> Aggregated Data</span> We may use Collected Data to create anonymous aggregate data. We may use and share such aggregate data with our affiliates, vendors, and other third parties to: (1) analyze, develop, and improve the content, products,
                    and services that we make available, (2) inform business strategies, (3) understand the Site’s demographics and user preferences, (4) customize promotional emails and users’ Site experience, and (5) for other lawful purposes.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    Security & Protection of Rights. We may use Collected Data and share it with third parties if we believe it is needed to operate the Site or to protect our rights or the rights of others, including sharing data needed to identify, contact, or bring legal action if our contracts,
                    terms, or policies are violated or if required by law.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">Business Transactions.</span> All Collected Data is exclusively our property. If we undergo a change or contemplated change in control, acquisition, merger, reorganization, or asset sale, all Collected Data may be transferred, sold, shared,
                    or otherwise shared with potential and actual successors, which will be bound by this Policy as it applies to Collected Data.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <span className="privacy-sub-heading">With Your Consent.</span> With your consent, we may use or share Collected Data in ways not specifically described in this Policy.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Children
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    We are committed to protecting children’s privacy. The Site is not directed at children under 13 years of age. We do not knowingly collect, use, or share data from children under 13. If a parent or legal guardian learns their child provided us with Personal Information without
                    his or her consent, please contact us.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Data Security
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    We use commercially reasonable technical and organizational measures to help secure all Collected Data against loss, misuse, and alteration. While we cannot guarantee it, we use industry-standard protections to help safeguard against such occurrences. If a breach of our systems
                    occurs, we will notify you of the breach only if and as required under applicable law.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    You understand that no data transmission over the internet or a mobile device can be guaranteed to be 100% secure. While we strive to protect your Personal Information, we do not guarantee the security of Personal Information and you provide Personal Information at your own risk.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Access from Outside the United States
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    This Site is operated and maintained by Imprimis Pharmaceuticals, Inc. from the United States and is intended solely for a United States audience. If you access the Site from outside the United States, please be aware that Collected Data will be transferred to, stored in, and
                    processed in the United States. U.S. data protection and related laws may not be as comprehensive as those from where you access the Site.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Third-Party Websites
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    The Site may link to, or be linked to, websites not controlled by us. We are not responsible for third-parties’ privacy policies or practices. This Policy does not apply to any third-party websites or to any data that you provide to third parties. You should read the privacy
                    policy for each website that you visit.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Access & Update Your Personal Information
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">To access or update your Personal Information as it exists in our records, please visit any accounts you have created (if applicable) or contact us using the information below.</Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Contact Us
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">If you have questions or concerns regarding this Policy, contact us at:</Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    ImprimisRx Corporate Headquarters <br /> 12264 El Camino Real, Suite 350 <br /> San Diego, CA 92130 <br /> Phone: 844.446.6979 <br /> Fax: 858.345.1745 <br />
                    info@imprimisrx.com
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading" style={{ textAlign: 'center' }}>
                    California Consumer Privacy Act (CCPA) Privacy Notice
                  </Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading"> Effective Date: August 19, 2020</span>
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    If you are a California consumer, the information in this Privacy Notice, along with our general website privacy policy, applies to you. Certain terms used in this Privacy Notice have the meanings given to them in the California Consumer Privacy Act (“CCPA”) found at California
                    Civil Code § 1798.100 et seq. The purpose of this Privacy Notice is to provide California consumers with a comprehensive description of our online and off-line practices regarding the collection, use, disclosure, and sale of personal information and the rights of California
                    consumers regarding their personal information.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    The CCPA defines “personal information” to mean information that identifies, relates to, describes, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or household. Personal information does not include
                    information that is publicly available, deidentified, or aggregate information. For purposes of this Privacy Notice we will refer to this information as “personal information.”
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Personal Information We Collect
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">During the 12-month period prior to the effective date of this Privacy Notice we may have collected and may presently collect the following categories of personal information about California consumers:</Typography>
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading"> Personal Identifiers</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">name, postal address, email address, or date of birth</Typography>
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading"> Related Identifiers</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">telephone number, last four digits of credit card number, last four digits of debit card number, medical information, or health insurance information</Typography>
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading"> Employment Information</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">occupation, title, or licenses</Typography>
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Education Information</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">degree or school</Typography>
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Commercial Information</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">records of health care products purchased, obtained, or considered, or other purchasing or consuming histories or tendencies</Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    How We Collect Your Personal Information
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">During the 12-month period prior to the effective date of this Privacy Notice we may have collected and may presently collect personal information about California consumers from the following categories of sources:</Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Interactions With Consumer</span>
                  </Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Interactions with Our Health Care Affiliates, Vendors, and Other Partners</span>
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Why We Collect Your Personal Information
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    For purposes of this Privacy Notice a “business purpose” means the use of personal information for our operational purposes and “commercial purposes” means to advance a person’s commercial or economic interests such as by inducing a person to buy, rent, lease, join, subscribe to,
                    provide, or exchange products, goods or services, or enabling or affecting, directly or indirectly, a commercial transaction.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    During the 12-month period prior to the effective date of this Privacy Notice we may have collected and may presently collect personal information about California consumers for the following health care business and commercial purposes:
                  </Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Performing Health Care Services</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">Maintaining or servicing health care accounts, providing customer service, processing or fulfilling prescription orders and transactions, verifying customer information, or processing payments</Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Performing Hiring Activities</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">vetting candidates for positions with the company</Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Site Administration</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">site security such as detecting security incidents, protecting against malicious, deceptive, fraudulent, or illegal activity, and prosecuting those responsible for that activity</Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    With Whom We Sell and Disclose Your Personal Information
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">We do not sell personal information.</Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    During the 12-month period prior to the effective date of this Privacy Notice we may have disclosed for health care business or commercial purposes the following categories of personal information about California consumers to the following categories of third parties:
                  </Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Personal Information</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">Personal Identifiers, Related Identifiers, Employment Information, Education Information, or Commercial Information</Typography>
                  <br />
                  <br />
                  <Typography>
                    <span className="privacy-sub-heading">Third Parties</span>
                  </Typography>
                  <br />
                  <Typography className="privacy-paragraph">Health Care Affiliates, Vendors, and Other Partners</Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Right to Request Disclosure
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    A California consumer has the right to request that a business disclose what personal information it collects, uses, discloses, and sells. Using a method from the Contact Information section below, you may submit a request to know:
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    <ul>
                      <li>The specific pieces information we collect about you</li>
                      <li>The categories of personal information we collected about you</li>
                      <li>The categories of sources from which we collected the personal information</li>
                      <li>The business or commercial purposes for which we collected or sold the personal information</li>
                      <li>The categories of third parties with whom we sold or disclosed personal information</li>
                      <li> The categories of personal information about you that we sold or disclosed for a business purpose</li>
                    </ul>
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    For security purposes we will verify your identity prior to providing any personal information about you or the personal information we collected, disclosed, or sold using a variety of methods including, but not limited to, by sending you an email to confirm your request and
                    asking you for additional information such as your last order amount, customer number, or other identifying information appropriate for verification.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Right to Request Deletion
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    A California consumer has the right to request (not more than twice in any 12-month period) that their personal information collected or maintained by a business be deleted. Using a method from the Contact Information section below, you may submit a request for us to delete
                    personal information we have collected or maintain about you.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    For security purposes we will confirm your request and verify your identity prior to deleting any personal information about you using a variety of methods including, but not limited to, by sending you an email to confirm your request and asking you for additional information
                    such as your last order amount, customer number, or other identifying information appropriate for verification.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    However, notwithstanding a verifiable request for deletion, we may retain certain personal information necessary for us to complete a transaction, provide a product or service, perform a contract, detect and protect against security incidents and malicious, deceptive, fraudulent
                    or illegal activity, or prosecute those responsible, debug to identify and repair errors that impair functionality, enable solely internal uses, and to comply with legal obligations, record retention, and back-up practices, or for other lawful purposes.
                  </Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Right to Non-Discrimination for Exercise of Privacy Rights
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    Businesses cannot discriminate against California consumers if they exercise any of the rights provided in the CCPA. This means that businesses cannot deny goods or services to that California consumer, charge different prices or rates for goods or services, including through the
                    use of discounts or other benefits or imposing penalties, provide a different level or quality of goods or services to the California consumer, or suggest that the California consumer will receive a different price or rate for goods or services or a different level or quality of
                    goods or services. However, a business is permitted to charge a California consumer a different price or rate, or provide a different level or quality of goods or services, if that difference is reasonably related to the value provided to the business by the individual’s data.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">We will not deny, charge different prices for, or provide a different level or quality of goods or services if you choose to exercise these rights or live in California.</Typography>
                  <br />
                  <br />
                </Box>
                <Box>
                  <Typography component="h6" variant="h6" className="privacy-side-heading">
                    Contact Information
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    To submit a Request for Disclosure, Request for Deletion, or to contact us with questions or concerns about this Privacy Notice, you may contact us using the related web form here or by chatting with us on our website. To help protect your privacy and maintain security, we take
                    steps to verify your identity before granting you access to your personal information or complying with your request.
                  </Typography>
                  <br />
                  <br />
                  <Typography className="privacy-paragraph">
                    If you use an authorized agent to submit a Request for Disclosure or a Request for Deletion, you will need to provide that authorized agent with written permission to do so and submit written proof to us that the agent has been authorized to act on your behalf.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Stack>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
