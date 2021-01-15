import Feature from "./features/feature";

const Features = () => {
  return (
    <section class='section-features'>
      <div class='row'>
        <div class='col-1-of-4'>
          <Feature heading='Start Buying' icon='ticket'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            autem sint consequatur nesciunt quisquam non. Expedita quae nisi
            delectus, nulla eum quisquam corrupti iure voluptatem ducimus,
            reprehenderit reiciendis. Dignissimos, commodi
          </Feature>
        </div>
        <div class='col-1-of-4'>
          <Feature heading='start selling' icon='dollar'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
            provident labore, consectetur quos animi corrupti eius vel eveniet
            quia ex rerum culpa facilis, repudiandae architecto iste inventore?
            Hic, eveniet debitis.
          </Feature>
        </div>
        <div class='col-1-of-4'>
          <Feature heading='Signup today' icon='user'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum
            labore, sint fugiat optio vitae voluptatum porro tenetur fuga. Natus
            veniam sequi accusantium sunt repudiandae esse totam eligendi
            expedita doloribus ab.
          </Feature>
        </div>
        <div class='col-1-of-4'>
          <Feature heading='already signed up?' icon='users'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
            at a autem reiciendis fuga, mollitia labore sit, deserunt maxime
            quibusdam ab fugiat quidem sint? Corporis architecto delectus
            distinctio veritatis ad!
          </Feature>
        </div>
      </div>
    </section>
  );
};

export default Features;
