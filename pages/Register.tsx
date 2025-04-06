import Layout from '../components/Layout';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <Layout>
      <AuthForm type="register" />
    </Layout>
  );
};

export default RegisterPage;