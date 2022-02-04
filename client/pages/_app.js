import 'bootstrap/dist/css/bootstrap.css';
import buildAxios from '../api/buildAxios';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, user }) => {
    return (
        <div>
            <Header user={user} />
            <div className="container">
                <Component user={user} {...pageProps} />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async ({ ctx, Component }) => {
    const axios = buildAxios(ctx);
    try {
        const { data } = await axios.get('/api/users/current-user');
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx, { user:data.user, axios });
        }
        return { pageProps, ...data };
    } catch (e) {
        return {};
    }
};

export default AppComponent;
