
const createDeferred = function () {
  var override = {};
  var q = new Promise((resolve, reject) => {
    override.resolve = resolve;
    override.reject = reject;
  });
  q.override = override;
  return q;
};
const gapiDeferred = createDeferred();
const FBDeferred = createDeferred();
const grecaptchaDeferred = createDeferred();
function gapiAsyncInit() {
  gapi.load('auth2', function () {
    gapi.auth2.init({
      client_id: `${
        document.querySelector("meta[name='wr:google-oauth2-client-id']").getAttribute("content")
      }.apps.googleusercontent.com`,
    }).then(() => gapiDeferred.override.resolve(gapi));
  });
}
function recaptchaAsyncInit() {
  grecaptchaDeferred.override.resolve(grecaptcha);
}
function fbAsyncInit() {
  FBDeferred.override.resolve(FB);
}