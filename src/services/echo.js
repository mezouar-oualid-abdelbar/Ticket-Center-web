import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "7e5061662fe72866b8bf",
  cluster: "eu",
  forceTLS: true,
  encrypted: true,
});

export default echo;
