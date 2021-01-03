import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //appContext is different from context on other components->getInitialProps(context)

  const { ctx } = appContext;
  const { data } = await buildClient(ctx).get("/api/users/currentuser");
  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = appContext.Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
