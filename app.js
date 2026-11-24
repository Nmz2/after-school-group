/* Zone 1: The DATA is here. */
const app = Vue.createApp({
  data() {
    return {
      lessons: [
        { id: 1, subject: "Math", location: "London", price: 100, spaces: 5, tutor: "Mr Patel", description: "Numbers, algebra and problem solving.", image: "images/maths.png", alt: "Maths symbols" },
        { id: 2, subject: "Art", location: "London", price: 80, spaces: 5, tutor: "Ms Rossi", description: "Draw, paint and share your ideas.", image: "images/art.png", alt: "Paint palette" },
        { id: 3, subject: "Computer Science", location: "Mauritius", price: 120, spaces: 5, tutor: "Mr Dubois", description: "Learn to solve problems with code.", image: "images/cs.png", alt: "Laptop with code" },
        { id: 4, subject: "Music", location: "Dubai", price: 90, spaces: 5, tutor: "Ms Haddad", description: "Train your ear. Play and read music.", image: "images/music.png", alt: "Guitar and notes" },
        { id: 5, subject: "English", location: "Mauritius", price: 70, spaces: 5, tutor: "Ms Laurent", description: "Read well. Write clearly. Speak with confidence.", image: "images/english.png", alt: "Stack of books" },
        { id: 6, subject: "Physics", location: "Dubai", price: 110, spaces: 5, tutor: "Dr Khan", description: "See how forces, light and energy work.", image: "images/physics.png", alt: "Planet orbit diagram" },
        { id: 7, subject: "Biology", location: "Mauritius", price: 110, spaces: 5, tutor: "Ms Naidoo", description: "Learn about cells, the body and living things.", image: "images/biology.png", alt: "Cell under a microscope" },
        { id: 8, subject: "French", location: "Mauritius", price: 85, spaces: 5, tutor: "Mme Lefevre", description: "Speak, read and write in French.", image: "images/french.svg", alt: "French flag and a speech bubble saying Bonjour" },
        { id: 9, subject: "Cybersecurity", location: "London", price: 130, spaces: 5, tutor: "Mr Osei", description: "Learn how to keep data and devices safe.", image: "images/cybersecurity.svg", alt: "Shield with a padlock" },
        { id: 10, subject: "Chess", location: "Dubai", price: 60, spaces: 5, tutor: "Mr Petrov", description: "Plan ahead. Think before you move.", image: "images/chess.svg", alt: "Chess pawn and rook on a board" }
      ],
      cart: [],
      showCart: false,
      search: "",
      sortBy: "subject",   // which field: subject, location, price or spaces
      sortOrder: "asc",    // "asc" or "desc"
      steps: [
        { title: "Choose a lesson", detail: "Look at the lessons. Use the search box to find a subject or a place." },
        { title: "Add the lesson to your cart", detail: "Click Add to cart. The cart count goes up." },
        { title: "Enter your name and phone number", detail: "Open the cart. Fill in the form." },
        { title: "Book your place", detail: "Click Checkout. We keep your place." }
      ],
      reasons: [
        { subject: "Math", group: "foundation", text: "Math helps you in Physics and Computer Science." },
        { subject: "English", group: "foundation", text: "English helps you read every question." },
        { subject: "Physics", group: "foundation", text: "Physics shows you how things work." },
        { subject: "Biology", group: "foundation", text: "Biology shows you how living things work." },
        { subject: "Computer Science", group: "foundation", text: "Computer Science teaches you to solve problems step by step." },
        { subject: "Art", group: "creative", text: "Art teaches you to look closely and to share your ideas." },
        { subject: "Music", group: "creative", text: "Music trains your ear, your memory and your patience." },
        { subject: "French", group: "foundation", text: "French helps you speak with more people around the world." },
        { subject: "Cybersecurity", group: "foundation", text: "Cybersecurity teaches you to keep your data safe online." },
        { subject: "Chess", group: "creative", text: "Chess teaches you to plan ahead and think before you act." }
      ],
      features: [
        { number: "01", title: "Small classes", text: "Each tutor teaches a small group. You get time to ask questions." },
        { number: "02", title: "Foundations first", text: "Math, English, Physics, Biology and Computer Science support each other." },
        { number: "03", title: "Room to create", text: "Art and Music teach you to make new things and share your ideas." }
      ],
      places: [
        { name: "Mauritius", text: "Classes after school." },
        { name: "Dubai", text: "Classes after school." },
        { name: "London", text: "Classes after school." }
      ],
      openStep: null,
      name: "",
      phone: "",
      orderMessage: "",
      year: new Date().getFullYear()
    };
  },

  /* Zone 2: The METHODS are here. User can make an action. */
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson.id);
      lesson.spaces--;
    },
    toggleStep(index) {
      this.openStep = this.openStep === index ? null : index;
    },
    removeFromCart(id) {
      const position = this.cart.indexOf(id);
      if (position === -1) return;
      this.cart.splice(position, 1);
      const lesson = this.lessons.find(l => l.id === id);
      lesson.spaces++;
    },
    submitOrder() {
      if (!this.canCheckout) return;
      this.orderMessage = `Thank you, ${this.name}. Your places are booked.`;
      this.cart = [];
      this.name = "";
      this.phone = "";
    }
  },

  /* Zone 3: The COMPUTED values are here. These are made from data values. */
 computed: {
    filteredLessons() {
      const term = this.search.toLowerCase();
      return this.lessons.filter(l =>
        l.subject.toLowerCase().includes(term) ||
        l.location.toLowerCase().includes(term)
      );
    },

    sortedLessons() {
      const list = [...this.filteredLessons];
      list.sort((a, b) => {
        const x = a[this.sortBy];
        const y = b[this.sortBy];
        let result;
        if (typeof x === "string") {
          result = x.localeCompare(y);
        } else {
          result = x - y;
        }
        return this.sortOrder === "asc" ? result : -result;
      });
      return list;
    },

    foundationReasons() {
      return this.reasons.filter(r => r.group === "foundation");
    },
    creativeReasons() {
      return this.reasons.filter(r => r.group === "creative");
    },
    cartItems() {
      return this.cart.map(id => this.lessons.find(l => l.id === id));
    },
    cartTotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price, 0);
    },
    validName() {
      return /^[A-Za-z\s]+$/.test(this.name);
    },
    validPhone() {
      return /^[0-9]{7,}$/.test(this.phone);
    },
    canCheckout() {
      return this.cart.length > 0 && this.validName && this.validPhone;
    }
  }
});

app.mount("#app");