import TextBtn from "./buttons/text-btn";
import TextButton from "./buttons/text-btn";
const About = () => {
  const aboutImages = [
    "/img/tkphoto1.jpg",
    "/img/tkphoto2.jpg",
    "/img/tkphoto3.jpg",
  ];
  return (
    <section class='section-about'>
      <div class='text-center mb-8'>
        <h2 class='heading-secondary'>
          <span>Purchase and sell your event tickets to the web!</span>
        </h2>
      </div>
      <div class='row'>
        <div class='col-1-of-2'>
          <h3 class='heading-tertiary mb-small'>Browse from serval tickets</h3>
          <p class='paragraph'>
            Our users sell several tickets ranging from all kinds of events!
          </p>
          <h3 class='heading-tertiary mb-small'>Sell your unwated tickets</h3>
          <p class='paragraph'>
            List your tickets to our users, for a price you deem fit.
          </p>
          <TextBtn>Learn more &rarr; </TextBtn>
        </div>
        <div class='col-1-of-2'>
          <div class='composition'>
            <img
              src={aboutImages[0]}
              alt='photo1'
              class='composition__photo composition__photo--p1'
            />
            <img
              src={aboutImages[1]}
              alt='photo2'
              class='composition__photo composition__photo--p2'
            />
            <img
              src={aboutImages[2]}
              alt='photo3'
              class='composition__photo composition__photo--p3'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
