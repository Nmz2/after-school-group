const app = Vue.createApp({
  data() {
    return {
      lessons: [
        { id: 1, subject: "Math", location: "London", price: 100,
          spaces: 5, image: "images/maths.png", alt: "Maths symbols" },
        { id: 2, subject: "Art", location: "Hendon", price: 80,
          spaces: 5, image: "images/art.png", alt: "Paint palette" },
        { id: 3, subject: "Computer Science", location: "Mauritius", price: 120,
          spaces: 5, image: "images/cs.png", alt: "Laptop with code" },
        { id: 4, subject: "Music", location: "Dubai", price: 90,
          spaces: 5, image: "images/music.png", alt: "Guitar and notes" },
        { id: 5, subject: "English", location: "Mauritius", price: 70,
          spaces: 5, image: "images/english.png", alt: "Stack of books" },
        { id: 6, subject: "Science", location: "Dubai", price: 110,
          spaces: 5, image: "images/science.png", alt: "Microscope" }
      ],
            cart: [],
      showCart: false,
      search: "",
      steps: [
        "Choose a lesson.",
        "Add the lesson to your cart.",
        "Enter your name and phone number.",
        "Book your place."
      ],
      reasons: [
        { subject: "Math", group: "foundation", text: "Math helps you in Physics and Computer Science." },
        { subject: "English", group: "foundation", text: "English helps you read every question." },
        { subject: "Physics", group: "foundation", text: "Physics shows you how things work." },
        { subject: "Biology", group: "foundation", text: "Biology shows you how living things work." },
        { subject: "Computer Science", group: "foundation", text: "Computer Science teaches you to solve problems step by step." },
        { subject: "Art", group: "creative", text: "Art teaches you to look closely and to share your ideas." },
        { subject: "Music", group: "creative", text: "Music trains your ear, your memory and your patience." }
      ]
    };
  },
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson.id);
      lesson.spaces--;
    }
  },
   computed: {
    filteredLessons() {
      const term = this.search.toLowerCase();
      return this.lessons.filter(l =>
        l.subject.toLowerCase().includes(term) ||
        l.location.toLowerCase().includes(term)
      );
    }
  }
});

app.mount("#app");
