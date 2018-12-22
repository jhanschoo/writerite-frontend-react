import React, { Component, SyntheticEvent } from 'react';

import { Mutation, MutationFn, OperationVariables } from 'react-apollo';
import gql from 'graphql-tag';

import { connect } from 'react-redux';

import { withRouter, RouteComponentProps } from 'react-router';

import {
  Field, Formik, FormikProps, FormikErrors, FormikTouched,
} from 'formik';
import * as yup from 'yup';

import {
  Divider, Segment, Form, Input, Label, Container,
} from 'semantic-ui-react';

import { restartWsConnection } from '../apolloClient';
import { OptionalSigninData, SigninAction, createSignin } from './actions';
import { WrState } from '../store';

declare var gapiDeferred: Promise<any>;
declare var grecaptchaDeferred: Promise<any>;
declare var FBDeferred: Promise<any>;

type OwnProps = object;

interface DispatchProps {
  createSignin: (data: OptionalSigninData) => SigninAction;
}

type StateProps = object;

type Props = StateProps & DispatchProps & OwnProps & RouteComponentProps;

const SIGNIN = gql`
mutation Signin(
  $email: String!
  $token: String!
  $authorizer: String!
  $identifier: String!
  ) {
  signin(
    email: $email
    token: $token
    authorizer: $authorizer
    identifier: $identifier
    persist: false
  ) {
    user {
      id
      email
      roles
    }
    token
  }
}
`;

const handleGoogleSignin = (
  mutate: MutationFn<any, OperationVariables>,
) => async (_event: SyntheticEvent, _data: {}): Promise<null> => {
  const googleAuth = (await gapiDeferred).auth2.getAuthInstance();
  googleAuth.signIn().then((googleUser: any) => {
    mutate({
      variables: {
        email: googleUser.getBasicProfile().getEmail(),
        token: googleUser.getAuthResponse().id_token,
        authorizer: 'GOOGLE',
        identifier: googleUser.getId(),
      },
    });
  });
  return null;
};

const handleFacebookSignin = (
  mutate: MutationFn<any, OperationVariables>,
) => async (_event: SyntheticEvent, _data: {}): Promise<null> => {
  (await FBDeferred).login(async (loginResponse: any) => {
    const { authResponse } = loginResponse;
    if (authResponse) {
      (await FBDeferred).api('/me', {
        fields: 'name,email',
      }, (apiResponse: any) => {
        mutate({
          variables: {
            email: apiResponse.email,
            token: authResponse.accessToken,
            authorizer: 'FACEBOOK',
            identifier: authResponse.userID,
          },
        });
      });
    }
  }, {
      scope: 'public_profile,email',
    });
  return null;
};

const handleLocalSignin = (
  mutate: MutationFn<any, OperationVariables>,
) => (values: FormValues) => {
  mutate({
    variables: {
      email: values.email,
      token: values.recaptcha,
      authorizer: 'LOCAL',
      identifier: values.password,
    },
  });
  return null;
};

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  isSignin: boolean;
}

const formSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup.string()
    .required('Password is required')
    .when('isSignin', {
      is: true,
      then: yup.string()
        .oneOf([yup.ref('confirmPassword')], 'Passwords do not match'),
    }),
  confirmPassword: yup.string(),
  recaptcha: yup.string()
    .when('isSignin', {
      is: true,
      then: yup.string()
        .required('Please verify that you are human'),
    }),
  isSignin: yup.boolean(),
});

const formInitialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  recaptcha: '',
  isSignin: true,
};

class WrSignin extends Component<Props> {

  public state = {
    isSignin: formInitialValues.isSignin,
  };

  public componentDidMount = () => {
    this.renderReCaptcha();
  }

  public render = () => {
    const { isSignin } = this.state;
    const { handleSigninSuccess, toggleSignin } = this;
    const renderFormFragment = (
      mutate: MutationFn<any, OperationVariables>,
    ) => (props: FormikProps<FormValues>) => {
      const {
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldTouched,
        setFieldValue,
        values,
        errors,
        touched,
      } = props;
      this.recaptchaCallback = (gRecaptchaResponse: string) => {
        setFieldTouched('recaptcha');
        setFieldValue('recaptcha', gRecaptchaResponse || '');
        return null;
      };
      const showError = (
        key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
      ) => !!(touched[key] && errors[key]);
      const passwordShowError = () => {
        return !!(touched.password && touched.confirmPassword && (
          errors.password || errors.confirmPassword
        ));
      };
      const maybeError = (
        key: keyof FormikErrors<FormValues> & keyof FormikTouched<FormValues>,
      ) => showError(key) && (
        <Label basic={true} color="red" pointing={true}>
          {errors[key]}
        </Label>
      );
      const passwordMaybeError = () => passwordShowError() && (
        <Label basic={true} color="red" pointing={true}>
          {errors.password || errors.confirmPassword}
        </Label>
      );
      return (
        <Form onSubmit={handleSubmit}>
          <Form.Button type="button" color="google plus" fluid={true} onClick={handleGoogleSignin(mutate)}>
            Sign in with Google
          </Form.Button>
          <Form.Button type="button" color="facebook" fluid={true} onClick={handleFacebookSignin(mutate)}>
            Sign in with Facebook
          </Form.Button>
          <Divider horizontal={true}>or</Divider>
          <Form.Field error={showError('email')}>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              name="email"
              placeholder="Email"
              fluid={true}
            />
            {maybeError('email')}
          </Form.Field>
          <Form.Field error={passwordShowError()}>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
              name="password"
              placeholder="Password"
              fluid={true}
            />
            {passwordMaybeError()}
          </Form.Field>
          <Form.Field
            error={passwordShowError()}
            style={isSignin ? null : { display: 'none' }}
          >
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password (required for new users)"
              fluid={true}
            />
          </Form.Field>
          <Form.Field
            error={showError('recaptcha')}
            style={isSignin ? null : { display: 'none' }}
          >
            <Container text={true} textAlign="center" fluid={true}>
              <div id="g-recaptcha" style={{ display: 'inline-block' }} />
              {maybeError('recaptcha')}
            </Container>
          </Form.Field>
          <Form.Button type="submit" fluid={true} primary={true}>
            {isSignin ? 'Sign in with Password' : 'Login with Password'}
          </Form.Button>
          <div>
            <p>
              {isSignin ? 'Existing user? ' : 'New user? '}
              <a href="#" onClick={toggleSignin(props)}>
                {isSignin ? 'Login' : 'Sign in'}
              </a>
            </p>
          </div>
        </Form>
      );
    };
    const signinChild = (
      mutate: MutationFn<any, OperationVariables>,
    ) => {
      return (
        <Formik
          initialValues={formInitialValues}
          onSubmit={handleLocalSignin(mutate)}
          validationSchema={formSchema}
        >
          {renderFormFragment(mutate)}
        </Formik>
      );
    };
    return (
      <Segment>
        <Mutation
          mutation={SIGNIN}
          onCompleted={handleSigninSuccess}
        >
          {signinChild}
        </Mutation>
      </Segment>
    );
  }

  private toggleSignin = (
    { setFieldTouched, setFieldValue }: FormikProps<FormValues>,
  ) => {
    return (event: SyntheticEvent) => {
      const { isSignin } = this.state;
      const { setState } = this;
      const newIsSignin = !isSignin;
      event.preventDefault();
      // note that setState is async
      setState(Object.assign({}, this.state, {
        isSignin: newIsSignin,
      }));
      setFieldTouched('isSignin');
      setFieldValue('isSignin', newIsSignin);
    };
  }

  private recaptchaCallback = (gRecaptchaResponse: string): null => null;

  private renderReCaptcha = () => {
    if (grecaptchaDeferred) {
      grecaptchaDeferred.then((grecaptcha) => {
        grecaptcha.render('g-recaptcha', {
          sitekey: '6Lc2V3IUAAAAAFP-EiNvhlN533lN7F8TqJCEJmqX',
          callback: this.recaptchaCallback,
        });
      });
    }
  }

  private handleSigninSuccess = ({ signin }: { signin: any }) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { createSignin, history } = this.props;
    createSignin(signin);
    if (signin) {
      restartWsConnection();
      history.push('/dashboard');
    }
  }
}

const mapStateToProps = null;

const mapDispatchToProps: DispatchProps = {
  createSignin,
};

export default withRouter<OwnProps & RouteComponentProps>(
  connect<
    StateProps, DispatchProps, OwnProps & RouteComponentProps, WrState
  >(mapStateToProps, mapDispatchToProps)(WrSignin),
);
