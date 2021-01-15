const Feature = ({ heading, icon, children }) => {
  return (
    <div class='feature-box'>
      <i className={`feature-box__icon  fa fa-${icon}`}></i>
      <h3 class='heading-tertiary mb-small'>{heading}</h3>
      <p class='feature-box__text'>{children}</p>
    </div>
  );
};

export default Feature;
