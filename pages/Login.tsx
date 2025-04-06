import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <Layout>
      <AuthForm type="login" />
    </Layout>
  );
};

export default LoginPage;