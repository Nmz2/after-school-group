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
      search: ""
    };
  },
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
