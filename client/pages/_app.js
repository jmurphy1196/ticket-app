import buildClient from "../api/build-client";
import Header from "../components/header";
import "../styles/main.scss";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Component {...pageProps} currentUser={currentUser} />
    </>
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
