import HotTicket from "./hot-ticket";
import Button from "../buttons/main-btn";
import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Link from "next/link";
const HotTickets = ({ tickets }) => {
  const [page, setPage] = useState(1);
  const [currentTickets, setCurrentTieckts] = useState(tickets);
  const { doRequest, errors, originalErrors } = useRequest({
    body: {},
    method: "GET",
    url: `/api/tickets?limit=${3}&page=`,
    onSuccess: (tickets) => {
      if (tickets.length) {
        setCurrentTieckts(tickets);
      } else {
        setPage(page - 1);
      }
    },
  });

  return (
    <section class='section-tickets'>
      {page > 1 && (
        <div class='left-arrow'>
          <Button
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
                doRequest({ page: page - 1 });
              }
            }}
          >
            <i class='arrows-circle-right'>&larr;</i>
          </Button>
        </div>
      )}
      <div class='right-arrow'>
        <Button
          onClick={() => {
            setPage(page + 1);
            doRequest({ page: page + 1 });
          }}
        >
          <i class='arrows-circle-right'>&rarr;</i>
        </Button>
      </div>

      <div class='text-center mb-8'>
        <h2 class='heading-secondary'>
          <span>Hot Tickets</span>
        </h2>
      </div>
      <div class='row'>
        {currentTickets.map((ticket, i) => {
          return (
            <div className='col-1-of-3'>
              <HotTicket
                title={ticket.title}
                key={i}
                price={ticket.price}
                imageUrl={ticket.imageUrl}
              />
            </div>
          );
        })}
      </div>
      <div class='text-center mt-8'>
        <Link href='/tickets'>
          <Button color='blue'>Discover more tickets</Button>
        </Link>
      </div>
    </section>
  );
};

export default HotTickets;
