import Navbar from "../../components/navbar";

const AccountLandingPage = ({ currentUser }) => {
  return (
    <>
      <Navbar currentUser={currentUser} />
      <section className='my-account'>
        <div className='my-account__orders'>orders here</div>
      </section>
    </>
  );
};

export default AccountLandingPage;
