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
                  <div class="card-sigin">
                    <div class="main-signup-header">
                      <h2>Welcome back!</h2>
                      <h5 class="fw-semibold mb-4">Please sign in to continue.</h5>
                      <form action="#">
                        <div class="form-group">
                          <label>Email</label>
                          <input
                            class="form-control"
                            placeholder="Enter your email"
                            type="text"
                            v-model="email"
                          />
                        </div>
                        <div class="form-group">
                          <label>Password</label>
                          <input
                            class="form-control"
                            placeholder="Enter your password"
                            type="password"
                            v-model="password"
                          />
                        </div>
                        <button
                          class="btn btn-main-primary btn-block"
                          @click.prevent="signin"
                        >
                          Sign In
                        </button>
                      </form>
                      <div class="main-signin-footer mt-5">
                        <p>
                          <router-link :to="{ name: 'ForgotPassword' }"
                            >Forgot password?</router-link
                          >
                        </p>
                        <p>
                          Don't have an account?
                          <router-link :to="{ name: 'SignUp' }"
                            >Create an Account</router-link
                          >
                        </p>
                      </div>
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
      password: "",
    };
  },
  methods: {
    signin() {
      var _this = this;
      axios
        .post("signin", {
          email: this.email.toLowerCase(),
          password: this.password,
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
