import Link from "next/link";
import { useState } from "react";
import Header from "../components/header";
import About from "../components/about";
import Features from "../components/features";
import HotTickets from "../components/hot-tickets/hot-tickets";
const LandingPage = ({ currentUser, tickets }) => {
  console.log("these are the tickets");
  console.log(tickets);
  return (
    <>
      <Header />
      <main>
        <About />
        <Features />
        <HotTickets tickets={tickets} />
      </main>
    </>
  );
};

export default LandingPage;

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets?limit=3&page=1");
  return { tickets: data };
};
/* 

import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  console.log("THIS IS RUNNIGN");
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
*/
