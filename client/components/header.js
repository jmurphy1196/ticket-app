import Link from "next/link";
export default ({ currentUser }) => {
  let links = [
    !currentUser && {
      label: "Login",
      href: "/auth/signin",
    },
    currentUser && {
      label: "Logout",
      href: "/auth/signout",
    },
    !currentUser && {
      label: "Signup",
      href: "/auth/signup",
    },
  ];
  //removes all falsy values from the array
  links = links
    .filter((link) => link)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href}>
            <a className='nav-link'>{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        <a className='navbar-brand'>TicketMaster</a>
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>{links}</ul>
      </div>
    </nav>
  );
};
