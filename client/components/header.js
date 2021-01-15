import Button from "./buttons/main-btn";
import Link from "next/link";
export default ({ currentUser }) => {
  return (
    <header className='header'>
      <div className='header__text-box'>
        <h1 className='heading-primary'>
          <span className='heading-primary--main'>TicketMaster</span>
          <span className='heading-primary--sub'>The party starts here</span>
        </h1>
        <Link href='/auth/signup'>
          <Button animated>Getting started</Button>
        </Link>
      </div>
    </header>
  );
};
