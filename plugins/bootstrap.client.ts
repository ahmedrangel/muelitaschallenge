import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/collapse";
import Tooltip from "bootstrap/js/dist/tooltip";
import Offcanvas from "bootstrap/js/dist/offcanvas";
import Popover from "bootstrap/js/dist/popover";
import Carousel from "bootstrap/js/dist/carousel";
import Modal from "bootstrap/js/dist/modal";
import Toast from "bootstrap/js/dist/toast";
import Tab from "bootstrap/js/dist/tab";

class Bootstrap {
  hideModal (id: HTMLElement) {
    const instance = Modal.getInstance(id);
    if (instance) instance.hide();
  }

  hideModalEscEvent () {
    document.addEventListener("keyup", (e) => {
      if (e.key !== "Escape") return;
      const modals = document.querySelectorAll(".modal.show");
      if (!modals.length) return;
      const id = modals[modals.length - 1].id;
      const instance = Modal.getInstance("#" + id);
      if (instance) instance.hide();
    });
  }

  showModal (id: HTMLElement) {
    const modal = new Modal(id);
    modal.show();
    return id;
  }

  showToast (id: HTMLElement) {
    const instance = Toast.getInstance(id);
    if (instance) return;
    const toast = new Toast(id);
    toast.show();
    return id;
  }

  startAllCarousel () {
    const carousels = document.querySelectorAll(".carousel");
    for (const carousel of carousels) {
      const carouselInstance = new Carousel(carousel);
      carouselInstance.cycle();
    }
  }

  initializePopover () {
    const popoverList = document.querySelectorAll("[data-bs-toggle=\"popover\"]");
    [...popoverList].map(e => new Popover(e, { trigger: "hover", placement: "top", html: true }));
  }

  initializeTooltip () {
    const tooltipList = document.querySelectorAll("[data-bs-toggle=\"tooltip\"]");
    [...tooltipList].map(e => new Tooltip(e, { trigger: "hover", placement: "top" }));
    const tooltipList2 = document.querySelectorAll("[data-bs-toggle=\"tooltip-last-updated\"]");
    [...tooltipList2].map(e => new Tooltip(e, { trigger: "manual", placement: "top", html: true }));
  }

  showOffcanvas (id: HTMLElement) {
    const offcanvas = new Offcanvas(id);
    offcanvas.show();
    return id;
  }

  initializeTab () {
    const tab = new Tab(".nav-tabs");
    tab.show();
  }
}

const bootstrap = new Bootstrap();

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:suspense:resolve", () => {
    bootstrap.initializePopover();
    bootstrap.initializeTooltip();
  });
  return {
    provide: { bootstrap, Tooltip }
  };
});
