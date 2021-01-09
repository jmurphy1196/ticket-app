import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //appContext is different from context on other components->getInitialProps(context)

  const { ctx } = appContext;
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
