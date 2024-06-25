import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { FieldControl, FieldGroup } from 'react-reactive-form';
import { RootState, useAppDispatch, useAppSelector } from '../../../../store';
import { settingUpdateLoginPasswordHandler, settingUpdateUserProfileHandler } from '../../../../services/pages/settings/personalLoginForm';
import { personalLoginForm, personalUserForm } from '../../../../services/pages/settings/personalLoginForm';

import EmailInputIcon from '../../../../core/forms/inputs/EmailInputIcon';
import { InputPhone } from '../../../../core/forms/inputs/InputPhone';
import { InputText } from '../../../../core/forms/inputs/InputText';
import Login from '../../../../assets/icons/login.svg';
import PasswordInputIconlogin from '../../../../core/forms/inputs/PasswordInputIconlogin';
import { User } from '../../../../models/User';
import cameraPic from '../../../../assets/icons/camera.svg';
import { profileActions } from '../../../../store/Actions';
import profilePic from '../../../../assets/icons/user.svg';
import { useNavigate } from 'react-router-dom';
import Doctor from '../../../../constants/grx-api';
import { toast } from 'react-toastify';

export const UserInfo = () => {
  const user: User = useAppSelector((state: RootState) => state.profileReducer.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, [dispatch, user]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length) {
      try {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        const result = await Doctor.post(`doctor-portal/auth/upload-profile-image`, formData, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const newUser = { ...user, profileImage: { ...user.profileImage, Location: result.data.Location, small: result.data.small } };
        const duplicateUser: User = User.create({ ...newUser }, true) as User;

        dispatch(profileActions.setUserData({ user: duplicateUser as User }));
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast(error?.response?.data?.message);
        }
      }
    }
  };

  const settingLoginInfoHandler = (e: React.SyntheticEvent) => {
    settingUpdateLoginPasswordHandler(e, user);
  };

  const settingPersonalInfoHandler = async (e: React.SyntheticEvent) => {
    const check = await settingUpdateUserProfileHandler(e, user);
    if (check) {
      let { firstName, lastName, phone, email } = personalUserForm.value;
      phone = phone.replaceAll('-', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '');
      let data = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: {
          countryCode: user?.phoneNumber?.countryCode,
          areaCode: phone?.slice(0, 3),
          number: phone?.slice(3, phone.length)
        },
        email: email,
        doctor_id: user?.type === 'Staff' ? user?.activePrescriber?.accountId : user?.doctorAccountId
      };
      user.set(data, true);
      dispatch(profileActions.setUserData({ user }));
      navigate('/home/settings');
    }
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center">
          <Grid item container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={{ xs: 0, sm: 0, md: 0 }}>
            <Grid item xs={12} sm={12} md={12} lg={2} padding={{ xs: 0, sm: 0, md: 0 }} className="user_profile_alignment">
              <Box>
                <Typography className="profile" style={{ padding: '28px 0px' }}>
                  <span>Profile</span>
                </Typography>
                <Box className="card-user-profile-img" style={user?.profileImage?.small ? { background: `url('${user?.profileImage?.small}')` } : {}}>
                  <label className="camera" htmlFor="upload-button">
                    <img src={cameraPic} alt="camera" width={38} height={38} />
                  </label>
                  <input type="file" id="upload-button" style={{ display: 'none' }} onChange={handleImageChange} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={10} padding={{ xs: 0, sm: 0, md: 0 }} mt={12} pt={12}>
              <Stack className="setting_info" direction="row" gap={5} mb={4}>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <Box className="personal_details">
                    <Typography className="heading">
                      <span className="profile_icon">
                        <img src={profilePic} alt="image" width={16} />
                      </span>
                      Personal
                    </Typography>
                    <FieldGroup
                      control={personalUserForm}
                      render={() => (
                        <form>
                          <Box className="personal personal_set_top">
                            <FieldControl name="firstName" render={InputText} meta={{ label: 'First Name', name: 'firstName', value: 'firstName', helperText: 'First Name is required', placeholder: 'Please Enter First Name' }} />
                          </Box>
                          <Box className="personal">
                            <FieldControl name="lastName" render={InputText} meta={{ name: 'lastName', value: 'lastName', helperText: 'Last Name is required', label: 'Last Name', placeholder: 'Please Enter Last Name' }} />
                          </Box>
                          <Box className="personal">
                            <FieldControl name="phone" render={InputPhone} meta={{ name: 'phone', value: 'phone', helperText: 'Phone is required', label: 'Phone', placeholder: 'Please Enter Phone' }} />
                          </Box>
                          {/* <Box className="personal">
                            <FieldControl name="email" render={InputText} meta={{ name: 'email', value: 'email', helperText: 'Email is required', label: 'Email', placeholder: 'Please Enter Email' }} />
                          </Box> */}
                        </form>
                      )}
                    />
                    <Box className="personal">
                      <Button
                        className="edit_btn"
                        variant="outlined"
                        style={{ color: '#00ACBA', fontSize: '16px', fontWeight: '600', backgroundColor: '#fff', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '45px', width: '135px', textTransform: 'capitalize' }}
                        onClick={settingPersonalInfoHandler}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={6}>
                  <Box className="login_details">
                    <Typography className="heading">
                      <span className="profile_icon">
                        <img src={Login} alt="image" width={16} />
                      </span>
                      Login
                    </Typography>
                    <FieldGroup
                      control={personalLoginForm}
                      render={() => (
                        <form>
                          <Box className="personal personal_set_top">
                            <FieldControl name="username" render={EmailInputIcon} meta={{ name: 'username', value: 'username', helperText: 'Username is required', label: 'Username', placeholder: 'Please Enter Username', disabled: true }} />
                          </Box>
                          <Box className="personal">
                            <FieldControl
                              name="password"
                              render={PasswordInputIconlogin}
                              meta={{
                                name: 'password',
                                value: 'password',
                                helperText: personalLoginForm.get('password').errors?.required
                                  ? 'Password is required'
                                  : personalLoginForm.get('password').errors?.pattern
                                  ? 'Password should contain at least one uppercase letter, one lowercase letter, one digit, one special character, and should be at least 8 characters long'
                                  : '',
                                label: 'Password',
                                placeholder: 'Please Enter Password'
                              }}
                            />
                          </Box>
                        </form>
                      )}
                    />
                    <Box className="personal">
                      <Button
                        className="edit_btn"
                        variant="outlined"
                        onClick={settingLoginInfoHandler}
                        style={{ color: '#00ACBA', fontSize: '16px', fontWeight: '600', backgroundColor: '#fff', border: '1px solid #00ACBA', borderRadius: '8px', boxShadow: 'none', height: '45px', width: '135px', textTransform: 'capitalize' }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};
