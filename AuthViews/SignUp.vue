<template>
  <div class="container-fluid">
    <div class="row no-gutter">
      <!-- The image half -->
      <div class="col-md-6 col-lg-6 col-xl-7 d-none d-md-flex bg-primary-transparent">
        <div class="row wd-100p mx-auto text-center">
          <div class="col-md-12 col-lg-12 col-xl-12 my-auto mx-auto wd-100p">
            <img
              src="@/assets/img/media/login.png"
              class="my-auto ht-xl-80p wd-md-100p wd-xl-80p mx-auto"
              alt="logo"
            />
          </div>
        </div>
      </div>
      <!-- The content half -->
      <div class="col-md-6 col-lg-6 col-xl-5 bg-white">
        <div class="login d-flex align-items-center py-2">
          <!-- Demo content-->
          <div class="container p-0">
            <div class="row">
              <div class="col-md-10 col-lg-10 col-xl-9 mx-auto">
                <div class="card-sigin">
                  <div class="main-signup-header">
                    <h2 class="text-primary">Get Started</h2>
                    <h5 class="fw-normal mb-4">
                      It's free to signup and only takes a minute.
                    </h5>
                    <form action="#">
                      <div class="form-group">
                        <label>Firstname &amp; Lastname</label>
                        <input
                          v-model="fullname"
                          class="form-control"
                          placeholder="Enter your firstname and lastname"
                          type="text"
                        />
                      </div>
                      <div class="form-group">
                        <label>Email</label>
                        <input
                          v-model="email"
                          class="form-control"
                          placeholder="Enter your email"
                          type="text"
                        />
                      </div>
                      <div class="form-group">
                        <label>Password</label>
                        <input
                          class="form-control"
                          placeholder="Enter your password"
                          type="password"
                          v-model="password1"
                        />
                      </div>
                      <div class="form-group">
                        <label>Confirm Password</label>
                        <input
                          class="form-control"
                          placeholder="Confirm your password"
                          type="password"
                          v-model="password2"
                        />
                      </div>

                      <button
                        class="btn btn-main-primary btn-block"
                        @click.prevent="signup"
                      >
                        Create Account
                      </button>
                    </form>
                    <div class="main-signup-footer mt-5">
                      <p>
                        Already have an account?
                        <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End -->
        </div>
      </div>
      <!-- End -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password1: "",
      password2: "",
      fullname: "",
    };
  },
  methods: {
    signup() {
      var _this = this;
      if (this.password1 != this.password2) {
        return;
      }
      axios
        .post("signup", {
          fullname: this.fullname.trim(),
          email: this.email.toLowerCase(),
          password: this.password1,
        })
        .then((rsp) => {
          if (rsp.isSuccess) {
            _this.$store
              .dispatch("changeData", {
                option: "isAuth",
                value: true,
              })
              .then(() => {
                _this.$store
                  .dispatch("changeData", {
                    option: "isInitiated",
                    value: false,
                  })
                  .then(() => {
                    _this.$router.push({ name: "Drivers" });
                  });
              });
          }
        });
    },
  },
};
</script>
