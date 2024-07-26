<script>
import { ref, onMounted, watch } from "vue";

export default {
  name: "NavBar",
  setup() {
    const theme = ref("light-theme");

    const toggleTheme = () => {
      theme.value =
        theme.value === "light-theme" ? "dark-theme" : "light-theme";
      document.documentElement.className = theme.value;
    };

    const themeIconClass = ref("pi pi-moon");

    watch(theme, (newTheme) => {
      localStorage.setItem("theme", newTheme);
      themeIconClass.value =
        newTheme === "dark-theme" ? "pi pi-sun" : "pi pi-moon";
    });

    onMounted(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        theme.value = savedTheme;
        document.documentElement.className = savedTheme;
      }
    });

    return { theme, toggleTheme, themeIconClass };
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand logo__animation" href="#">
        <span class="main__logo-color">Your</span>Places.io
      </a>
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
            <a class="nav-link" aria-current="page" href="#">Strona Główna</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Aktualności</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Forum</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link active__page"
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
      <i
        :class="themeIconClass"
        style="font-size: 1.5rem"
        @click="toggleTheme"
      ></i>
      <i class="pi pi-calendar" style="font-size: 1.5rem"></i>
      <OverlayBadge class="pi--overlay-badge" severity="danger">
        <i class="pi pi-envelope" style="font-size: 1.5rem"></i>
      </OverlayBadge>
    </div>
  </nav>
</template>

<style scoped>
.main__logo-color {
  color: rgb(52, 211, 153);
}
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
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--side-background-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.navbar-brand {
  color: var(--text-color) !important;
}
.nav-item {
  margin-right: 10px;
}
.nav-link {
  color: var(--text-color);
}
.nav-link:hover {
  color: var(--text-hover);
}
.logo__animation {
  font-size: 25px;
  font-weight: 700;
  margin-right: 30px;
}
.logo__animation:hover {
  animation: shake 5.5s;
  animation-iteration-count: infinite;
}

.active__page {
  color: var(--nav-active-page);
}
.active__page:hover {
  color: var(--nav-active-page);
}
.active__page:focus {
  color: var(--nav-active-page);
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, 1px) rotate(0deg);
  }
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
