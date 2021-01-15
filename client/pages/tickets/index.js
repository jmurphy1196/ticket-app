import HotTicket from "../../components/hot-tickets/hot-ticket";
import Navbar from "../../components/navbar";
const BrowseTickets = ({ currentUser, tickets }) => {
  console.log(currentUser);
  console.log(tickets);
  return (
    <>
      <Navbar currentUser={currentUser} />
      <section className='browse-tickets'>
        {tickets.map((threeTickets) => {
          return (
            <div className='row mt-2'>
              {threeTickets.map((ticket) => {
                return (
                  <div className='col-1-of-3'>
                    <HotTicket
                      title={ticket.title}
                      price={ticket.price}
                      id={ticket.id}
                      imageUrl={ticket.imageUrl}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  );
};

BrowseTickets.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets?limit=12&page=1");
  const testData = {
    id: "5fff7f6a9826e60019505b7f",
    imageUrl: "2021-01-13T23:16:58.022Z.tkphoto2.jpg",
    price: 45,
    title: "korn",
    userId: "5fff7f6487adeb001991cea3",
  };

  for (let i = 0; i < 8; i++) {
    console.log("this was ran");
    data.push(testData);
  }
  let formatedData = [];
  const serializeTickets = (arr) => {
    if (arr.length <= 2) {
      formatedData.push(arr);
      return;
    }
    formatedData.push(arr.slice(0, 3));
    serializeTickets(arr.slice(3));
  };
  serializeTickets(data);
  //check if last array is empty
  formatedData = formatedData.filter((fdata) => fdata.length > 0);
  return { tickets: formatedData };
};

export default BrowseTickets;
