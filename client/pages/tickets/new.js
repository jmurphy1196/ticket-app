import { useState, createRef } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Navbar from "../../components/navbar";
import Button from "../../components/buttons/main-btn";
const NewTicket = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(1);
  const [photo, setPhoto] = useState(null);
  const { doRequest, errors } = useRequest({
    body: {},
    url: "/api/tickets",
    method: "POST",
    onSuccess: (ticket) => Router.push("/"),
  });

  const photoRef = createRef();

  const onSubmit = async () => {
    const file = photoRef.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("photo", file, file.name);
      doRequest({ formData });
    }
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;

    setPrice(value.toFixed(2));
  };
  return (
    <>
      <Navbar currentUser={currentUser} />
      <section className='new-ticket-heading'>
        <h1 className='heading-primary text-center'>
          <span className='heading-primary--main'>Sell</span>
          <span className='heading-primary--sub'>Enter ticket information</span>
        </h1>
      </section>
      <section className='new-ticket-form-section'>
        <form className='new-ticket-form'>
          <div className='new-ticket-form__group'>
            <label className='new-ticket-form__group__label'>Title</label>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              className='new-ticket-form__group__input'
            />
          </div>
          <div className='new-ticket-form__group'>
            <label className='new-ticket-form__group__label'>price</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              type='number'
              className='new-ticket-form__group__input'
            />
          </div>
          <div className='new-ticket-form__group text-center'>
            <label className='new-ticket-form__group__label mb-2'>Photo</label>
            <input
              ref={photoRef}
              hidden='hidden'
              onChange={(e) => {
                const file = e.target.files[0];
                let formData = new FormData();
                formData.append("photo", file, file.name);
                setPhoto(formData);
              }}
              type='file'
              className='new-ticket-form__group__input new-ticket-form__group__input--photo'
            />
            <Button
              onClick={() => {
                photoRef.current.click();
              }}
              color='white'
            >
              <i className='fa fa-upload'></i>
            </Button>
          </div>
          <div style={{ margin: "0 auto" }} className='text-center mt-4'>
            <Button onClick={onSubmit} color='blue' animated>
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewTicket;
