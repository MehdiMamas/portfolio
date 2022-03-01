<template>
  <div class="main">
    <div class="row" style="max-width: 1170px; margin: auto">
      <div class="col-md-4" style="">
        <div class="col-md-12 panel-parent" style="margin-bottom: 22px">
          <router-link :to="{ name: 'ProfileSettings' }" class="col-md-12 panel header">
            Settings
          </router-link>
          <router-link :to="{ name: 'ProfileSettings' }" class="col-md-12 panel middle">
            <faicon icon="edit" style="width: 20px; margin-right: 5px" />
            Profile
          </router-link>
          <router-link :to="{ name: 'SecuritySettings' }" class="col-md-12 panel last">
            <faicon icon="lock" style="width: 20px; margin-right: 5px" />
            Security
          </router-link>
        </div>
        <div class="col-md-12 panel-parent" style="margin-bottom: 22px">
          <router-link
            :to="{ name: 'SubscriptionSettings' }"
            class="col-md-12 panel header"
          >
            Billing
          </router-link>
          <router-link
            :to="{ name: 'SubscriptionSettings' }"
            class="col-md-12 panel middle"
          >
            <faicon icon="shopping-bag" style="width: 20px; margin-right: 5px" />
            Subscription
          </router-link>
          <router-link
            :to="{ name: 'PaymentMethodSettings' }"
            class="col-md-12 panel middle"
          >
            <faicon icon="credit-card" style="width: 20px; margin-right: 5px" />
            Payment Method
          </router-link>
          <router-link :to="{ name: 'InvoicesSettings' }" class="col-md-12 panel last">
            <faicon icon="history" style="width: 20px; margin-right: 5px" />
            Invoices
          </router-link>
        </div>
      </div>
      <div class="col-md-8" style=""><router-view></router-view></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Body",
  methods: {},
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.darkmode {
  .panel {
    &.header {
      color: white;
    }
    &:not(.header) {
      background-color: #2b2c2f !important;
      color: rgb(128, 128, 128);
      &.router-link-exact-active {
        filter: brightness(1.5);
      }
    }
  }
}
.main {
  margin: 0 20px;
}

.panel-parent {
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  .panel {
    text-align: left;
    height: 40px;
    border: 1px solid #d3e0e9;
    color: #636b6f;
    padding-left: 6px;
    text-decoration: none;
    display: flex;
    align-items: center;
    &:not(.header) {
      background-color: white;
      &.router-link-exact-active {
        background-color: #e6e6e6;
      }
    }
  }
  .panel.header {
    border-radius: 3px 3px 0px 0px;
    border-bottom: 0;
  }
  .panel.middle {
    border-radius: 0;
    border-bottom: 0;
  }
  .panel.last {
    border-radius: 0px 0px 3px 3px;
  }
}
</style>
