import '../theme/style.scss';
import 'react-toastify/dist/ReactToastify.css';
import '../theme/responsive/responsive.style.scss'

import { Outlet, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useState, lazy, Suspense } from 'react';

import MailConfirm from './Auth/forgot-password/done';
import AutoLogin from './Auth/AutoLogin/index';
import EmailVerify from './Auth/email-verify/email-verify';
import EmailVerifyDone from './Auth/email-verify/email-verify-done';
import FavouritePage from './Home/favorites';
import ForgotPassword from './Auth/forgot-password';
import { LoginPage } from './Auth/Login';
import ProductPage from './Home/product';
import React from 'react';
import ResetPasswordPage from './Auth/forgot-password/reset-password';
import SettingPage from './Home/settings';
import SignUpPage from './Auth/signup';
import { ToastContainer } from 'react-toastify';
import { User } from '../models/User';
import { isLoggedIn } from '../services/auth/auth.service';
import { profileActions } from '../store/Actions';
import { useNavigate } from 'react-router-dom';
import PrivacyPolicy from './Home/privacyPolicy';
import { datadogRum } from '@datadog/browser-rum';
import NotFound from '../views/Home/notFound/index';
import Loader from '../components/loader/loader';

// lazy loaded components
const DashboardPage = lazy(() => import('./Home/dashboard'));
const PatientPage = lazy(() => import('./Home/patient'));
const PrescriptionPage = lazy(() => import('./Home/prescriptions'));
const Detail = lazy(() => import('./Home/patient/detail'));
const RxPage = lazy(() => import('./Home/prescriptions/rx'));
const OrderPage = lazy(() => import('./Home/prescriptions/order'));
const PrescribeNow = lazy(() => import('./Home/prescribe-now'));
const ReviewOrderPage = lazy(() => import('./Home/prescribe-now/review-order'));
const OrderSubmitPage = lazy(() => import('./Home/prescribe-now/submit-order'));

// env variable
const { REACT_APP_ENV_NAME } = process.env;
const isProd = REACT_APP_ENV_NAME === 'production';

function App() {
  const dispatch = useAppDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const isLogin = useAppSelector((state) => state.profileReducer.isLogin);
  const user: User = useAppSelector((state) => state.profileReducer.user);

  const datadogInitialization = () => {
    datadogRum.init({
      applicationId: 'c0ccfe50-5bbe-4532-bc3c-e61ec9de1d20',
      clientToken: 'pub2610b42d77026b68260a791370111d91',
      site: 'datadoghq.com',
      service: 'prescriber-portal',
      env: 'Prod',
      version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input'
    });
    datadogRum.startSessionReplayRecording();
  };

  useEffect(() => {
    init();
  });

  useEffect(() => {
    if (isProd) {
      datadogInitialization();
    }
  }, []);

  useEffect(() => {
    if (isProd) {
      if (isLogin) {
        // if user is logged in
        window.Intercom('boot', {
          app_id: 'ujg9swdh',
          user_id: user?.mdId,
          email: user?.email,
          name: `${user?.firstName + user?.lastName}`
        });
      } else {
        // if user log out
        window.Intercom('shutdown');
        window.Intercom('boot', {
          app_id: 'ujg9swdh',
          custom_launcher_selector: '#custom-launcher'
        });
      }
      console.log(isProd);
    }
  }, [user, isLogin]);

  useEffect(() => {
    if (isLogin) {
      try {
        const localUser = localStorage.getItem('User');
        if (localUser) {
          const user: User = User.create(JSON.parse(localUser)) as User;
          dispatch(profileActions.setUserData({ user }));
        } else {
          localStorage.clear();
          sessionStorage.clear();
          dispatch(profileActions.setLogin(false));
        }

        setIsLoaded(true);
      } catch (err) {
        localStorage.clear();
        sessionStorage.clear();
        dispatch(profileActions.setLogin(false));
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, [isLogin, dispatch]);

  const init = () => {
    if (localStorage) {
      dispatch(profileActions.setLogin(isLoggedIn()));
    } else {
      setTimeout(() => {
        init();
      }, 100);
    }
  };

  const AuthRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
      if (isLogin) {
        navigate('/home');
      }
    });
    return <React.Fragment>{!isLogin && <Outlet />}</React.Fragment>;
  };

  const HomeRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLogin) {
        navigate('/');
      }
    });
    return <React.Fragment>{isLogin && <Outlet />}</React.Fragment>;
  };

  const HomeRedirect = () => {
    const navigate = useNavigate();
    useEffect(() => {
      if (user) navigate('/home/dashboard');
    });

    return <></>;
  };

  return isLoaded ? (
    <>
      <Routes>
        <Route path="/" element={<AuthRoutes />}>
          <Route path="" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          {/* <Route path="forgot-password/done" element={<DonePage />} /> */}
          <Route path="forgot-password/done" element={<MailConfirm />} />
          <Route path="auto-login/:token" element={<AutoLogin />} />
          {/* <Route path="email-verify" element={<EmailVerify />} /> */}
          <Route path="email-verify/*" element={<EmailVerifyDone />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/home" element={<HomeRoutes />}>
          <Route path="" element={<HomeRedirect />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="patient"
            element={
              <Suspense fallback={<Loader />}>
                <PatientPage />
              </Suspense>
            }
          />
          <Route
            path="prescriptions"
            element={
              <Suspense fallback={<Loader />}>
                <PrescriptionPage />{' '}
              </Suspense>
            }
          />
          {user.isApproved && (
            <Route>
              <Route
                path="patient/detail/:id"
                element={
                  <Suspense fallback={<Loader />}>
                    <Detail />{' '}
                  </Suspense>
                }
              />
              <Route
                path="prescriptions/rx/:id"
                element={
                  <Suspense fallback={<Loader />}>
                    <RxPage />
                  </Suspense>
                }
              />
              <Route
                path="prescriptions/order/:id"
                element={
                  <Suspense fallback={<Loader />}>
                    <OrderPage />
                  </Suspense>
                }
              />
              <Route
                path="prescribe-now"
                element={
                  <Suspense fallback={<Loader />}>
                    <PrescribeNow />{' '}
                  </Suspense>
                }
              />
              <Route
                path="prescribe-now/review-order"
                element={
                  <Suspense fallback={<Loader />}>
                    <ReviewOrderPage />
                  </Suspense>
                }
              />
              <Route
                path="prescribe-now/submit-order/:id"
                element={
                  <Suspense fallback={<Loader />}>
                    <OrderSubmitPage />
                  </Suspense>
                }
              />
            </Route>
          )}
          <Route path="settings" element={<SettingPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="favorites" element={<FavouritePage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  ) : (
    <div></div>
  );
}

export default App;
