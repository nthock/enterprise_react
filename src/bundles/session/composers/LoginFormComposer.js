import { pure, compose, withHandlers, withState } from 'recompose';
import { graphql } from 'react-apollo';
import LoginForm from '../components/LoginForm';
import { displayLoadingState } from '../../../helpers/compose';
import { authenticateUser } from '../graphql';
import Auth from '../../../helpers/auth';

const LoginFormComposer = compose(
  graphql(authenticateUser),
  withState('formData', 'setFormData', { email: '', password: '' }),
  withHandlers({
    handleSave: props => () => {
      const { formData, mutate, history } = props;
      mutate({
        variables: { ...formData }
      })
        .then(({ data }) => {
          if (data.authenticate) {
            Auth.signIn(data.authenticate);
            history.push('/dashboard');
          } else {
            Auth.signOut();
          }
        });
    },
  }),
  displayLoadingState,
  pure,
)(LoginForm);

export default LoginFormComposer;
