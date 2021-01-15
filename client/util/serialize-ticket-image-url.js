const serializeTicketUrl = (url) => {
  url = url.split(":").join("%3A");
  return `https://watchparty-storage.s3-us-west-1.amazonaws.com/${url}`;
};
export default serializeTicketUrl;
