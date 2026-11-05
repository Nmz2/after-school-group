const app = Vue.createApp({
	data() {
		return {
			lesson: {
  subject: "Math",
  location: "London",
  price: 100,
  image: "images/math.png",
  alt: "Maths symbols"
}
		};
	}
});
app.mount("#app");
