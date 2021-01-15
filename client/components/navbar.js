import Link from "next/link";

const Navbar = ({ currentUser }) => {
  const noTextDecoration = {
    textDecoration: "none",
    color: "inherit",
  };
  return (
    <nav className='navbar'>
      <div className='navbar__brand'>
        <Link href='/'>
          <a href='#a' style={{ textDecoration: "none", color: "inherit" }}>
            <i className='fa fa-ticket' aria-hidden='true'></i>
          </a>
        </Link>
      </div>
      <div className='navbar__routes'>
        <ul className='navbar__routes__list'>
          {currentUser ? (
            <>
              <li>
                <Link href='/tickets'>
                  <a style={noTextDecoration} href='#a'>
                    BUY
                  </a>
                </Link>
              </li>
              <Link href='/tickets/new'>
                <a style={noTextDecoration} href='#a'>
                  <li>SELL</li>
                </a>
              </Link>
              <Link href='/orders'>
                <a style={noTextDecoration} href='#a'>
                  <li>ORDERS</li>
                </a>
              </Link>
            </>
          ) : (
            <>
              <li>signup</li>
              <li>Signin</li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
