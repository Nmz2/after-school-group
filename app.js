/* Zone 1: The DATA is here. */
const app = Vue.createApp({
  data() {
    return {
      apiUrl: "https://m01087852-after-school.onrender.com",
      lessons: [],                        // filled by fetch when the page loads
      cart: [],
      showCart: false,
      search: "",
      searchIds: null,     // ids of lessons the server says match; null = show all
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

  /* When the page loads, get the lessons from the server. */
  created() {
    fetch(this.apiUrl + "/lessons")
      .then(response => response.json())
      .then(data => {
        this.lessons = data;
      })
      .catch(error => {
        console.log("Could not load lessons:", error);
      });
  },

  /* Zone 2: The METHODS are here. User can make an action. */
  methods: {
    addToCart(lesson) {
      this.cart.push(lesson._id);
      lesson.spaces--;
      this.orderMessage = "";   // hide the old message when a new order starts
    },
    toggleStep(index) {
      this.openStep = this.openStep === index ? null : index;
    },
    removeFromCart(id) {
      const position = this.cart.indexOf(id);
      if (position === -1) return;
      this.cart.splice(position, 1);
      const lesson = this.lessons.find(l => l._id === id);
      lesson.spaces++;
    },
    submitOrder() {
      if (!this.canCheckout) return;

      // Count how many spaces of each lesson are in the cart.
      // cart ["a", "a", "b"] becomes [ {lessonID: "a", spaces: 2}, {lessonID: "b", spaces: 1} ]
      const orderLessons = [];
      this.cart.forEach(id => {
        const found = orderLessons.find(item => item.lessonID === id);
        if (found) {
          found.spaces++;
        } else {
          orderLessons.push({ lessonID: id, spaces: 1 });
        }
      });

      const order = { name: this.name, phone: this.phone, lessons: orderLessons };

      // 1. POST: save the order.
      fetch(this.apiUrl + "/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      })
        .then(response => {
          if (!response.ok) throw new Error("Order was not saved");
          return response.json();
        })
        .then(() => {
          // 2. PUT: save the new number of spaces for each lesson in the order.
          const updates = orderLessons.map(item => {
            const lesson = this.lessons.find(l => l._id === item.lessonID);
            return fetch(this.apiUrl + "/lessons/" + item.lessonID, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ spaces: lesson.spaces })
            });
          });
          return Promise.all(updates);   // wait for every PUT to finish
        })
        .then(() => {
          this.orderMessage = `Thank you, ${this.name}. Your order has been submitted.`;
          this.cart = [];
          this.name = "";
          this.phone = "";
        })
        .catch(error => {
          console.log(error);
          this.orderMessage = "Sorry, the order could not be sent. Please try again.";
        });
    }
  },
  /* Zone 3: WATCH runs code when a data value changes. */
  watch: {
    search(newTerm) {
      if (newTerm.trim() === "") {
        this.searchIds = null;          // empty box: show all lessons
        return;
      }
      fetch(this.apiUrl + "/search?q=" + encodeURIComponent(newTerm))
        .then(response => response.json())
        .then(data => {
          if (newTerm !== this.search) return;   // user kept typing: ignore old answer
          this.searchIds = data.map(l => l._id);
        })
        .catch(error => console.log("Search failed:", error));
    }
  },
  /* Zone 4: The COMPUTED values are here. These are made from data values. */
  computed: {
    filteredLessons() {
      if (this.searchIds === null) return this.lessons;
      return this.lessons.filter(l => this.searchIds.includes(l._id));
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
      return this.cart.map(id => this.lessons.find(l => l._id === id));
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