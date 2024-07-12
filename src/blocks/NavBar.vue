<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">ElCarPlaces.io</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#"
              >Strona Główna</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Aktualności</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Forum</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link disabled"
              href="#"
              tabindex="-1"
              aria-disabled="true"
              >Zakładki lokalizacji</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="d-flex activities">
      <!-- <OverlayBadge value="2"> -->
      <i class="pi pi-bell" style="font-size: 1.5rem" />
      <!-- </OverlayBadge> -->
      <!-- <OverlayBadge value="4" severity="danger"> -->
      <i class="pi pi-calendar" style="font-size: 1.5rem" />
      <!-- </OverlayBadge> -->
      <OverlayBadge class="pi--overlay-badge" severity="danger">
        <i class="pi pi-envelope" style="font-size: 1.5rem" />
      </OverlayBadge>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
.pi {
  cursor: pointer;
}
.pi--overlay-badge {
  margin-top: 5px;
}
.activities {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-right: 20px;
}
.navbar {
  margin-bottom: 0px;
  border-bottom: 1px solid #e9ecef;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
@media screen and (max-width: 991px) {
  .activities {
    position: absolute;
    display: flex;
    margin-left: 43%;
    gap: 35px;
  }
}
</style>
