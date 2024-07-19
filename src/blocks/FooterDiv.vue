<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__nav">
        <address class="footer__style">
          <a class="footer__logo" href="*">
            <span class="footer--color-logo">Your</span>Places
          </a>
          <ul class="footer__list">
            <li class="footer--padding">
              <a class="footer__contact" href="*">
                <span class="footer--color-city">
                  05-500 Piaseczno, ul. Janusza Kusocińskiego 12
                </span>
              </a>
            </li>
            <li class="footer--padding">
              <a class="footer__contact" href="mailto:info@example.com">
                kontaktkomsko@gmail.com
              </a>
            </li>
            <li class="footer--padding">
              <a class="footer__contact" href="tel:+48111111111">
                +48 728 880 699
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div class="icon-footer">
        <h3 class="icon-footer__heading">Dołącz do nas</h3>
        <ul class="icon-footer__social">
          <li class="icon-footer__list">
            <a class="icon-footer__come-link" href="#">
              <svg class="icon-footer__come-icon">
                <use href="../img/icons.svg#icon-instagram"></use>
              </svg>
            </a>
          </li>
          <li class="icon-footer__list">
            <a class="icon-footer__come-link" href="#">
              <svg class="icon-footer__come-icon">
                <use href="../img/icons.svg#icon-twitter"></use>
              </svg>
            </a>
          </li>
          <li class="icon-footer__list">
            <a class="icon-footer__come-link" href="#">
              <svg class="icon-footer__come-icon">
                <use href="../img/icons.svg#icon-facebook"></use>
              </svg>
            </a>
          </li>
          <li class="icon-footer__list">
            <a class="icon-footer__come-link" href="#">
              <svg class="icon-footer__come-icon">
                <use href="../img/icons.svg#icon-linkedin2"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <div class="section-newsletter">
        <h3 class="section-newsletter__sing-up">Zapisz się do newslettera</h3>
        <form
          class="section-newsletter__style"
          @submit.prevent="handleSubscribe"
        >
          <label>
            <input
              ref="newsletterInput"
              class="section-newsletter__box section-newsletter--text-visible"
              type="email"
              placeholder="E-mail"
              v-model="email"
            />
          </label>
          <Button
            class="section-newsletter__button"
            label="Zapisz się"
            icon="pi pi-send"
            severity="success"
            type="submit"
          />
          <Toast ref="toast" position="bottom-right" class="custom-toast" />
        </form>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import Button from "primevue/button";

export default {
  name: "FooterDiv",
  components: {
    Toast,
    Button,
  },
  setup() {
    const toast = useToast();
    const email = ref(""); // Bound input value to a ref

    const handleSubscribe = () => {
      if (!email.value) {
        toast.add({
          severity: "error",
          summary: "Błąd",
          detail: "Wpisz poprawny adres e-mail.",
          life: 3000,
          styleClass: "toast-error",
        });
        return;
      }

      // Send newsletter subscription request to the server
      // ...

      toast.add({
        severity: "success",
        summary: "Dzięki!",
        detail: "Udało Ci się zapisać do naszego newslettera.",
        life: 3000,
        styleClass: "toast-success",
      });

      email.value = ""; // Clear input after successful submission
    };

    return {
      toast,
      email,
      handleSubscribe,
    };
  },
};
</script>

<style>
.footer {
  min-width: 320px;
  text-align: center;
  position: absolute;
  border-top: 1px solid rgba(43, 43, 48);
  width: 100%;
  padding-bottom: 30px;
  left: 0px;
  background: rgb(24, 24, 27);
  border-radius: 14px 14px 0px 0px;
}
.footer__style {
  padding-top: 60px;
}
.footer__logo {
  font-family: "Raleway", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  text-decoration: none;
  color: #ffffff;
  line-height: 1.19;
}
.footer--color-logo {
  color: rgb(52, 211, 153);
}
.footer__list {
  justify-content: center;
  font-size: 14px;
  list-style: none;
  line-height: 1.71;
  margin-top: 0px;
  padding: 0px;
  padding-top: 20px;
}
.footer__contact {
  font-family: "Roboto";
  font-style: normal;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  transition: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.footer--padding {
  padding-bottom: 9px;
}
.footer .footer__contact:hover,
.footer .footer__contact:focus {
  color: rgb(52, 211, 153);
}
.footer--color-city {
  color: #ffffff;
}

@media screen and (min-width: 768px) {
  .footer__style {
    padding-left: 76px;
  }
  .footer__nav {
    float: left;
    padding-right: 70px;
  }
}
@media screen and (min-width: 1200px) {
  .footer__style {
    padding-left: 0;
  }
  .footer {
    align-items: flex-start;
    text-align: start;
  }
}
.icon-footer__heading {
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: #ffffff;
  margin-top: 0px;
  padding-top: 52px;
  margin-bottom: 20px;
  text-transform: uppercase;
}
.icon-footer__social {
  list-style: none;
  padding: 0px;
  display: flex;
  justify-content: center;
}
.icon-footer__list {
  display: inline-block;
  margin-right: 10px;
}
.icon-footer__come-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-footer__come-link:hover {
  background-color: rgb(52, 211, 153);
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.icon-footer__come-icon {
  width: 20px;
  height: 20px;
  fill: #ffffff;
}

@media screen and (min-width: 768px) {
  .icon__footer {
    position: relative;
    float: left;
    padding-right: 78px;
  }
  .icon-footer__heading {
    padding-top: 72px;
  }
}
@media screen and (min-width: 1200px) {
  .icon-footer__social {
    justify-content: stretch;
  }
  .icon-footer {
    float: left;
  }
}

.section-newsletter {
  padding-top: 32px;
}
.section-newsletter__sing-up {
  color: #ffffff;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.section-newsletter__style {
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  justify-content: center;
}
.section-newsletter__button {
  margin-left: auto;
  margin-right: auto;
  width: 200px;
  height: 50px;
  background: rgb(52, 211, 153) !important; /* znaleźć czemu tak sie dzieje */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  border-color: transparent;
  margin-top: 20px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  padding-left: 42px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.06em;
  color: rgb(24, 24, 27);
}
.section-newsletter__icon {
  fill: rgb(24, 24, 27);
  width: 24px;
  height: 24px;
  margin-right: 28px;
}
.section-newsletter__box {
  max-width: 450px;
  width: 100%;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.15));
  border-radius: 4px;
  border-color: rgba(255, 255, 255, 0.3019607843);
  background-color: rgba(33, 150, 243, 0);
  color: rgba(33, 150, 243, 0);
  padding-left: 16px;
  margin-top: 20px;
}
.section-newsletter--text-visible::-moz-placeholder {
  color: rgba(117, 117, 117, 0.5019607843);
}
.section-newsletter--text-visible:-ms-input-placeholder {
  color: rgba(117, 117, 117, 0.5019607843);
}
.section-newsletter--text-visible::placeholder {
  color: rgba(117, 117, 117, 0.5019607843);
}

@media screen and (min-width: 768px) {
  .section-newsletter {
    margin-top: 40px;
  }
}
@media screen and (min-width: 1200px) {
  .section-newsletter {
    padding-left: 78px;
    padding-top: 26px;
    float: left;
  }
  .section-newsletter__box {
    width: 358px;
    margin-right: 12px;
  }
  .section-newsletter__style {
    flex-direction: row;
    margin-right: 12px;
  }
  .section-newsletter__sing-up {
    margin: 0;
  }
}

.p-toast {
  bottom: -5px !important;
  right: 10px !important;
}
</style>
