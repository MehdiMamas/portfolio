<template>
  <div class="container" style="width: 66.66%; overflow: auto">
    <div @click.prevent="clickAddBtn"><faicon icon="plus"></faicon></div>
  </div>
</template>

<script>
export default {
  name: "NoCardPreview",
  props: {
    clickAddBtn: Function,
  },
};
</script>
<style lang="scss" scoped>
.darkmode {
  .container {
    background-color: #343438 !important;
    > div {
      background-color: #242427 !important;
      color: white !important;
      border-color: white;
      &:hover {
        transition: all 0.5s ease;
        opacity: 0.7;
      }
      opacity: 0.5;
    }
  }
}
</style>
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.container div {
  background-color: #fdfdfd;
  padding: 10vw;
  margin: auto;
  font-size: 5em;
  font-weight: 300;
  opacity: 0.5;
  box-shadow: 0px 0px 41px -25px rgb(0 0 0 / 75%);
  cursor: pointer;
  transition: all 500ms ease;
  border-bottom: 5px solid rgba(0, 0, 0, 0.1);
}
.container div:hover {
  box-shadow: 0px 0px 41px -15px rgb(0 0 0 / 75%);
  opacity: 0.7;
}
</style>
